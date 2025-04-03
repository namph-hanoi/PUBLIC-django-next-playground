import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/settings';
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/user/login/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }
    );

    const [_error, text] = await getResponseText(response.json());

    if (!response.ok) {
      return NextResponse.json(
        { error: text || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    let responseObj;

    const refreshToken = text[REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      responseObj = new NextResponse(
        JSON.stringify({
          error: {
            detail: 'No refresh token found'
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
    } else {
      responseObj = new NextResponse(
        JSON.stringify({
          [ACCESS_TOKEN_KEY]: text[ACCESS_TOKEN_KEY]
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      responseObj.cookies.set({
        name: REFRESH_TOKEN_KEY,
        value: text[REFRESH_TOKEN_KEY],
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // TODO: make a variable of refreshtoken age for both BE & FE uses
        maxAge: 7 * 24 * 60 * 60
      });
    }



    return responseObj;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
