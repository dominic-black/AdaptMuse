"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  FileText,
  Edit3,
} from "lucide-react";
import { GeneratingContentAnimation } from "@/components/animations/editing/GeneratingContentAnimation";
import { Job } from "@/types/job";

export interface GeneratingModalProps {
  showModal: boolean;
  job: Job | null;
  onClose: () => void;
  onMakeChanges: (content: string) => void;
}

export const GeneratingModal = ({
  showModal,
  job,
  onClose,
  onMakeChanges,
}: GeneratingModalProps) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (job?.generatedContent) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [job?.generatedContent]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (job?.generatedContent) {
      try {
        await navigator.clipboard.writeText(job.generatedContent);
        setCopied(true);
      } catch (error) {
        console.error("Failed to copy content:", error);
        // Fallback for older browsers or when clipboard API is not available
        const textArea = document.createElement("textarea");
        textArea.value = job.generatedContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
      }
    }
  };

  const handleMakeChanges = () => {
    if (job?.generatedContent) {
      onMakeChanges(job.generatedContent);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={onClose}
      label="Content Generation"
      showCloseButton={true}
    >
      <div className="flex flex-col w-full h-full min-h-[500px]">
        {!job?.generatedContent ? (
          // Loading State
          <div className="flex flex-col flex-grow justify-center items-center p-8 text-center">
            <div className="mb-8">
              <GeneratingContentAnimation width={200} height={200} />
            </div>

            <div className="space-y-4 max-w-md">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <h2 className="font-semibold text-gray-900 text-2xl">
                  Generating Content
                </h2>
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              </div>

              <p className="text-gray-600 text-base leading-relaxed">
                Our AI is analyzing your audience and crafting personalized
                content. This usually takes just a few seconds.
              </p>

              <div className="flex justify-center items-center gap-2 pt-4">
                <div className="bg-blue-400 rounded-full w-2 h-2 animate-bounce"></div>
                <div
                  className="bg-purple-400 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="bg-indigo-400 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          // Success State
          <div
            className={`flex flex-col w-full h-full transition-all duration-700 ease-out ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-green-100 border-b text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full w-16 h-16 animate-ping"></div>
                  <div className="relative flex justify-center items-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-16 h-16">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="mb-2 font-bold text-gray-900 text-2xl">
                Content Generated Successfully!
              </h2>
              <p className="font-medium text-green-700 text-sm">
                Your personalized content is ready for review
              </p>
            </div>

            {/* Content Display */}
            <div className="flex-grow p-6 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex flex-shrink-0 justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Generated Content
                    </h3>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        copied
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300"
                      }
                    `}
                    aria-label="Copy generated content to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="relative flex-grow min-h-0">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 border border-gray-200 rounded-xl h-full overflow-hidden">
                    <div className="scrollbar-thumb-rounded h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                      <pre className="font-sans text-gray-800 text-sm break-words leading-relaxed whitespace-pre-wrap">
                        {job?.generatedContent}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 p-4 sm:p-6 border-gray-100 border-t">
              <div className="flex sm:flex-row flex-col justify-center gap-3 mx-auto max-w-sm sm:max-w-md">
                <Button
                  onClick={handleMakeChanges}
                  variant="outline"
                  size="md"
                  className="sm:flex-1 w-full sm:w-auto"
                >
                  <Edit3 className="mr-2 w-4 h-4" />
                  Make Changes
                </Button>
                <Button
                  href={`/jobs/${job?.id}`}
                  variant="primary"
                  size="md"
                  className="sm:flex-1 w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 w-4 h-4" />
                  Complete
                </Button>
              </div>

              <p className="mt-3 sm:mt-4 px-4 text-gray-500 text-xs text-center">
                You can always make changes to your content later
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thumb-rounded::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </Modal>
  );
};
