"use client";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/shared/Screen/Screen";
import { AudienceList } from "@/features/audience/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";
import { Spinner } from "@/components/ui/Spinner";
import { Users } from "lucide-react";
import { InfoCell } from "@/features/audience/InfoCell/InfoCell";

export default function AudiencePage() {
  const { audiences, loading } = useAudiences();

  return (
    <Screen heading="Audiences">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : audiences.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12 text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-medium text-gray-900 text-lg">
                No audiences created yet
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Get started by creating your first audience to tailor your
                content.
              </p>
              <div className="mt-6">
                <Button href="/audience/create">Create Audience</Button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        <InfoCell />
      </div>
    </Screen>
  );
}
