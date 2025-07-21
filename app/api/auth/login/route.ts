import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebaseAdmin'

const SESSION_MAX_AGE = 60 * 60 * 24 * 5 // 5 days in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Create a session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE * 1000 });
    
    // Create response with session cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_MAX_AGE,
      sameSite: 'strict',
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
  }
}
