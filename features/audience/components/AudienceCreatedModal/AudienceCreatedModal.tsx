"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal/Modal";
import Image from "next/image";
import { GeneratingAudienceAnimation } from "@/components/animations/audience/GeneratingAudienceAnimation";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Sparkles,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Eye,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Audience } from "@/types/audience";
import { formatAgeGroupLabel } from "@/utils/audience";

export const AudienceCreatedModal = ({
  showAudienceModal,
  audienceFingerprint,
  onClose,
}: {
  showAudienceModal: boolean;
  audienceFingerprint: Audience | null;
  onClose?: () => void;
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSuccessContent, setShowSuccessContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (audienceFingerprint) {
      // Small delay to let loading animation finish gracefully
      const showContentTimer = setTimeout(() => {
        setShowSuccessContent(true);
        // Then fade in the content
        setTimeout(() => {
          setIsContentVisible(true);
          // Finally show insights
          setTimeout(() => setShowInsights(true), 400);
        }, 100);
      }, 800);

      return () => clearTimeout(showContentTimer);
    } else {
      setShowSuccessContent(false);
      setIsContentVisible(false);
      setShowInsights(false);
    }
  }, [audienceFingerprint]);

  // Calculate insights
  const getTopAgeGroup = () => {
    if (!audienceFingerprint?.ageTotals) return "Mixed";
    const topAge = Object.entries(audienceFingerprint.ageTotals).sort(
      ([, a], [, b]) => b - a
    )[0];
    return topAge ? formatAgeGroupLabel(topAge[0]) : "Mixed";
  };

  const getDominantGender = () => {
    if (!audienceFingerprint?.genderTotals) return "Mixed";
    const { male = 0, female = 0 } = audienceFingerprint.genderTotals;
    if (Math.abs(male - female) < 0.1) return "Mixed";
    return male > female ? "Male-leaning" : "Female-leaning";
  };

  const getTopInterests = () => {
    if (!audienceFingerprint?.entities) return [];
    return audienceFingerprint.entities
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3);
  };

  return (
    <Modal
      isOpen={showAudienceModal}
      onClose={onClose || (() => {})}
      label="Audience Creation"
      showCloseButton={!!onClose}
    >
      <div className="flex flex-col w-full h-full">
        {!audienceFingerprint || !showSuccessContent ? (
          // Loading State
          <div className="flex flex-col flex-grow justify-center items-center p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
              <div className="relative w-[240px] h-[240px]">
                <GeneratingAudienceAnimation width={240} height={240} />
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <h2 className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-gray-900 text-transparent text-3xl">
                {audienceFingerprint
                  ? "Finalizing Your Audience"
                  : "Crafting Your Audience"}
              </h2>
              <p className="max-w-md text-gray-600 text-lg leading-relaxed">
                {audienceFingerprint
                  ? "Preparing your personalized audience insights and recommendations..."
                  : "Our AI is analyzing thousands of data points to create your perfect audience fingerprint"}
              </p>

              <div className="flex justify-center items-center gap-2 mt-6">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full bg-blue-500 animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm">
                  {audienceFingerprint
                    ? "Finalizing insights..."
                    : "Processing insights..."}
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Success State
          <div
            className={`flex flex-col w-full h-full transition-all duration-700 ease-out p-8 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-2xl rounded-full animate-pulse" />
                <div className="relative flex justify-center items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full w-20 h-20">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h2 className="mb-3 font-bold text-gray-900 text-4xl">
                Audience Created Successfully!
              </h2>
              <p className="max-w-lg text-gray-600 text-lg leading-relaxed">
                Your AI-powered audience fingerprint is ready. Here&apos;s what
                we discovered about your target audience.
              </p>
            </div>

            {/* Audience Card */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 shadow-xl mb-8 p-6 border border-gray-100 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm rounded-xl" />
                  <div className="relative flex justify-center items-center bg-white shadow-sm p-2 rounded-xl w-16 h-16">
                    <Image
                      src={
                        audienceFingerprint.imageUrl ||
                        "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                      }
                      alt="Audience avatar"
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-bold text-gray-900 text-2xl">
                    {audienceFingerprint.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {audienceFingerprint.entities.length +
                        audienceFingerprint.recommendedEntities.length}{" "}
                      interest points analyzed
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div
                className={`space-y-4 transition-all duration-500 delay-300 ${
                  showInsights
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="gap-4 grid grid-cols-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="font-bold text-blue-900 text-lg">
                      {getTopAgeGroup()}
                    </div>
                    <div className="text-blue-700 text-xs">Primary Age</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="font-bold text-purple-900 text-lg">
                      {getDominantGender()}
                    </div>
                    <div className="text-purple-700 text-xs">Gender Split</div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <Eye className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="font-bold text-emerald-900 text-lg">
                      {audienceFingerprint.recommendedEntities.length}
                    </div>
                    <div className="text-emerald-700 text-xs">
                      Additional Cultural Correlates
                    </div>
                  </div>
                </div>

                {/* Top Interests Preview */}
                {getTopInterests().length > 0 && (
                  <div className="bg-gray-50/50 p-4 rounded-xl">
                    <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-800 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Top Interests Discovered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getTopInterests().map((interest) => (
                        <span
                          key={interest.id}
                          className="bg-white shadow-sm px-3 py-1 border border-gray-200 rounded-full text-gray-700 text-sm"
                        >
                          {interest.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
              <Button
                variant="primary"
                className="group relative flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl px-6 py-4 rounded-xl overflow-hidden font-semibold text-white text-base transition-all duration-200"
                onClick={() => {
                  router.push(`/audience/${audienceFingerprint.id}`);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <BarChart3 className="relative w-5 h-5" />
                <span className="relative">Analyze Audience</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </Button>

              <Button
                variant="outline"
                className="group flex justify-center items-center gap-3 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 shadow-lg hover:shadow-xl px-6 py-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl font-semibold text-gray-700 hover:text-purple-700 text-base transition-all duration-200"
                onClick={() => {
                  router.push(`/generate-content`);
                }}
              >
                <Sparkles className="w-5 h-5 group-hover:text-purple-600 transition-colors duration-200" />
                <span>Generate Content</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </Button>
            </div>

            {/* Footer Hint */}
            <div className="flex justify-center items-center gap-2 py-6 text-center">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-2 h-2 animate-pulse" />
              <p className="text-gray-500 text-sm">
                Ready to create content that resonates with your audience
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
