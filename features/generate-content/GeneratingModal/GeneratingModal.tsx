"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Copy } from "lucide-react";
import { GeneratingContentAnimation } from "@/components/animations/editing/GeneratingContentAnimation";

export const GeneratingModal = ({
  showModal,
  generatedContent,
  onClose,
  onMakeChanges,
}: {
  showModal: boolean;
  generatedContent: string | null;
  onClose: () => void;
  onMakeChanges: (content: string) => void;
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  useEffect(() => {
    if (generatedContent) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [generatedContent]);

  useEffect(() => {
    if (copyButtonText === "Copied!") {
      const timer = setTimeout(() => {
        setCopyButtonText("Copy");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copyButtonText]);

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopyButtonText("Copied!");
    }
  };

  const handleMakeChanges = () => {
    if (generatedContent) {
      onMakeChanges(generatedContent);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={onClose}
      label="Content Generation"
      showCloseButton={true}
    >
      <div className="flex flex-col w-full h-full">
        {!generatedContent ? (
          <div className="flex flex-col flex-grow justify-center items-center p-4 sm:p-6 md:p-8 text-center">
            <div className="w-[200px] h-[200px]">
              <GeneratingContentAnimation width={200} height={200} />
            </div>
            <h2 className="mt-6 font-semibold text-gray-900 text-xl sm:text-2xl">
              Generating Content
            </h2>
            <p className="mt-2 max-w-sm text-gray-600 text-sm sm:text-base">
              Our AI is crafting content for your audience, please wait a
              moment.
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col w-full h-full transition-all duration-500 ease-in-out ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto text-center">
              <div className="flex flex-col items-center mx-auto max-w-2xl">
                <div className="flex justify-center items-center bg-green-100 rounded-full w-14 sm:w-16 h-14 sm:h-16">
                  <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
                </div>
                <h2 className="mt-4 font-bold text-gray-900 text-2xl sm:text-3xl">
                  Content Generated!
                </h2>
                <p className="mt-2 mb-6 text-gray-600 text-sm sm:text-base">
                  Review the generated content below.
                </p>
                <div className="relative bg-gray-50 mb-6 p-4 border border-gray-200 rounded-lg w-full max-h-72 overflow-y-auto text-left">
                  <pre className="text-gray-800 text-sm break-words whitespace-pre-wrap">
                    {generatedContent}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="top-2 right-2 absolute flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md font-semibold text-gray-700 text-xs"
                  >
                    <Copy size={12} />
                    {copyButtonText}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white p-4 border-gray-200 border-t">
              <div className="flex sm:flex-row flex-col justify-center gap-3 mx-auto w-full max-w-lg">
                <Button
                  onClick={handleMakeChanges}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Make Changes
                </Button>
                <Button variant="primary" className="w-full sm:w-auto">
                  View Comparison
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
