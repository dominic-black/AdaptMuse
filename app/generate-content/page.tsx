"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { ContentGenerator } from "@/features/generate-content/components/ContentGenerator/ContentGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { Job } from "@/types/job";

interface PageState {
  job: Job | null;
  jobLoading: boolean;
  jobError: string | null;
}

export default function GenerateContentPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [pageState, setPageState] = useState<PageState>({
    job: null,
    jobLoading: false,
    jobError: null,
  });

  /**
   * Fetches job data from Firestore based on jobId parameter
   */
  const fetchJobData = useCallback(async (jobId: string, userId: string) => {
    setPageState((prev) => ({ ...prev, jobLoading: true, jobError: null }));

    try {
      const jobDocRef = doc(db, `users/${userId}/jobs/${jobId}`);
      const jobDoc = await getDoc(jobDocRef);

      if (jobDoc.exists()) {
        const jobData = { id: jobDoc.id, ...jobDoc.data() } as Job;
        setPageState((prev) => ({ ...prev, job: jobData, jobLoading: false }));
      } else {
        setPageState((prev) => ({
          ...prev,
          jobError: "Job not found",
          jobLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      setPageState((prev) => ({
        ...prev,
        jobError: "Failed to load job data",
        jobLoading: false,
      }));
    }
  }, []);

  /**
   * Effect to load job data when URL parameters change
   */
  useEffect(() => {
    const jobId = searchParams.get("job");

    if (jobId && user?.uid) {
      fetchJobData(jobId, user.uid);
    } else {
      // Clear job data if no jobId or user
      setPageState((prev) => ({ ...prev, job: null, jobError: null }));
    }
  }, [searchParams, user?.uid, fetchJobData]);

  /**
   * Determines if all required data is loaded and ready
   */
  const isDataReady = useMemo(() => {
    // Still loading authentication
    if (authLoading) return false;

    // No user but auth is done - ready to show login state
    if (!user) return true;

    // Job is being fetched
    if (pageState.jobLoading) return false;

    // All data loaded
    return true;
  }, [authLoading, user, pageState.jobLoading]);

  /**
   * Show error message if job failed to load
   */
  if (pageState.jobError) {
    return (
      <Screen heading="Content Generator">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="mb-2 text-red-600">Error loading job</p>
            <p className="text-gray-600">{pageState.jobError}</p>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen heading="Content Generator">
      <ContentGenerator loading={!isDataReady} job={pageState.job} />
    </Screen>
  );
}
