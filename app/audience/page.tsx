"use client";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/shared/Screen/Screen";
import { AudienceList } from "@/features/audience/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";
import { Spinner } from "@/components/ui/Spinner";
import { Users, Lightbulb } from "lucide-react";

export default function AudiencePage() {
  const { audiences, loading } = useAudiences();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if (audiences.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="mt-4 font-medium text-gray-900 text-lg">
            No audiences created yet
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            Get started by creating your first audience to tailor your content.
          </p>
          <div className="mt-6">
            <Button href="/audience/create">Create Audience</Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-gray-800 text-xl">
            Your Audiences
          </h2>
          <Button href="/audience/create" variant="outline">
            Create New
          </Button>
        </div>
        <AudienceList audiences={audiences} />
      </div>
    );
  };

  return (
    <Screen heading="Audiences">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
          {renderContent()}
        </div>
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
              <Lightbulb className="w-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">
              What is an Audience?
            </h3>
          </div>
          <div className="space-y-3 text-gray-600 text-sm">
            <p>
              An audience is a defined group of people with shared
              characteristics, interests, or behaviors.
            </p>
            <p>
              By creating audiences, you can tailor your content—like ad copy,
              marketing emails, or social media posts—to resonate more
              effectively with specific segments. This targeted approach helps
              increase engagement and achieve your communication goals.
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
