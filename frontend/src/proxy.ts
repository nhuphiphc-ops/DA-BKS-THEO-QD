import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get('bks_token')?.value;

  // Tự động cấp session demo nếu chưa có token để người dùng mở link vào được ngay
  if (!token) {
    response.cookies.set('bks_token', 'demo-guest-session-bks-2026', {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
