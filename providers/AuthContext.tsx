"use client";

import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/firebase-config";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("[AuthProvider] Auth state changed:", firebaseUser?.uid);

      if (firebaseUser) {
        try {
          // Create session cookie when user is authenticated
          const idToken = await firebaseUser.getIdToken();

          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (response.ok) {
            console.log("[AuthProvider] Session cookie created");
            setUser(firebaseUser);
            router.push("/home");
          } else {
            console.error("[AuthProvider] Failed to create session cookie");
            setUser(null);
          }
        } catch (error) {
          console.error("[AuthProvider] Error creating session:", error);
          setUser(null);
        }
      } else {
        // User signed out - clear session cookie
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          console.log("[AuthProvider] Session cookie cleared");
        } catch (error) {
          console.error("[AuthProvider] Error clearing session:", error);
        }
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
