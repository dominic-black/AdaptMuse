import OpenAI from "openai";
import { db } from "@/lib/firebaseAdmin";
import { Entity } from "@/types";
import { Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import { Job } from "@/types/job";
import { jobIconNames } from "@/constants/jobIcons";
import { jobIcons } from "@/features/jobs/JobList/JobList";

// Constants
export const CONTENT_MAX_LENGTH = 5000;
export const CONTEXT_MAX_LENGTH = 2000;
export const OPENAI_MODEL = "gpt-4o";

// Error messages
export const ERRORS = {
  MISSING_REQUIRED_FIELDS: "audienceId, generationJobTitle, contentType, and context are required",
  CONTENT_TOO_LONG: `Content must be less than ${CONTENT_MAX_LENGTH} characters`,
  CONTEXT_TOO_LONG: `Context must be less than ${CONTEXT_MAX_LENGTH} characters`,
  AUDIENCE_NOT_FOUND: "Audience not found",
  INVALID_CONTENT_TYPE: "Content type contains invalid characters",
  INVALID_JOB_TITLE: "Job title contains invalid characters or is too long",
  GENERATION_FAILED: "Failed to generate content",
  ICON_GENERATION_FAILED: "Failed to generate icon",
} as const;

// Interfaces
export interface GenerateContentRequest {
  audienceId: string;
  generationJobTitle: string;
  contentType: string;
  content?: string;
  context: string;
}

export interface AudienceData {
  name: string;
  entities: Entity[];
  ageTotals: Record<string, number>;
  genderTotals: Record<string, number>;
  imageUrl?: string | null;
}

/**
 * Validates the request body structure and required fields
 */
export function validateRequestBody(body: unknown): GenerateContentRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const request = body as Partial<GenerateContentRequest>;
  
  if (!request.audienceId || !request.generationJobTitle || !request.contentType || !request.context) {
    return null;
  }

  return {
    audienceId: request.audienceId,
    generationJobTitle: request.generationJobTitle,
    contentType: request.contentType,
    content: request.content,
    context: request.context,
  };
}

/**
 * Sanitizes input strings to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .replace(/[^\w\s\-.,!?()'"]/g, ''); // Keep only safe characters
}

/**
 * Validates input content and lengths
 */
export function validateInputs(request: GenerateContentRequest): string | null {
  // Validate required fields are not empty after sanitization
  if (!sanitizeInput(request.audienceId) || !sanitizeInput(request.generationJobTitle) || 
      !sanitizeInput(request.contentType) || !sanitizeInput(request.context)) {
    return ERRORS.MISSING_REQUIRED_FIELDS;
  }

  // Validate job title length and content
  const sanitizedTitle = sanitizeInput(request.generationJobTitle);
  if (sanitizedTitle.length > 100 || sanitizedTitle.length < 1) {
    return ERRORS.INVALID_JOB_TITLE;
  }

  // Validate content type
  const sanitizedContentType = sanitizeInput(request.contentType);
  if (sanitizedContentType.length > 50 || sanitizedContentType.length < 1) {
    return ERRORS.INVALID_CONTENT_TYPE;
  }

  // Validate content length
  if (request.content && request.content.length > CONTENT_MAX_LENGTH) {
    return ERRORS.CONTENT_TOO_LONG;
  }

  // Validate context length
  if (request.context.length > CONTEXT_MAX_LENGTH) {
    return ERRORS.CONTEXT_TOO_LONG;
  }

  return null;
}

/**
 * Fetches and validates audience data from Firestore
 */
export async function getAudienceData(uid: string, audienceId: string): Promise<AudienceData | null> {
  try {
    const audienceRef = await db.collection("users").doc(uid).collection("audiences").doc(audienceId).get();
    const audienceData = audienceRef.data();

    if (!audienceData) {
      return null;
    }

    // Validate required audience fields
    if (!audienceData.name || !Array.isArray(audienceData.entities)) {
      return null;
    }

    return {
      name: audienceData.name,
      entities: audienceData.entities,
      ageTotals: audienceData.ageTotals || {},
      genderTotals: audienceData.genderTotals || {},
      imageUrl: audienceData.imageUrl || null,
    };
  } catch (error) {
    console.error("Error fetching audience data:", error);
    return null;
  }
}

/**
 * Creates the content generation prompt
 */
export function createContentPrompt(contentType: string, audienceData: AudienceData, context: string): string {
  const audienceDescription = `The audience is named ${audienceData.name}. Their interests include ${audienceData.entities.map((e: Entity) => e.name).join(', ')}. Age distribution: ${JSON.stringify(audienceData.ageTotals)}. Gender distribution: ${JSON.stringify(audienceData.genderTotals)}.`;

  return `You are an AI assistant specialized in tailoring ${contentType} content for specific target audiences. ${audienceDescription}.
    
    !!IMPORTANT: Additional Context: ${context}
    
    Based on the audience description and additional context, please provide the refined content. Focus on tone, vocabulary, and style to resonate with the target audience.
    
    !!IMPORTANT: your response should **ONLY** be the refined content.`;
}

/**
 * Creates the icon selection prompt
 */
export function createIconPrompt(contentType: string): string {
  const availableIcons = Object.keys(jobIconNames).join(', ');
  
  return `You are an AI assistant specialized in selecting the most appropriate icon for a given job. The job is ${contentType}
    
    The icon options are: ${availableIcons}
    
    !!IMPORTANT: your response should **ONLY** be the icon name and NOTHING ELSE.
    !!IMPORTANT: Make sure the first letter of the icon name is capitalized.`;
}

/**
 * Generates content and icon using OpenAI
 */
export async function generateContentAndIcon(
  openai: OpenAI,
  contentPrompt: string, 
  iconPrompt: string
): Promise<{ content: string; icon: string }> {
  try {
    const [chatCompletion, iconCompletion] = await Promise.all([
      openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: contentPrompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: iconPrompt }],
        max_tokens: 10,
        temperature: 0.3,
      }),
    ]);

    const generatedContent = chatCompletion.choices[0]?.message?.content;
    const selectedIcon = iconCompletion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error(ERRORS.GENERATION_FAILED);
    }

    if (!selectedIcon) {
      throw new Error(ERRORS.ICON_GENERATION_FAILED);
    }

    return {
      content: generatedContent.trim(),
      icon: selectedIcon.trim(),
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(ERRORS.GENERATION_FAILED);
  }
}

/**
 * Creates and saves the job to Firestore
 */
export async function createJob(
  uid: string,
  request: GenerateContentRequest,
  audienceData: AudienceData,
  generatedContent: string,
  selectedIcon: string
): Promise<Job> {
  try {
    const docRef = db.collection("users").doc(uid).collection("jobs").doc();
    
    const newJob: Job = {
      id: docRef.id,
      title: sanitizeInput(request.generationJobTitle),
      audience: {
        id: request.audienceId,
        name: audienceData.name,
        imageUrl: audienceData.imageUrl || undefined,
      },
      icon: (selectedIcon in jobIcons ? selectedIcon : 'Default') as keyof typeof jobIcons,
      contentType: sanitizeInput(request.contentType),
      generatedContent: generatedContent,
      originalContent: request.content ? sanitizeInput(request.content) : '',
      context: sanitizeInput(request.context),
      createdAt: AdminTimestamp.fromDate(new Date()) as unknown as Timestamp,
    };

    await docRef.set(newJob);
    return newJob;
  } catch (error) {
    console.error("Error saving job to Firestore:", error);
    throw new Error("Failed to save generated content");
  }
}
