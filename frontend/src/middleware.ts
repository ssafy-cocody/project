import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const REFRESH_TOKEN = 'refreshToken';

export function middleware(request: NextRequest) {
  const isUser = request.cookies.has(REFRESH_TOKEN);
  if (!isUser) return NextResponse.redirect(new URL('/signin', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/calendar/:path*', '/closet/:path*', '/clothes/:path*', '/cody/:path*', '/mypage/:path*'],
};
