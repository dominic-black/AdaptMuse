"use client";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { useState } from "react";
import { LoginFormData } from "@/types/forms";
import { validateLoginForm } from "@/utils/validation";
import { signIntoFirebase } from "@/utils/auth";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
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
    const validationErrors = validateLoginForm(formData);
    if (validationErrors !== "") {
      setErrors(validationErrors);
      return;
    }

    const result = await signIntoFirebase(formData);
    if (!result.success) {
      setErrors(result.error || "An error occurred during signin");
      return;
    }

    // SUCCESS! You now have the uid securely
    console.log("User signed in with UID:", result.uid);
  };

  return (
    <div className="flex flex-col w-[500px]">
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
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
