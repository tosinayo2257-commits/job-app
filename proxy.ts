import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function middleware(request: NextRequest) {
  const session = await getSession();

  const pathname = request.nextUrl.pathname;

  const isDashboardPage = pathname.startsWith("/dashboard");
  const isSignInPage = pathname.startsWith("/sign-in");
  const isSignUpPage = pathname.startsWith("/sign-up");

  // Protect dashboard routes
  if (isDashboardPage && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Prevent logged in users from accessing auth pages
  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
