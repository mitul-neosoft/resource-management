import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserRole } from "@/constants/roles";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const JWT_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  employeeId: string;
  role: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): (JwtPayload & TokenPayload) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
}
