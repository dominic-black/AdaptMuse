"use client";

import { Button } from "@/components/Button";
import { MailWarning } from "lucide-react";
import { useState } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { app } from "@/firebase-config";

export default function VerifyEmailBanner() {
  const auth = getAuth(app);
  const [verificationMessage, setVerificationMessage] = useState({
    type: "",
    text: "",
  });
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [hasSentVerification, setHasSentVerification] = useState(false);

  const handleSendVerificationEmail = async () => {
    if (auth.currentUser) {
      setIsSendingVerification(true);
      setVerificationMessage({ type: "", text: "" });
      try {
        await sendEmailVerification(auth.currentUser);
        setHasSentVerification(true);
        setVerificationMessage({
          type: "success",
          text: "Verification email sent! Please check your inbox.",
        });
      } catch (error: any) {
        console.error("Error sending verification email:", error);
        setVerificationMessage({
          type: "error",
          text: "Failed to send verification email. Please try again.",
        });
      } finally {
        setIsSendingVerification(false);
      }
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-yellow-50 p-4 border border-yellow-200 rounded-lg text-yellow-800">
      <div className="flex items-center gap-3">
        <MailWarning className="flex-shrink-0 w-6 h-6" />
        <p className="font-medium text-sm">
          Your email address is not verified. Please check your inbox for a
          verification link.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {!hasSentVerification && (
          <Button
            onClick={handleSendVerificationEmail}
            disabled={isSendingVerification}
            variant="outline"
            size="sm"
          >
            {isSendingVerification ? "Sending..." : "Send Verification Email"}
          </Button>
        )}
        {verificationMessage.text && (
          <p
            className={`text-xs ${
              verificationMessage.type === "success"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {verificationMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
