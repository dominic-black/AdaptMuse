export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  uid?: string;
  error?: string;
  idToken?: string;
};
