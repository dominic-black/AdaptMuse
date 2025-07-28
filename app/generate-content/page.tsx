"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { ContentGenerator } from "@/features/generate-content/ContentGenerator/ContentGenerator";
import { useAudiences } from "@/hooks/useAudiences";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export default function BotPage() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { user, loading: authLoading } = useAuth();

  const isDataReady = useMemo(() => {
    if (authLoading || user === undefined) return false;

    if (!user) return true;

    if (audiencesLoading) return false;

    return Array.isArray(audiences);
  }, [authLoading, user, audiencesLoading, audiences]);

  return (
    <Screen heading="AI Content Generator">
      <ContentGenerator loading={!isDataReady} />
    </Screen>
  );
}
