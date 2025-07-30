"use client";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/shared/Screen/Screen";
import { AudienceList } from "@/features/audience/components/AudienceList/AudienceList";
import { useAudiences } from "@/features/audience/hooks/useAudiences";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Users } from "lucide-react";
import { InfoCell } from "@/features/audience/components/InfoCell/InfoCell";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { useMemo, useState } from "react";

const AudienceListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((index) => (
      <div
        key={index}
        className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 rounded-full w-10 h-10" />
          <div>
            <div className="bg-gray-300 mb-2 rounded w-24 h-4" />
            <div className="bg-gray-200 rounded w-16 h-3" />
          </div>
        </div>
        <div className="bg-gray-200 rounded w-5 h-5" />
      </div>
    ))}
  </div>
);

export default function AudiencePage() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Professional data-ready check - same logic as home page
  const isDataReady = useMemo(() => {
    if (authLoading || user === undefined) return false;
    if (!user) return true;
    if (audiencesLoading) return false;
    return Array.isArray(audiences);
  }, [authLoading, user, audiencesLoading, audiences]);

  // Filter audiences based on search term
  const filteredAudiences = useMemo(() => {
    if (!audiences || !Array.isArray(audiences)) return [];

    if (!searchTerm.trim()) return audiences;

    return audiences.filter((audience) =>
      audience.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [audiences, searchTerm]);

  return (
    <Screen heading="Audiences">
      <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white shadow-sm p-6 rounded-lg">
          {!isDataReady ? (
            <>
              {/* Show static header immediately */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-gray-800 text-xl">
                  Your Audiences
                </h2>
                <Button href="/audience/create" variant="outline">
                  <Plus className="w-4 h-4" />
                  Create New
                </Button>
              </div>
              {/* Only skeleton the dynamic list area */}
              <AudienceListSkeleton />
            </>
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
                  <Plus className="w-4 h-4" />
                  Create New
                </Button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <SearchBar
                  placeholder="Search audiences by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Results count */}
              {searchTerm.trim() && (
                <div className="mb-4 text-gray-600 text-sm">
                  {filteredAudiences.length === 0 ? (
                    <span>
                      No audiences found matching &quot;{searchTerm}&quot;
                    </span>
                  ) : (
                    <span>
                      {filteredAudiences.length} of {audiences.length} audience
                      {audiences.length !== 1 ? "s" : ""} found
                    </span>
                  )}
                </div>
              )}

              <AudienceList audiences={filteredAudiences} />
            </div>
          )}
        </div>
        {/* Info cell is static - show immediately */}
        <InfoCell />
      </div>
    </Screen>
  );
}
