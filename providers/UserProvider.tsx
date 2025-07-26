"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/user";
import { app } from "@/firebase-config";

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return; // Wait for authentication to resolve
    }

    if (!authUser) {
      setUserProfile(null);
      setLoading(false);
      return; // No user, so no data to fetch
    }

    const db = getFirestore(app);
    const userDocRef = doc(db, "users", authUser.uid);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          console.warn(
            "[UserProvider] No user profile found in Firestore for UID:",
            authUser.uid
          );
          setUserProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("[UserProvider] Error listening to user profile:", error);
        setUserProfile(null);
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts or the user changes
    return () => unsubscribe();
  }, [authUser, authLoading]);

  return (
    <UserContext.Provider value={{ userProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
