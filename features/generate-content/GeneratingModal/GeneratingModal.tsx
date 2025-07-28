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
      }, 100);
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
      <div className="relative flex flex-col justify-center items-center p-8 w-full min-h-[400px] text-center">
        {!generatedContent ? (
          <div className="flex flex-col items-center">
            <GeneratingContentAnimation width={300} height={300} />
            <p className="mt-4 font-medium text-gray-600 text-lg">
              Generating Content...
            </p>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center transition-opacity duration-500 w-full ${
              isContentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-green-100 mb-4 p-3 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="mb-2 font-bold text-gray-900 text-2xl">
              Content Generated Successfully!
            </h2>
            <p className="mb-6 max-w-md text-gray-600">
              Here is the content generated for your audience. You can copy it
              or close this window.
            </p>
            <div className="relative bg-gray-50 mb-6 p-4 border border-gray-200 rounded-lg w-full max-w-2xl max-h-60 overflow-y-auto">
              <pre className="text-gray-800 text-sm text-left break-words whitespace-pre-wrap">
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
            <div className="flex gap-4">
              <Button onClick={handleMakeChanges} variant="outline">
                Make Changes
              </Button>
              <Button variant="outline">View Comparison</Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
