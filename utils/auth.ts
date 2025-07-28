import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { SignupFormData, AuthResponse, LoginFormData } from "@/types";
import { app } from '../firebase/firebase-config'

export const createFirebaseUser = async (formData: SignupFormData): Promise<AuthResponse> => {  
    try {
        const auth = getAuth(app);
  
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
  
        const idToken = await userCredential.user.getIdToken();
  
        const response = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          return { success: false, error: data.error || 'Failed to create user' };
        }

        const sessionResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!sessionResponse.ok) {
          console.error("Failed to create session cookie");
          return { success: false, error: "Failed to create user session" };
        }

        const data = await response.json();
        console.log("User created successfully:", data);
        
        return { 
          success: true, 
          uid: data.uid 
        };

    } catch (error) {
        console.error("Error creating user", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Error creating user"
        };
    }
}   

export const signIntoFirebase = async (formData: LoginFormData): Promise<AuthResponse> => {
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const idToken = await userCredential.user.getIdToken();
    return { success: true, uid: userCredential.user.uid, idToken: idToken };
  } catch (error) {
    console.error("Error signing in", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error signing in"
    };
  }
}