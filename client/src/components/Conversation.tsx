import shortLogo from "../media/shortLogo.png";
import { usePDF } from "../context/PDFContext";

function Conversation() {
  // Retrieving states from Context API
  const { convos, fileUploadStatus } = usePDF();

  return (
    <>
      {/*  Conversation Component */}
      {fileUploadStatus ? (
        convos.length === 0 ? (
          <div className="flex justify-center items-center">
            <p>Great! How can I assist you today?</p>
          </div>
        ) : (
            <div className="mx-4 lg:mx-14 my-3">
            {/* Mapping user questions and responses  */}
            {convos.map((m, i) => (
              <div key={i} className="flex flex-col gap-4 my-3">
                {/* Question  */}
                <div className="flex flex-row items-center gap-5">
                  <span className="bg-[#B0ACE9] rounded-full px-3.5 py-1 text-white text-2xl">
                    S
                  </span>
                  <span className="font-medium">{m.question}</span>
                </div>
                {/* Response  */}
                {m.response === "" ? (
                  <div className="flex ml-14 w-52 flex-col gap-4">
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-5">
                    <div className="">
                      <img src={shortLogo} className="h-fit" alt="" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{m.response}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center">
          <p>🗃️Upload PDF to get started</p>
        </div>
      )}

      
    </>
  );
}

export default Conversation;
