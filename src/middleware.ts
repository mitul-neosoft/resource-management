import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/constants/roles";

const authPaths = ["/login", "/register", "/forgot-password"];

const userPaths = [
  "/dashboard",
  "/jobs",
  "/learning",
];

const rmPaths = ["/rm"];

function matchesPath(pathname: string, bases: string[]) {
  return bases.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value as UserRole | undefined;
  const isAuthenticated = Boolean(token);

  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isUserArea = matchesPath(pathname, userPaths);
  const isRmArea = matchesPath(pathname, rmPaths);

  if ((isUserArea || isRmArea) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isAuthenticated) {
    const dest =
      role === UserRole.RESOURCE_MANAGER ? "/rm/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isAuthenticated && role) {
    if (isRmArea && role !== UserRole.RESOURCE_MANAGER) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isUserArea && role === UserRole.RESOURCE_MANAGER) {
      return NextResponse.redirect(new URL("/rm/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jobs/:path*",
    "/learning/:path*",
    "/rm/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
