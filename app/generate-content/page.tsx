"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { ContentGenerator } from "@/features/generate-content/ContentGenerator/ContentGenerator";
import { useAudiences } from "@/hooks/useAudiences";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export default function BotPage() {
  const { audiences, loading: audiencesLoading } = useAudiences();
  const { user, loading: authLoading } = useAuth();

  // Professional data-ready check - same logic as home page
  const isDataReady = useMemo(() => {
    // Must have auth completed
    if (authLoading || user === undefined) return false;

    // If no user, we're ready (shows login state)
    if (!user) return true;

    // For authenticated users, wait for audiences data to be ready
    if (audiencesLoading) return false;

    // Ensure audiences array is defined (even if empty)
    return Array.isArray(audiences);
  }, [authLoading, user, audiencesLoading, audiences]);

  return (
    <Screen heading="AI Content Generator">
      <ContentGenerator loading={!isDataReady} />
    </Screen>
  );
}
