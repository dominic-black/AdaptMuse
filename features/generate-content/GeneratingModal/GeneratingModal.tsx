"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export const GeneratingModal = ({
  showModal,
  jobId,
  generatedContent,
  onClose,
}: {
  showModal: boolean;
  jobId: string | null;
  generatedContent: string | null;
  onClose: () => void;
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

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

  return (
    <Modal
      isOpen={showModal}
      onClose={onClose}
      label=""
      showCloseButton={false}
    >
      <div className="relative flex flex-col justify-center items-center w-full min-h-[500px] overflow-y-scroll">
        {!generatedContent ? (
          <div className="flex flex-col items-center">
            <GeneratingAudienceAnimation width={100} height={100} />
            <p className="mt-4 font-semibold text-gray-700 text-lg">
              Generating Content...
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-w-full">
            <CheckCircle className="mb-4 w-16 h-16 text-green-500" />
            <h2 className="mb-2 font-bold text-gray-800 text-2xl">
              Content Generated!
            </h2>
            <div className="max-w-full max-h-full">
              <pre className="mb-6 text-gray-600 break-words whitespace-pre-wrap">
                {generatedContent}
              </pre>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
