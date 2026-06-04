import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const JWT_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  employeeId: string;
}

export function generateToken(
  userId: string,
  email: string,
  employeeId: string
): string {
  return jwt.sign({ userId, email, employeeId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

export function verifyToken(token: string): (JwtPayload & TokenPayload) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
}
