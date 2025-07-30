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

// Server-side authentication types
export type AuthenticatedUser = {
  uid: string;
  email?: string;
  emailVerified?: boolean;
};

export type AuthenticationResult = {
  success: true;
  user: AuthenticatedUser;
} | {
  success: false;
  error: string;
  statusCode: 401 | 403 | 500;
};

export type AuthenticationOptions = {
  requireEmailVerification?: boolean;
};
