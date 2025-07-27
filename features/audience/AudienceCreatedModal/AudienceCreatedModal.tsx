"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import Image from "next/image";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export const AudienceCreatedModal = ({
  showAudienceModal,
  audienceFingerprint,
}: {
  showAudienceModal: boolean;
  audienceFingerprint: any | null;
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (audienceFingerprint) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [audienceFingerprint]);

  return (
    <Modal
      isOpen={showAudienceModal}
      onClose={() => {}}
      label=""
      showCloseButton={false}
    >
      <div className="relative flex flex-col justify-center items-center gap-4 pb-10 w-full h-full">
        {/* Loading State */}
        {!audienceFingerprint && (
          <div className="flex flex-col justify-center items-center gap-4 opacity-100 w-full h-full transition-opacity duration-500 ease-in-out">
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-lg text-center">
                Creating target audience fingerprint
              </p>
              <GeneratingAudienceAnimation width={300} height={300} />
            </div>
          </div>
        )}

        {/* Success State */}
        {audienceFingerprint && (
          <div
            className={`flex flex-col justify-center items-center gap-4 w-full h-full transition-opacity duration-500 ease-in-out ${
              isContentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-lg text-center">
                {audienceFingerprint.name}
              </p>
              <div className="flex justify-center items-center w-[300px] h-[300px]">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                  alt="Audience created"
                  width={250}
                  height={250}
                />
              </div>
              <div className="bottom-0 left-0 absolute flex gap-4 w-full">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    router.push(`/audience/${audienceFingerprint.id}`);
                  }}
                >
                  Analyze audience
                </Button>
                <Button variant="primary" className="w-full">
                  Generate content for audience
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
