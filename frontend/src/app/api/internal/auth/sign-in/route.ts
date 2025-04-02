import { catchErrorTyped as getResponseText } from '@/lib/catchErrorTyped';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const [_error, text] = await getResponseText(response.json());

    if (!response.ok) {
      return NextResponse.json(
        { error: text || 'Authentication failed' },
        { status: response.status }
      );
    }

    const responseObj = new NextResponse(
      JSON.stringify({
        access_token: text.access_token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Set refresh token in HTTP-only cookie
    responseObj.cookies.set({
      name: 'refresh_token',
      value: text.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // TODO: make a variable of refreshtoken age for both BE & FE uses
      maxAge: 7 * 24 * 60 * 60
    });
    
    return responseObj;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
