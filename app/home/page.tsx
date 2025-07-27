"use client";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/shared/Screen/Screen";
import { AudienceList } from "@/features/audience/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";
import { Spinner } from "@/components/ui/Spinner";
import { FileText, Users, BarChart2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import VerifyEmailBanner from "@/features/auth/banners/VerifyEmail/VerifyEmailBanner";

export default function Home() {
  const { audiences, loading } = useAudiences();
  const { user } = useAuth();

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-center gap-4 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="font-semibold text-gray-900 text-xl">{value}</p>
      </div>
    </div>
  );

  return (
    <Screen heading="Dashboard">
      <div className="space-y-8">
        {user && !user.emailVerified && <VerifyEmailBanner />}

        {/* Quick Stats Section */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Content Generated"
            value="0"
            icon={<FileText className="w-5 h-5" />}
          />
          <StatCard
            title="Audiences Created"
            value={loading ? "..." : String(audiences.length)}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Usage"
            value="N/A"
            icon={<BarChart2 className="w-5 h-5" />}
          />
        </div>

        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Content Generation Jobs */}
          <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">
              Recent Activity
            </h2>
            <div className="py-16 border-2 border-gray-200 border-dashed rounded-lg text-center">
              <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-12 h-12 text-gray-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-medium text-gray-900 text-lg">
                No content generated yet
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Your recent content generation jobs will appear here.
              </p>
              <div className="mt-6">
                <Button href="/generate-content">
                  <Sparkles className="mr-2 w-4 h-4" />
                  Generate Content
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Audiences */}
          <div className="row-start-1 bg-white shadow-sm p-6 rounded-lg lg:row-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800 text-xl">Audiences</h2>
              <Link
                href="/audience"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:underline"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : audiences.length > 0 ? (
              <AudienceList audiences={audiences.slice(0, 5)} />
            ) : (
              <div className="py-10 border-2 border-gray-200 border-dashed rounded-lg text-center">
                <div className="flex justify-center items-center bg-gray-100 mx-auto rounded-full w-12 h-12 text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-medium text-gray-900 text-sm">
                  No audiences found
                </h3>
                <p className="mt-1 text-gray-500 text-xs">
                  Create one to get started.
                </p>
                <div className="mt-4">
                  <Button href="/audience/create" variant="outline" size="sm">
                    Create Audience
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
