import { Timestamp } from "firebase/firestore";

export interface Job {
  id: string;
  title: string;
  audience: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  contentType: string;
  originalContent?: string;
  generatedContent: string;
  context?: string;
  createdAt: Timestamp;
}