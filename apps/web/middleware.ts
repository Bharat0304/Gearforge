import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // If the user does not have a token, redirect to the sign-in page
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Token exists, proceed to the requested route
  return NextResponse.next();
}

// Ensure the middleware is only run on protected routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
