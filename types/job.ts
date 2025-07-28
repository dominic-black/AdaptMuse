import { Timestamp } from "firebase/firestore";

export interface Job {
  id: string;
  audienceId: string;
  audienceName: string;
  contentType: string;
  originalContent?: string;
  generatedContent: string;
  context?: string;
  createdAt: Timestamp;
}
