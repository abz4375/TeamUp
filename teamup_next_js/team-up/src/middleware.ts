import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log("middleware hit hua");
  return NextResponse.redirect(new URL('/log-in', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/home',
}