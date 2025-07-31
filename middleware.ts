import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
function isPublic(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("session")?.value;
  
  // If user is authenticated (has session cookie) and trying to access public routes
  if (sessionCookie && isPublic(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  
  // If user is not authenticated and trying to access protected routes
  if (!sessionCookie && !isPublic(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\.).*)"],
};
