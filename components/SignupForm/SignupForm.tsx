"use client";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { useState } from "react";
import { SignupFormData } from "@/types/forms";
import { validateSignupForm } from "@/utils/validation";
import { createFirebaseUser } from "@/utils/auth";

const firebaseAuthErrorMap: { [key: string]: string } = {
  "auth/email-already-in-use": "This email address is already in use.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/operation-not-allowed": "Email/password accounts are not enabled.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/network-request-failed": "Network error. Please check your internet connection.",
};

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors("");
    const validationErrors = validateSignupForm(formData);
    if (validationErrors !== "") {
      setErrors(validationErrors);
      return;
    }

    const result = await createFirebaseUser(formData);
    if (!result.success) {
      const errorMessage = firebaseAuthErrorMap[result.error || ""] || "An unexpected error occurred. Please try again.";
      setErrors(errorMessage);
      return;
    }

    // SUCCESS! You now have the uid securely
    console.log("User created with UID:", result.uid);
  };

  return (
    <div className="flex flex-col">
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
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Sign up
        </Button>
      </form>
    </div>
  );
}
