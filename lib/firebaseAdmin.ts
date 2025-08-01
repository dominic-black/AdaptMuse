import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Validate required environment variables
const requiredEnvVars = {
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase Admin environment variables: ${missingVars.join(', ')}`
  );
}

const adminConfig = {
  credential: cert({
    projectId: requiredEnvVars.FIREBASE_PROJECT_ID!,
    clientEmail: requiredEnvVars.FIREBASE_CLIENT_EMAIL!,
    privateKey: requiredEnvVars.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
  storageBucket: `${requiredEnvVars.FIREBASE_PROJECT_ID}.appspot.com`,
};

const app: App = !getApps().length ? initializeApp(adminConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

export async function verifySessionCookie(sessionCookie: string) {
  try {
    return await auth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}