import { Timestamp } from "firebase/firestore";
import { jobIcons } from "@/features/jobs/JobList/JobList";

export interface Job {
  id: string;
  title: string;
  audience: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  icon: keyof typeof jobIcons;
  contentType: string;
  originalContent?: string;
  generatedContent: string;
  context?: string;
  createdAt: Timestamp;
}
