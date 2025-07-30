"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";
import { useAudiences } from "@/hooks/useAudiences";
import { useJobs } from "@/providers/JobsProvider";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";
import { StatCards } from "@/features/dashboard/StatCards/StatCards";
import { RecentActivity } from "@/features/dashboard/RecentActivity/RecentActivity";
import { SavedAudiences } from "@/features/dashboard/SavedAudiences/SavedAudiences";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { jobs, loading: jobsLoading } = useJobs();
  const { user, loading: authLoading } = useAuth();

  // Comprehensive data ready check
  const isDataReady = useMemo(() => {
    // Must have auth completed
    if (authLoading || user === undefined) return false;

    // If no user, we're ready (shows login state)
    if (!user) return true;

    // For authenticated users, wait for all data providers to complete
    if (audiencesLoading || jobsLoading) return false;

    // All loading states are false and we have defined arrays (even if empty)
    return Array.isArray(audiences) && Array.isArray(jobs);
  }, [authLoading, user, audiencesLoading, jobsLoading, audiences, jobs]);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-2 font-extrabold text-transparent text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            Dashboard
          </h1>
          <p className="opacity-80 text-[var(--color-text)] text-sm sm:text-base lg:text-lg leading-relaxed">
            Welcome back! Here&apos;s an overview of your content performance
            and audience insights
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {user && !user.emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <VerifyEmailBanner />
            </motion.div>
          )}

          {/* Always show StatCards component - it handles its own loading state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/60 shadow-xl backdrop-blur-lg p-6 sm:p-8 border border-white/50 rounded-2xl sm:rounded-3xl"
          >
            <StatCards
              jobs={jobs}
              jobsLoading={!isDataReady}
              audiences={audiences}
              audiencesLoading={!isDataReady}
            />
          </motion.div>

          <div className="items-start gap-6 lg:gap-8 grid grid-cols-1 lg:grid-cols-3">
            {/* Always show RecentActivity component - it handles its own loading state */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2 bg-white/60 shadow-xl backdrop-blur-lg p-6 sm:p-8 border border-white/50 rounded-2xl sm:rounded-3xl"
            >
              <RecentActivity jobs={jobs} jobsLoading={!isDataReady} />
            </motion.div>

            {/* Always show SavedAudiences component - it handles its own loading state */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/60 shadow-xl backdrop-blur-lg p-6 sm:p-8 border border-white/50 rounded-2xl sm:rounded-3xl"
            >
              <SavedAudiences
                audiences={audiences}
                audiencesLoading={!isDataReady}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
