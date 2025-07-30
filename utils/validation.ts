import { CreateUserFormData, LoginFormData, SignupFormData } from "@/types";

export const validateSignupForm = (formData: SignupFormData) => {
  const { firstName, lastName, email, password } = formData;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  } else if (!emailRegex.test(email)) {
    return "Please provide a valid email address";
  }
  
  if (!password) {
    return "Password is required";
  } else if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  if (!firstName) {
    return "First name is required";
  } else if (firstName.length < 2 || firstName.length > 24) {
    return "First name must be between 2 and 24 characters";
  }
  
  if (!lastName) {
    return "Last name is required";
  } else if (lastName.length < 2 || lastName.length > 24) {
    return "Last name must be between 2 and 24 characters";
  }
  
  return "";
};  

export const validateLoginForm = (formData: LoginFormData) => {
  const { email, password } = formData;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return "Email is required";
  } else if (!emailRegex.test(email)) {
    return "Please provide a valid email address";
  }

  if (!password) {
    return "Password is required";
  } else if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return "";
};

export const validateCreateUser = (formData: CreateUserFormData) => {
  const { firstName, lastName, email } = formData;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  } else if (!emailRegex.test(email)) {
    return "Please provide a valid email address";
  }
  
  if (!firstName) {
    return "First name is required";
  } else if (firstName.length < 2 || firstName.length > 24) {
    return "First name must be between 2 and 24 characters";
  }
  
  if (!lastName) {
    return "Last name is required";
  } else if (lastName.length < 2 || lastName.length > 24) {
    return "Last name must be between 2 and 24 characters";
  }
  
  return "";
};