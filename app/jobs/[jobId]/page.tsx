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
import {
  Pencil,
  FileText,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

// Loading Skeleton Component
const JobDetailsSkeleton = () => (
  <div className="space-y-8">
    {/* Content Sections Skeleton */}
    <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
      <Cell>
        <div className="space-y-4 p-6 animate-pulse">
          <div className="bg-gray-200 rounded w-32 h-6"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 rounded w-full h-4"></div>
            <div className="bg-gray-200 rounded w-3/4 h-4"></div>
            <div className="bg-gray-200 rounded w-1/2 h-4"></div>
          </div>
        </div>
      </Cell>

      <Cell>
        <div className="space-y-4 p-6 animate-pulse">
          <div className="bg-gray-200 rounded w-40 h-6"></div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded w-24 h-4"></div>
                <div className="bg-gray-200 rounded w-32 h-3"></div>
              </div>
            </div>
          </div>
        </div>
      </Cell>
    </div>

    {/* Context Skeleton */}
    <Cell>
      <div className="space-y-4 p-6 animate-pulse">
        <div className="bg-gray-200 rounded w-24 h-6"></div>
        <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-3">
            <div className="bg-gray-200 rounded w-full h-4"></div>
            <div className="bg-gray-200 rounded w-3/4 h-4"></div>
            <div className="bg-gray-200 rounded w-1/2 h-4"></div>
          </div>
        </div>
      </div>
    </Cell>

    {/* Generated Content Skeleton */}
    <Cell>
      <div className="space-y-4 p-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 rounded w-48 h-6"></div>
          <div className="bg-gray-200 rounded w-20 h-8"></div>
        </div>
        <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
          <div className="space-y-3">
            <div className="bg-gray-200 rounded w-full h-4"></div>
            <div className="bg-gray-200 rounded w-full h-4"></div>
            <div className="bg-gray-200 rounded w-3/4 h-4"></div>
            <div className="bg-gray-200 rounded w-full h-4"></div>
            <div className="bg-gray-200 rounded w-1/2 h-4"></div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-gray-200 rounded w-32 h-10"></div>
        </div>
      </div>
    </Cell>
  </div>
);

export default function JobPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  const handleCopyContent = async () => {
    if (job?.generatedContent) {
      await navigator.clipboard.writeText(job.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Screen heading="Job Details">
        <JobDetailsSkeleton />
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen heading="Job Not Found">
        <div className="flex flex-col justify-center items-center py-16">
          <div className="bg-gray-100 mb-4 p-4 rounded-full w-16 h-16">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            Job Not Found
          </h3>
          <p className="mb-6 max-w-md text-gray-600 text-center">
            The job you&apos;re looking for doesn&apos;t exist or you don&apos;t
            have permission to view it.
          </p>
          <Button href="/jobs" variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Jobs
          </Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen heading={job.title || job.contentType}>
      <div className="space-y-8">
        {/* Content Sections */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* Job Details */}
          <Cell>
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Job Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-gray-100 border-b">
                  <span className="font-medium text-gray-700">
                    Content Type
                  </span>
                  <span className="text-gray-900">{job.contentType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-gray-100 border-b">
                  <span className="font-medium text-gray-700">
                    Generated On
                  </span>
                  <span className="text-gray-900">
                    {job.createdAt
                      ? format(job.createdAt.toDate(), "PPP p")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="bg-green-100 px-2 py-1 rounded-full font-medium text-green-800 text-xs">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </Cell>

          {/* Target Audience */}
          <Cell>
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Target Audience
              </h3>
              <Link
                href={`/audience/${job.audience.id}`}
                className="group block bg-gradient-to-r from-gray-50 to-gray-100 p-4 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {job.audience.imageUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={job.audience.imageUrl}
                        alt={job.audience.name}
                        width={64}
                        height={64}
                        className="border-2 border-gray-300 group-hover:border-gray-400 rounded-full w-16 h-16 object-cover transition-colors"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 text-lg transition-colors">
                      {job.audience.name}
                    </h4>
                    <p className="mt-1 text-gray-600 text-sm">
                      Click to view audience details
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Link>
            </div>
          </Cell>
        </div>

        {/* Context */}
        {job.context && (
          <Cell>
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Context
              </h3>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                <div className="text-gray-800 text-sm leading-relaxed">
                  <p className="break-words whitespace-pre-wrap">
                    {job.context}
                  </p>
                </div>
              </div>
            </div>
          </Cell>
        )}

        {/* Original Content */}
        {job.originalContent && (
          <Cell>
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Original Content
              </h3>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                <div className="max-h-64 overflow-y-auto text-gray-800 text-sm leading-relaxed">
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
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Generated Content
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyContent}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200 rounded-lg">
              <div className="max-h-96 overflow-y-auto text-gray-800 text-sm leading-relaxed">
                <pre className="font-sans break-words whitespace-pre-wrap">
                  {job.generatedContent}
                </pre>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => router.push(`/generate-content?job=${jobId}`)}
                className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700"
              >
                <Pencil className="mr-2 w-4 h-4" />
                Make Changes
              </Button>
            </div>
          </div>
        </Cell>
      </div>
    </Screen>
  );
}
