import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

interface AuthResult {
  error: string | null;
  status: number;
  data: unknown;
}

export const verifyToken = (token: string): unknown | null => {
  if (!token) {
    return null;
  }

  const decoded = verifyAccessToken(token);
  return decoded;
};

export const getTokenFromRequest = (
  request: NextRequest
): string | null => {
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  return accessToken || null;
};

export const authenticateRequest = (
  request: NextRequest
): AuthResult => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      error: "Authorization token missing.",
      status: 401,
      data: null,
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      error: "Invalid or expired token.",
      status: 401,
      data: null,
    };
  }

  return {
    error: null,
    status: 200,
    data: decoded,
  };
};