import React, { useState } from "react";
import toast from "react-hot-toast";
import { usePDF } from "../context/PDFContext";
import Logo from "../media/logo.png";
import addIcon from "../media/addicon.png";
import fileLogo from "../media/fileLogo.png";

function Navbar() {
  // Retrieving functions and states from Context API
  const { uploadPDF, isLoading, fileUploadStatus } = usePDF();
  const [file, setFile] = useState<File | null>(null);

  // Function to select and upload PDF
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      await uploadPDF(selectedFile);
      setFile(selectedFile);
      
    } else {
      toast.error("No file selected.");
    }
  };

  return (
    <>
      {/* Navbar  */}
      <div className="h-[77px] bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <div className="flex flex-row justify-between items-center my-5 mx-8">
          {/* Organisation Logo  */}
          <div>
            <img src={Logo} alt="Company Logo" />
          </div>
          {/* Upload File component  */}
          <div className="flex flex-row gap-4 items-center sm:h-2">
            {/* To Display Selected File name  */}
            {file ? (
              <span className="flex flex-row flex-wrap items-center gap-2 sm:h-4 sm:gap-4">
                <img src={fileLogo} alt="" className="h-4 w-4 sm:h-6 sm:w-6" />
                <p className="text-[#0FA958] text-xs sm:text-sm">{file.name}</p>
              </span>
            ) : isLoading ? (
              <span className="loading loading-ring loading-lg"></span>
            ) : (
              <></>
            )}
            {/* Input method to choose file  */}
            <label htmlFor="file-upload" className="inline-block">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute overflow-hidden bg-clip-content opacity-0"
                id="file-upload"
              />
              <span className="flex flex-row gap-2 items-center border border-gray-600 p-2 rounded-md">
                <img src={addIcon} className="h-fit" alt="" />
                <span className="font-semibold text-sm hidden sm:block">
                  Upload PDF
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
