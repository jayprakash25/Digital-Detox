import { NextResponse } from "next/server";
import  { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    if (
      url.pathname === "/sign-in") {
      return NextResponse.redirect(new URL("/interests", request.url));
    }

  } else {
    // Redirect unauthenticated users away from protected pages
    if (url.pathname.startsWith('/interests') || url.pathname.startsWith('/curated-feed')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }


  return NextResponse.next()
}

// See "Matching Paths" 
export const config = {
  matcher: ["/sign-in", "/", '/interests', '/curated-feed'],
};