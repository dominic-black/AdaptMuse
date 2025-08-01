import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { requireAuth } from '@/lib/authMiddleware';
import {
  validateRequestBody,
  validateInputs,
  getAudienceData,
  createContentPrompt,
  createIconPrompt,
  generateContentAndIcon,
  createJob,
  ERRORS
} from './utils';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const user = await requireAuth(request);
    const uid = user.uid;

    const adminIds = process.env.ADMIN_IDS?.split(',') || [];
    if (!adminIds.includes(uid)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = validateRequestBody(body);

    if (!validatedRequest) {
      return NextResponse.json(
        { error: ERRORS.MISSING_REQUIRED_FIELDS },
        { status: 400 }
      );
    }

    // Validate inputs
    const validationError = validateInputs(validatedRequest);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Fetch audience data
    const audienceData = await getAudienceData(uid, validatedRequest.audienceId);
    if (!audienceData) {
      return NextResponse.json(
        { error: ERRORS.AUDIENCE_NOT_FOUND },
        { status: 404 }
      );
    }

    // Create prompts
    const contentPrompt = createContentPrompt(
      validatedRequest.contentType,
      audienceData,
      validatedRequest.context
    );

    const iconPrompt = createIconPrompt(validatedRequest.contentType);

    // Generate content and icon
    const { content: generatedContent, icon: selectedIcon } = await generateContentAndIcon(
      openai,
      contentPrompt,
      iconPrompt
    );

    // Create and save job
    const newJob = await createJob(
      uid,
      validatedRequest,
      audienceData,
      generatedContent,
      selectedIcon
    );

    return NextResponse.json(newJob);
  } catch (error) {
    // Handle authentication errors
    if (error instanceof NextResponse) {
      return error;
    }

    console.error('Error in content generation:', error);

    // Return appropriate error message
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unexpected error occurred while generating content';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
