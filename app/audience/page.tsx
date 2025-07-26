"use client";

import { Button } from "@/components/Button";
import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { AudienceList } from "@/components/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";

export default function AudiencePage() {
  const { audiences, loading } = useAudiences();

  return (
    <Screen heading="Saved audiences">
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <Cell>
            {loading ? (
              <p>Loading audiences...</p>
            ) : audiences.length > 0 ? (
              <AudienceList audiences={audiences} />
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <p>You have not created any audiences yet.</p>
                <Button href="/audience/create">Create audience</Button>
              </div>
            )}
          </Cell>
        </div>
        <div className="max-w-[340px]">
          <Cell>
            <div className="flex flex-col gap-4">
              <p className="font-bold text-color-text text-2xl">
                What is an audience?
              </p>
              <p className="text-color-text text-sm">
                An audience is a group of people who share similar interests,
                behaviors, or demographics.
              </p>
              <p className="text-color-text text-sm">
                Content can then be generated or altered to be tailored to
                appeal to the target audience.
              </p>
              <Button href="/audience/create" variant="primary">
                Create audience
              </Button>
            </div>
          </Cell>
        </div>
      </div>
    </Screen>
  );
}
