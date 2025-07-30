"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { ContentGenerator } from "@/features/generate-content/ContentGenerator/ContentGenerator";
import { useAudiences } from "@/hooks/useAudiences";
import { useAuth } from "@/hooks/useAuth";
import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { Job } from "@/types/job";

export default function BotPage() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (jobId && user) {
      const getJob = async () => {
        const jobDoc = await getDoc(doc(db, `users/${user.uid}/jobs/${jobId}`));
        if (jobDoc.exists()) {
          setJob(jobDoc.data() as Job);
        }
      };
      getJob();
    }
  }, [searchParams, user]);

  const isDataReady = useMemo(() => {
    if (authLoading || user === undefined) return false;

    if (!user) return true;

    if (audiencesLoading) return false;

    return Array.isArray(audiences);
  }, [authLoading, user, audiencesLoading, audiences]);

  return (
    <Screen heading="AI Content Generator">
      <ContentGenerator loading={!isDataReady} job={job} />
    </Screen>
  );
}
