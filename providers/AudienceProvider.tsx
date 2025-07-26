"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase-config";
import { useAuth } from "@/hooks/useAuth";
import { Audience } from "@/types/audience";

interface AudienceContextType {
  audiences: Audience[];
  loading: boolean;
}

export const AudienceContext = createContext<AudienceContextType | undefined>(
  undefined
);

export const AudienceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const audiencesRef = collection(db, "users", user.uid, "audiences");
      const unsubscribe = onSnapshot(
        audiencesRef,
        (snapshot) => {
          const newAudiences = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Audience, "id">),
          }));
          setAudiences(newAudiences);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching audiences:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setAudiences([]);
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
