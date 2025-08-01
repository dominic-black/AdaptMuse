import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response and clear the session cookie
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'strict',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Error logging out' }, { status: 500 });
  }
}
