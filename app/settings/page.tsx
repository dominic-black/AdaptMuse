"use client";
import { Screen } from "@/components/Screen/Screen";
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
    <Screen heading="Settings">
      <Button onClick={handleLogout}>Logout</Button>
    </Screen>
  );
}
