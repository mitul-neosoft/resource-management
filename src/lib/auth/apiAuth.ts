import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type TokenPayload } from "./jwt";

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("token")?.value ?? null;
}

export function requireAuth(
  request: NextRequest
): { payload: TokenPayload } | NextResponse {
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
    },
  };
}

export function isAuthError(
  result: { payload: TokenPayload } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
