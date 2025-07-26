"use client";

import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen/Screen";
import { AudienceList } from "@/components/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";
import { Spinner } from "@/components/Spinner";
import { FileText, Users, BarChart2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { audiences, loading } = useAudiences();

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white p-4 rounded-lg flex items-center gap-4 border border-gray-200 shadow-sm">
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <Screen heading="Dashboard">
      <div className="space-y-8">
        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Content Generation Jobs */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No content generated yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your recent content generation jobs will appear here.
              </p>
              <div className="mt-6">
                <Button href="/bot">Generate Content</Button>
              </div>
            </div>
          </div>

          {/* Saved Audiences */}
          <div className="bg-white p-6 rounded-lg shadow-sm row-start-1 lg:row-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Audiences</h2>
              <Link
                href="/audience"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
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
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  No audiences found
                </h3>
                <p className="mt-1 text-xs text-gray-500">
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
