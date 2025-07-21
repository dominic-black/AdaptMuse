import { cookies } from "next/headers";
import { auth } from "@/lib/firebaseAdmin";

export async function getServerUser() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    return await auth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}