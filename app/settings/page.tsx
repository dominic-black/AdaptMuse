"use client";

import { Screen } from "@/components/shared/Screen/Screen";
import { Button } from "@/components/ui/Button";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/firebase/firebase-config";
import { useRouter } from "next/navigation";
import { User, KeyRound, LogOut } from "lucide-react";
import { TextInput } from "@/components/ui/TextInput";
import { useState } from "react";
import { useUser } from "@/providers/UserProvider";

export default function SettingsPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const { userProfile } = useUser();
  console.log("userProfile = ", userProfile);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [hasSentReset, setHasSentReset] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const handleResetPassword = async () => {
    if (!auth.currentUser?.email) return;

    setIsSendingReset(true);
    setResetPasswordMessage({ type: "", text: "" });

    try {
      console.log("auth.currentUser.email = ", auth.currentUser.email);
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setHasSentReset(true);
      setResetPasswordMessage({
        type: "success",
        text: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setResetPasswordMessage({
        type: "error",
        text: "Failed to send password reset email.",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const SettingCard = ({
    title,
    description,
    icon,
    children,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6 border-gray-200 border-b">
        <div className="flex items-center gap-4">
          <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50/50 p-6">{children}</div>
    </div>
  );

  return (
    <Screen heading="Settings">
      <div className="space-y-8 mx-auto max-w-4xl">
        <SettingCard
          title="Profile"
          description="Your account user information."
          icon={<User className="w-5 h-5" />}
        >
          <div className="space-y-4 max-w-md">
            <div className="gap-4 grid grid-cols-2">
              <TextInput
                label="First Name"
                value={userProfile?.firstName || ""}
                onChange={() => {}}
                placeholder=""
                disabled
              />
              <TextInput
                label="Last Name"
                value={userProfile?.lastName || ""}
                onChange={() => {}}
                placeholder=""
                disabled
              />
            </div>
            <TextInput
              label="Email Address"
              value={userProfile?.email || ""}
              onChange={() => {}}
              placeholder=""
              disabled
            />
          </div>
        </SettingCard>

        <SettingCard
          title="Security"
          description="Manage your password and account security."
          icon={<KeyRound className="w-5 h-5" />}
        >
          <div className="space-y-4 max-w-md">
            <div className="flex flex-col items-start gap-4">
              {!hasSentReset && (
                <Button
                  onClick={handleResetPassword}
                  disabled={isSendingReset}
                  variant="outline"
                >
                  {isSendingReset
                    ? "Sending Email..."
                    : "Send Password Reset Email"}
                </Button>
              )}
              {resetPasswordMessage.text && (
                <p
                  className={`text-sm ${
                    resetPasswordMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {resetPasswordMessage.text}
                </p>
              )}
            </div>
          </div>
        </SettingCard>

        <SettingCard
          title="Logout"
          description="End your current session."
          icon={<LogOut className="w-5 h-5" />}
        >
          <Button onClick={handleLogout} variant="danger">
            <LogOut className="mr-2 w-4 h-4" />
            Logout
          </Button>
        </SettingCard>
      </div>
    </Screen>
  );
}
