import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import {
  EnhancedAudience,
  AnalyticsTab,
} from "../types/audience-analytics.types";

export const useAudienceData = () => {
  const { audienceId } = useParams();
  const { user } = useAuth();
  const [audience, setAudience] = useState<EnhancedAudience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");

  useEffect(() => {
    if (!user || !audienceId) {
      setLoading(false);
      return;
    }

    const fetchAudience = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(
          db,
          "users",
          user.uid,
          "audiences",
          audienceId as string
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const audienceData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as EnhancedAudience;
          setAudience(audienceData);
        } else {
          setError("Audience not found");
        }
      } catch (err) {
        console.error("Error fetching audience:", err);
        setError("Failed to load audience data");
      } finally {
        setLoading(false);
      }
    };

    fetchAudience();
  }, [user, audienceId]);

  const isEnhanced = Boolean(audience?.qlooIntelligence);

  return {
    audience,
    loading,
    error,
    activeTab,
    setActiveTab,
    isEnhanced,
  };
};
