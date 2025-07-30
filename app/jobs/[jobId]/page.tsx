"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/shared/Screen/Screen";
import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Cell } from "@/components/ui/Cell/Cell";
import { Job } from "@/types/job";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

export default function JobPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (user && jobId) {
      const getJob = async () => {
        try {
          const docRef = doc(db, "users", user.uid, "jobs", jobId as string);
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
    <Screen heading={job ? job.contentType : "Job Details"}>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 text-sm sm:text-base text-center">
            Loading job details...
          </p>
        </div>
      ) : job ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="gap-4 sm:gap-6 grid grid-cols-1 lg:grid-cols-2">
            <Cell>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">
                  Job Overview
                </h3>
                <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2">
                    <span className="min-w-[100px] sm:min-w-[120px] font-medium text-gray-900">
                      Content Type:
                    </span>
                    <span className="break-words">{job.contentType}</span>
                  </div>

                  <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-2">
                    <span className="min-w-[100px] sm:min-w-[120px] font-medium text-gray-900">
                      Generated On:
                    </span>
                    <span className="break-words">
                      {job.createdAt
                        ? format(job.createdAt.toDate(), "PPP p")
                        : "N/A"}
                    </span>
                  </div>

                  {job.context && (
                    <div className="flex sm:flex-row flex-col sm:items-start gap-1 sm:gap-2">
                      <span className="flex-shrink-0 min-w-[100px] sm:min-w-[120px] font-medium text-gray-900">
                        Context:
                      </span>
                      <span className="break-words">{job.context}</span>
                    </div>
                  )}
                </div>
              </div>
            </Cell>

            <Cell>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">
                  Target Audience
                </h3>
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                  <Link
                    href={`/audience/${job.audience.id}`}
                    className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
                  >
                    {job.audience.imageUrl && (
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            job.audience.imageUrl ||
                            "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                          }
                          alt={job.audience.name}
                          width={48}
                          height={48}
                          className="border-2 border-gray-600 rounded-full w-10 sm:w-12 h-10 sm:h-12 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {job.audience.name}
                      </h4>
                    </div>
                  </Link>
                </div>
              </div>
            </Cell>
          </div>

          {/* Original Content */}
          {job.originalContent && (
            <Cell>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">
                  Original Content
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="max-h-96 overflow-y-auto text-gray-800 text-sm sm:text-base leading-relaxed">
                    <p className="break-words whitespace-pre-wrap">
                      {job.originalContent}
                    </p>
                  </div>
                </div>
              </div>
            </Cell>
          )}

          {/* Generated Content */}
          <Cell>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">
                Generated Content
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 border border-gray-200 rounded-lg">
                <div className="max-h-96 overflow-y-auto text-gray-800 text-sm sm:text-base leading-relaxed">
                  <pre className="font-sans break-words whitespace-pre-wrap">
                    {job.generatedContent}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    router.push(`/generate-content?job=${jobId}`);
                  }}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Pencil className="mr-2 w-4 h-4" />
                  <p>Make Changes</p>
                </Button>
              </div>
            </div>
          </Cell>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 text-sm sm:text-base text-center">
            Job not found or an error occurred.
          </p>
        </div>
      )}
    </Screen>
  );
}
