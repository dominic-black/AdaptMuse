"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import Image from "next/image";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { BarChart3, Sparkles, CheckCircle } from "lucide-react";
import { Audience } from "@/types/audience";

export const AudienceCreatedModal = ({
  showAudienceModal,
  audienceFingerprint,
}: {
  showAudienceModal: boolean;
  audienceFingerprint: Audience | null;
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (audienceFingerprint) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 400);
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
      <div className="relative flex flex-col justify-center items-center w-full min-h-[500px]">
        {/* Loading State */}
        {!audienceFingerprint && (
          <div className="flex flex-col justify-center items-center gap-6 opacity-100 w-full transition-opacity duration-500 ease-in-out">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="space-y-2">
                  <h2 className="font-semibold text-gray-900 text-xl">
                    Creating Your Audience
                  </h2>
                  <p className="max-w-sm text-gray-600 text-sm">
                    Analyzing data and generating your target audience
                    fingerprint...
                  </p>
                </div>
              </div>
              <GeneratingAudienceAnimation width={200} height={200} />
            </div>
          </div>
        )}

        {/* Success State */}
        {audienceFingerprint && (
          <div
            className={`flex flex-col justify-center items-center gap-8 w-full transition-all duration-500 ease-in-out ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Success Header with Green Check */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex justify-center items-center bg-green-100 rounded-full w-16 h-16">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="font-bold text-gray-900 text-2xl">
                  Audience Created Successfully!
                </h2>
                <p className="text-gray-600 text-sm">
                  Your target audience fingerprint is ready for analysis
                </p>
              </div>
            </div>

            {/* Audience Info Card */}
            <div className="w-full max-w-md">
              <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex justify-center items-center bg-gray-50 p-1 rounded-lg w-10 h-10">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                      alt="Audience icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {audienceFingerprint.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {audienceFingerprint.entities.length} entities analyzed
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="gap-3 grid grid-cols-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-gray-900 text-lg">
                      {Object.keys(audienceFingerprint.ageTotals).length}
                    </div>
                    <div className="text-gray-600 text-xs">Age Groups</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-gray-900 text-lg">
                      {audienceFingerprint.demographics.length}
                    </div>
                    <div className="text-gray-600 text-xs">Data Points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-row flex-col gap-3 w-full max-w-md">
              <Button
                variant="primary"
                className="flex-1 gap-2 h-12"
                onClick={() => {
                  router.push(`/audience/${audienceFingerprint.id}`);
                }}
              >
                <BarChart3 className="w-4 h-4" />
                Analyze Audience
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 h-12"
                onClick={() => {
                  router.push(`/generate-content`);
                }}
              >
                <Sparkles className="w-4 h-4" />
                Generate Content
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
