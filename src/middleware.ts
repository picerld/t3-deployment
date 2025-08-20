import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/items", "/categories", "/locations", "/users", "/statistik", "/documents"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth.token")?.value;
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && pathname === "/login" && !searchParams.has("force")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/items/:path*",
    "/categories/:path*",
    "/locations/:path*",
    "/users/:path*",
    "/statistik/:path*",
    "/documents/:path*",
  ],
};
