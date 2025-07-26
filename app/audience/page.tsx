"use client";

import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen/Screen";
import { AudienceList } from "@/components/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";
import { Spinner } from "@/components/Spinner";
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
        <div className="text-center py-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No audiences created yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
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
          <h2 className="text-xl font-semibold text-gray-800">Your Audiences</h2>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          {renderContent()}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Lightbulb className="w-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                    What is an Audience?
                </h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                An audience is a defined group of people with shared characteristics, interests, or behaviors.
              </p>
              <p>
                By creating audiences, you can tailor your content—like ad copy, marketing emails, or social media posts—to resonate more effectively with specific segments. This targeted approach helps increase engagement and achieve your communication goals.
              </p>
            </div>
        </div>
      </div>
    </Screen>
  );
}
