import React, { useState } from "react";
import sendIcon from "../media/sendIcon.png";
import { usePDF } from "../context/PDFContext";

function Prompt() {
  // Retrieving functions and states from Context API
  const { askQuestion, documentId, isProcessing } = usePDF();
  const [inputValue, setInputValue] = useState("");

  // Function to ask questions
  const handlePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await askQuestion(inputValue);
    setInputValue("");
  };

  return (
    // Prompt Component
    <div className="flex justify-center items-center py-8 mx-8">
      <div className="relative w-full">
        {/* Input form to type question  */}
        <form onSubmit={handlePrompt}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!documentId || isProcessing}
            className="bg-white p-3 pr-10 w-full border border-[#E4E8EE] rounded-md text-sm text-[#6E7583]"
            placeholder="Send a message..."
          />

          <button type="submit" disabled={!documentId || isProcessing}>
            <img
              src={sendIcon}
              alt="Send"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Prompt;
