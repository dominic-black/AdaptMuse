"use client";

import { Screen } from "@/components/Screen/Screen";
import { Button } from "@/components/Button";
import {
  getAuth,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "@/firebase-config";
import { useRouter } from "next/navigation";
import { User, KeyRound, LogOut } from "lucide-react";
import { TextInput } from "@/components/TextInput";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/UserProvider";

export default function SettingsPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const { userProfile } = useUser();
  const [firstName, setFirstName] = useState(userProfile?.firstName || "");
  const [lastName, setLastName] = useState(userProfile?.lastName || "");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateProfileMessage, setUpdateProfileMessage] = useState({
    type: "",
    text: "",
  });
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    if (userProfile?.firstName && userProfile?.lastName && !isInitialized) {
      setFirstName(userProfile.firstName);
      setLastName(userProfile.lastName);
      setIsInitialized(true);
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    setIsUpdatingProfile(true);
    setUpdateProfileMessage({ type: "", text: "" });

    try {
      const displayName = `${firstName} ${lastName}`.trim();
      await updateProfile(auth.currentUser, { displayName });
      setUpdateProfileMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateProfileMessage({
        type: "error",
        text: "Failed to update profile.",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    if (!auth.currentUser?.email) return;

    setIsSendingReset(true);
    setResetPasswordMessage({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
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
          description="Manage your public profile and personal information."
          icon={<User className="w-5 h-5" />}
        >
          <div className="space-y-4 max-w-md">
            <div className="gap-4 grid grid-cols-2">
              <TextInput
                key="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder=""
              />
              <TextInput
                key="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=""
              />
            </div>
            <TextInput
              label="Email Address"
              value={userProfile?.email || ""}
              onChange={() => {}}
              placeholder=""
              disabled
            />
            <div className="flex items-center gap-4 pt-2">
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                variant="outline"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </Button>
              {updateProfileMessage.text && (
                <p
                  className={`text-sm ${
                    updateProfileMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {updateProfileMessage.text}
                </p>
              )}
            </div>
          </div>
        </SettingCard>

        <SettingCard
          title="Security"
          description="Manage your password and account security."
          icon={<KeyRound className="w-5 h-5" />}
        >
          <div className="space-y-4 max-w-md">
            <div className="flex flex-col items-start gap-4">
              <Button
                onClick={handleResetPassword}
                disabled={isSendingReset}
                variant="outline"
              >
                {isSendingReset
                  ? "Sending Email..."
                  : "Send Password Reset Email"}
              </Button>
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
            Logout
          </Button>
        </SettingCard>
      </div>
    </Screen>
  );
}
