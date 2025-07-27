"use client";

import React, { createContext, useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/firebase/firebase-config";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const initialAuthCheck = useRef(true);

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

            // Navigate to /home in these cases:
            // 1. Initial auth check and user is on a public page
            // 2. User just logged in (they're on /login page)
            const isOnPublicPage =
              pathname === "/" ||
              pathname === "/login" ||
              pathname === "/signup";
            const shouldNavigate = initialAuthCheck.current
              ? isOnPublicPage
              : pathname === "/login";

            if (shouldNavigate) {
              console.log("[AuthProvider] Navigating to /home");
              router.push("/home");
            }
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
      initialAuthCheck.current = false;
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
