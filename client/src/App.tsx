import Navbar from "./components/Navbar";
import Conversation from "./components/Conversation";
import Prompt from "./components/Prompt";
import { PDFProvider } from "./context/PDFContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <PDFProvider>
      <div className="flex flex-col min-h-screen">
        {/* NAVBAR  */}
        <Navbar />

        {/* CONVERSATION  */}
        <div className="flex-grow pt-20 pb-16 overflow-y-auto">
          <div className="container mx-auto px-4">
            <Conversation />
          </div>
        </div>

        {/* PROMPT  */}
        <div className="fixed bottom-0 left-0 w-full z-10">
          <Prompt />
        </div>

        {/* Toast component  */}
        <Toaster />
      </div>
    </PDFProvider>
  );
}
