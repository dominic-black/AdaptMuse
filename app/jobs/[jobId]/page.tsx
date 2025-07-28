"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Screen } from "@/components/shared/Screen/Screen";
import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Cell } from "@/components/ui/Cell/Cell";
import { Job } from "@/types/job";

export default function JobPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && jobId) {
      const getJob = async () => {
        try {
          const docRef = doc(
            db,
            "users",
            user.uid,
            "jobs",
            jobId as string
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setJob({ id: docSnap.id, ...docSnap.data() } as Job);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        } finally {
          setLoading(false);
        }
      };

      getJob();
    }
  }, [user, jobId]);

  return (
    <Screen heading={job ? job.contentType : "Job"}>
      {loading ? (
        <p>Loading...</p>
      ) : job ? (
        <div className="flex flex-col gap-4">
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Job Details
              </h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Audience:</span> {job.audienceName}</p>
                <p><span className="font-semibold">Content Type:</span> {job.contentType}</p>
                {job.context && <p><span className="font-semibold">Context:</span> {job.context}</p>}
              </div>
            </div>
          </Cell>
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Original Content
              </h3>
              <p>{job.originalContent}</p>
            </div>
          </Cell>
          <Cell>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Generated Content
              </h3>
              <p>{job.generatedContent}</p>
            </div>
          </Cell>
        </div>
      ) : (
        <p>Job not found.</p>
      )}
    </Screen>
  );
}
