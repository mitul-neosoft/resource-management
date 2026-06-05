import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type TokenPayload } from "./jwt";
import { UserRole } from "@/constants/roles";

export interface AuthContext {
  userId: string;
  email: string;
  employeeId: string;
  role: UserRole;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("token")?.value ?? null;
}

export function requireAuth(
  request: NextRequest
): { payload: AuthContext } | NextResponse {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  return {
    payload: {
      userId: payload.userId,
      email: payload.email,
      employeeId: payload.employeeId,
      role: (payload.role as UserRole) || UserRole.USER,
    },
  };
}

export function isAuthError(
  result: { payload: AuthContext } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}

export function requireRole(auth: AuthContext, roles: UserRole[]): boolean {
  return roles.includes(auth.role);
}
