"use client";

import { useState } from "react";
import { LoginFormData } from "@/types/forms";
import { validateLoginForm } from "@/utils/validation";
import { signIntoFirebase } from "@/utils/auth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/firebase/firebase-config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

const firebaseAuthErrorMap: { [key: string]: string } = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "The password you entered is incorrect.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
  "auth/email-already-in-use": "This email address is already in use.",
  "auth/weak-password": "Password should be at least 6 characters.",
};

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const auth = getAuth(app);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors("");
    const validationErrors = validateLoginForm(formData);
    if (validationErrors !== "") {
      setErrors(validationErrors);
      return;
    }

    const result = await signIntoFirebase(formData);
    if (!result.success) {
      const errorMessage =
        firebaseAuthErrorMap[result.error || ""] ||
        "An unexpected error occurred. Please try again.";
      setErrors(errorMessage);
      setIsLoading(false);
      return;
    }

    router.push("/home");
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setResetPasswordMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }
    setIsSendingReset(true);
    setResetPasswordMessage({ type: "", text: "" });
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetPasswordMessage({
        type: "success",
        text: "Password reset email sent! Check your inbox.",
      });
    } catch (error: any) {
      const errorMessage =
        firebaseAuthErrorMap[error.code] ||
        "Failed to send password reset email.";
      setResetPasswordMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-4">
        {errors && (
          <div className="bg-red-50 p-3 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{errors}</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <TextInput
            label="Email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </form>
      <div className="mt-2 text-sm text-right">
        <button
          onClick={handlePasswordReset}
          className="font-medium text-primary hover:text-primary/80"
          disabled={isSendingReset}
        >
          {isSendingReset ? "Sending..." : "Forgot password?"}
        </button>
      </div>
      {resetPasswordMessage.text && (
        <div
          className={`p-3 rounded-md text-sm mt-4 ${
            resetPasswordMessage.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {resetPasswordMessage.text}
        </div>
      )}
    </div>
  );
}
