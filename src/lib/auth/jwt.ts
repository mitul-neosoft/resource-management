import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { UserRole } from "@/constants/roles";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const JWT_EXPIRY = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export interface TokenPayload {
  userId: string;
  email: string;
  employeeId: string;
  role: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyToken(token: string): (JwtPayload & TokenPayload) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
}

export function verifyAccessToken(token: string): (JwtPayload & { userId: string; email: string }) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): (JwtPayload & { userId: string; email: string }) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string };
  } catch {
    return null;
  }
}
