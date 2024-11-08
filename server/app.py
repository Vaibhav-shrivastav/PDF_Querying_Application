# main.py
import os
import time
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from pydantic import BaseModel
import shutil
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Langchain Server",
    version="1.0.0",
    description="A simple API server"
)

# Enabled CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #React Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base = declarative_base()

# Set up database connection
DATABASE_URL = os.getenv("DATABASE_URL") #SQLITE database
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Document metadata model for SQLAlchemy
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Initialized Model and Embeddings
llm = ChatGroq(groq_api_key=os.getenv("GROQ_API_KEY"), model_name="Gemma-7b-it")
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Global in-memory storage for vector store
vectors = None

# Prompt template for LangChain
prompt_template = ChatPromptTemplate.from_template(
    """
    Answer the questions based on the provided context only.
    Please provide the most accurate response based on the question.
    <context>
    {context}
    <context>
    Questions:{input}
    """
)

# Data model for question input
class QuestionRequest(BaseModel):
    question: str
    document_id: int

# Home Route 
@app.get("/")
def home():
    return {'message': "This is LangChain API server"}

# ROUTE TO UPLOAD PDF
# - Extracts text and creates embeddings
# - Creates vector store from document chunks
# - Saves document metadata to database
@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        os.makedirs("./uploads", exist_ok=True)
        # Save PDF to a local file
        file_path = f"./uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the PDF (Extract text and create embeddings)
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs)

        # Create vector store from document chunks
        global vectors
        vectors = FAISS.from_documents(final_documents, embeddings_model)

        # Save document metadata to database
        db = SessionLocal()
        db_document = Document(filename=file.filename)
        db.add(db_document)
        db.commit()
        db.refresh(db_document)

        return {"message": "PDF uploaded successfully", "document_id": db_document.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ROUTE TO ASK QUESTIONS 
# - Uses Vector store to retreive relevant context and generates answer
@app.post("/ask_question/")
async def ask_question(request: QuestionRequest):
    try:
        # Retrieve the document metadata from the database
        db = SessionLocal()
        document = db.query(Document).filter(Document.id == request.document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Use vector store to retrieve relevant context
        document_chain = create_stuff_documents_chain(llm, prompt_template)
        retriever = vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        # Generate the answer
        start = time.process_time()
        response = retrieval_chain.invoke({"input": request.question})
        response_time = time.process_time() - start

        return {
            "answer": response["answer"],
            "response_time": response_time,
            "document_content": [doc.page_content for doc in response["context"]]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))