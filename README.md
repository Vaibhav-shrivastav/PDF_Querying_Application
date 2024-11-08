# PDF Querying Application

This application allows users to upload a PDF document,  ask questions about the document, and receive answers based on the content. It uses a full-stack setup with React on the frontend and a server backend using FastAPI, LangChain, SQLite, and other advanced tools for processing PDF content.

## Table of Contents

1. [Technologies](#technologies)
2. [Features](#features)
3. [Getting Started](#getting_started)


## Technologies
- **Frontend**: React, TailwindCSS, Daisy UI, React Hot toast
- **Backend**: FastAPI, Langchain, Groq, Gemma(Model), Google GenAI Embeddings
- **Database**: SQLite


## Features
- **PDF Upload**: Upload a PDF document to use as a knowledge source.
- **Question-Answering**: Type a question to retrieve an answer based on the content of the uploaded document.Real-Time Responses
- **Real-Time Responses**: Users get visual feedback during PDF upload, question processing, and answer generation.
- **Conversation History**: The app stores the questions and answers in a conversation history for reference.

## Getting Started
Follow these instructions to set up and run the project on your local machine.

### Prerequisites
- Node.js
- npm (or Yarn)
- Python (for backend)
- Virtual environment (recommended for backend dependencies)

### Installation

#### Frontend Setup
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:Vaibhav-shrivastav/PDF_Querying_Application.git
   cd PDF_Querying_Application/client
   ```
2. **Install Dependencies**:
    ```bash
    npm install
    ```
3. **Run the Application**:
    ```bash
    npm run dev
    ```

#### Backend Setup
1. **Navigate to the backend directory:**:
    ```bash
    cd ../server
    ```



