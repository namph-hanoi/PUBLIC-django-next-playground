import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/dashboard", "/logout"];

export async function middleware(request: Request) {
  console.log(`Middleware accessed: ${request.url}`);
  const url = new URL(request.url);
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  const cookies = request.headers.get('cookie') || '';
  const hasRefreshToken = cookies.includes('refresh_token=');

  if (isProtectedRoute && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isProtectedRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}