"use client";

import { Button } from "@/components/Button";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase-config";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      // Clear session cookie first
      await fetch("/api/auth/logout", { method: "POST" });

      // Then sign out from Firebase
      await signOut(auth);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="gap-16 bg-background p-8 min-h-screen font-[family-name:var(--font-inter)]">
      <main className="pl-[100px]">
        <div>
          <h1 className="font-bold text-color-text text-4xl">Settings</h1>
          <p className="mt-4 text-color-text">
            Settings page content goes here.
          </p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </main>
    </div>
  );
}
