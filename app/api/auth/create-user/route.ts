import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { validateCreateUser } from '@/utils/validation';
import { CreateUserFormData } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body as CreateUserFormData;

    // Get the ID token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token and get the uid securely
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // Validate the form data
    const validationResult = validateCreateUser({ email, firstName, lastName });
    if (validationResult) {
      return NextResponse.json({ error: validationResult }, { status: 400 });
    }

    // Create user data object
    const userData = {
      id: uid,
      email: email,
      createdAt: new Date(),
      firstName,
      lastName
    };

    // Store user data in Firestore
    await db.collection('users').doc(uid).set(userData);

    return NextResponse.json({
      uid: uid,
      email: email,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create-user API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
