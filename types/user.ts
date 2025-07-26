import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Timestamp;
}
