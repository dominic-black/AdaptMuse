"use client";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { useState } from "react";
import { SignupFormData } from "@/types/forms";
import { validateSignupForm } from "@/utils/validation";
import { createFirebaseUser } from "@/utils/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { app } from "@/firebase-config";
import { useRouter } from "next/navigation";

const firebaseAuthErrorMap: { [key: string]: string } = {
  "auth/email-already-in-use": "This email address is already in use.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/operation-not-allowed": "Email/password accounts are not enabled.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
};

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors("");
    setSignupSuccess(false);

    const validationErrors = validateSignupForm(formData);
    if (validationErrors !== "") {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const result = await createFirebaseUser(formData);
    if (!result.success) {
      const errorMessage =
        firebaseAuthErrorMap[result.error || ""] ||
        "An unexpected error occurred. Please try again.";
      setErrors(errorMessage);
      setIsLoading(false);
      return;
    }

    // User created successfully, now send verification email
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setSignupSuccess(true);
        console.log("Verification email sent!");
      } catch (emailError: any) {
        console.error("Error sending verification email:", emailError);
        setIsLoading(false);
        setErrors(
          "Account created, but failed to send verification email. Please check your spam folder or try again later."
        );
      }
    }
    router.push("/home");
  };

  return (
    <div className="flex flex-col">
      {signupSuccess ? (
        <div className="bg-green-50 p-4 rounded-md text-green-700 text-center">
          <p className="font-medium">Account created successfully!</p>
          <p className="mt-1 text-sm">
            Please check your email to verify your account.
          </p>
        </div>
      ) : (
        <form className="flex flex-col gap-4">
          {errors && (
            <div className="bg-red-50 p-3 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors}</p>
            </div>
          )}
          <div className="flex flex-row gap-4">
            <TextInput
              label="First name"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextInput
              label="Last name"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextInput
              label="Email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
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
            Sign up
          </Button>
        </form>
      )}
    </div>
  );
}
