import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  console.log(`Middleware accessed: ${request.url}`);
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  
  // TODO: Check for access and refresh token for protected routes

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}