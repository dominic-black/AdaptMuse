"use client";

import { Cell } from "@/components/Cell/Cell";
import { Screen } from "@/components/Screen/Screen";
import { AudienceList } from "@/components/AudienceList/AudienceList";
import { useAudiences } from "@/hooks/useAudiences";

export default function Home() {
  const { audiences, loading } = useAudiences();

  return (
    <Screen heading="Home">
      <div className="gap-4 grid grid-cols-2">
        <Cell>
          <h2 className="font-bold text-color-text text-2xl">
            Content generation jobs
          </h2>
          <p>All previous and processing jobs.</p>
        </Cell>
        <Cell>
          <h2 className="font-bold text-color-text text-2xl">
            Saved Audiences
          </h2>
          {loading ? <p>Loading...</p> : <AudienceList audiences={audiences} />}
        </Cell>
        <Cell>
          <h2 className="font-bold text-color-text text-2xl">Usage</h2>
        </Cell>
        <Cell>
          <h2 className="font-bold text-color-text text-2xl">Usage</h2>
        </Cell>
      </div>
    </Screen>
  );
}
