import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Define the shape of the context value
type PDFContextType = {
  documentId: number | null; // Stores the ID of the uploaded document
  uploadPDF: (file: File) => Promise<void>; // Function to handle PDF uploads
  askQuestion: (question: string) => Promise<string | null>; // Function to handle asking questions about the PDF
  isLoading: boolean; // Loading state for PDF upload
  fileUploadStatus: boolean; // Boolean indicating if a file has been uploaded successfully
  convos: { question: string; response: string }[]; // Array of conversation objects containing questions and responses
  isProcessing: boolean; // Loading state for processing a question
};

const PDFContext = createContext<PDFContextType | undefined>(undefined);

// PDFProvider component wraps child components and provides them access to the PDFContext
export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the uploaded document ID (null if no document is uploaded)
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State for tracking upload progress
  const [fileUploadStatus, setFileUploadStatus] = useState(false); // Boolean indicating successful upload
  const [convos, setConvos] = useState<
    { question: string; response: string }[]
  >([]); // Array of Q&A conversations
  const [isProcessing, setIsProcessing] = useState(false); // State for tracking question processing

  // Function to upload a PDF file to the server and store the document ID upon successful upload
  const uploadPDF = async (file: File) => {
    const formData = new FormData(); 
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/upload_pdf/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDocumentId(response.data.document_id); 
      toast.success("PDF uploaded successfully."); 
      setFileUploadStatus(true);
    } catch (error) {
      toast.error("Failed to upload PDF."); 
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  // Function to ask a question based on the uploaded PDF document
  const askQuestion = async (question: string) => {
    if (!documentId) {
      // Check if a document is uploaded
      toast.error("Upload a PDF first.");
      return null;
    }

    setIsProcessing(true); 
    setConvos((prevConvos) => [...prevConvos, { question, response: "" }]); 

    try {
      const response = await axios.post("http://localhost:8000/ask_question/", {
        question,
        document_id: documentId,
      });
      const res: string = response.data.answer; 

      setConvos((prevConvos) =>
        prevConvos.map((convo) =>
          convo.question === question ? { ...convo, response: res } : convo
        )
      );
      return res;
    } catch (error) {
      toast.error("Failed to get answer.");
      console.error(error);
      return null;
    } finally {
      setIsProcessing(false); 
    }
  };

  // Provide context values for child components, allowing access to document ID, upload, and question handling
  return (
    <PDFContext.Provider
      value={{
        documentId,
        uploadPDF,
        askQuestion,
        isLoading,
        fileUploadStatus,
        convos,
        isProcessing,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

// Custom hook to access PDFContext, ensuring it is used within the provider
export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) throw new Error("usePDF must be used within a PDFProvider");
  return context;
};
