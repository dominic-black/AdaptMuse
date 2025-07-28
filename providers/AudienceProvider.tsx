"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Audience } from "@/types/audience";

interface AudienceContextType {
  audiences: Audience[];
  loading: boolean;
}

export const AudienceContext = createContext<AudienceContextType | undefined>(
  undefined
);

export const AudienceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const hasReceivedData = useRef(false);

  useEffect(() => {
    if (user) {
      hasReceivedData.current = false;
      setLoading(true);

      const audiencesRef = collection(db, "users", user.uid, "audiences");
      const unsubscribe = onSnapshot(
        audiencesRef,
        (snapshot) => {
          // Check if this is a complete snapshot (not from cache or pending)
          const isComplete =
            !snapshot.metadata.hasPendingWrites && !snapshot.metadata.fromCache;

          const newAudiences = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Audience, "id">),
          }));
          setAudiences(newAudiences);

          // Only set loading to false when we get a complete snapshot from server
          if (isComplete && !hasReceivedData.current) {
            hasReceivedData.current = true;
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching audiences:", error);
          hasReceivedData.current = true;
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setAudiences([]);
      hasReceivedData.current = true;
      setLoading(false);
    }
  }, [user]);

  return (
    <AudienceContext.Provider value={{ audiences, loading }}>
      {children}
    </AudienceContext.Provider>
  );
};

export const useAudiences = () => {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error("useAudiences must be used within an AudienceProvider");
  }
  return context;
};
