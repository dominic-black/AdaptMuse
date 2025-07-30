/**
 * Authentication Middleware for Next.js API Routes
 * 
 * This module provides secure, industry-standard authentication utilities for API routes.
 * It handles session cookie verification, user authentication, and standardized error responses.
 * 
 * @example Basic Usage
 * ```typescript
 * import { requireAuth } from '@/lib/authMiddleware';
 * 
 * export async function POST(request: NextRequest) {
 *   try {
 *     const user = await requireAuth(request);
 *     // Your authenticated route logic here
 *     // user.uid, user.email, user.emailVerified available
 *     
 *   } catch (error) {
 *     // Handle auth errors
 *     if (error instanceof NextResponse) {
 *       return error;
 *     }
 *     // Handle other errors
 *   }
 * }
 * ```
 * 
 * @example With Email Verification Required
 * ```typescript
 * const user = await requireAuth(request, { requireEmailVerification: true });
 * ```
 * 
 * @example Using Higher-Order Function (Advanced)
 * ```typescript
 * import { withAuth } from '@/lib/authMiddleware';
 * 
 * const handler = withAuth(async (request, user) => {
 *   // Your route logic with authenticated user
 *   return NextResponse.json({ userId: user.uid });
 * });
 * 
 * export { handler as POST };
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./firebaseAdmin";
import { AuthenticationResult, AuthenticatedUser, AuthenticationOptions } from "@/types/auth";

/**
 * Extracts and verifies the session cookie from a Next.js request
 * 
 * @param request - The Next.js request object
 * @param options - Optional configuration for authentication requirements
 * @returns Promise<AuthenticationResult> - Result containing user data or error information
 */
export async function authenticateRequest(
  request: NextRequest,
  options: AuthenticationOptions = {}
): Promise<AuthenticationResult> {
  
  // Extract session cookie from request
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return {
      success: false,
      error: "Authentication required. No session cookie found.",
      statusCode: 401
    };
  }

  try {
    // Verify the session cookie using Firebase Admin
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Check email verification if required
    if (options.requireEmailVerification && !decodedClaims.email_verified) {
      return {
        success: false,
        error: "Email verification required",
        statusCode: 403
      };
    }

    // Extract user information
    const user: AuthenticatedUser = {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified || false,
    };

    return {
      success: true,
      user
    };

  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle specific Firebase Auth errors
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return {
          success: false,
          error: "Session expired. Please log in again.",
          statusCode: 401
        };
      }
      
      if (error.message.includes('invalid')) {
        return {
          success: false,
          error: "Invalid session. Please log in again.",
          statusCode: 401
        };
      }
    }
    
    // Generic error for unknown issues
    return {
      success: false,
      error: "Authentication failed",
      statusCode: 500
    };
  }
}

/**
 * Higher-order function that wraps API route handlers with authentication
 * 
 * @param handler - The API route handler function
 * @param options - Optional authentication configuration
 * @returns Wrapped handler that includes authentication
 */
export function withAuth<T = unknown>(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: unknown[]) => Promise<NextResponse<T>>,
  options: AuthenticationOptions = {}
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse<T | { error: string }>> => {
    const authResult = await authenticateRequest(request, options);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode }
      ) as NextResponse<T | { error: string }>;
    }
    
    // Call the original handler with authenticated user
    return handler(request, authResult.user, ...args);
  };
}

/**
 * Simple helper function for routes that just need the authenticated user ID
 * 
 * @param request - The Next.js request object
 * @param options - Optional authentication configuration
 * @returns Promise with user ID or throws with NextResponse error
 */
export async function requireAuth(
  request: NextRequest,
  options: AuthenticationOptions = {}
): Promise<AuthenticatedUser> {
  const authResult = await authenticateRequest(request, options);
  
  if (!authResult.success) {
    throw NextResponse.json(
      { error: authResult.error },
      { status: authResult.statusCode }
    );
  }
  
  return authResult.user;
} 