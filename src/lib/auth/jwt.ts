import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string =
  process.env.ACCESS_TOKEN_SECRET ||
  "your-secret-key-change-in-production";

const REFRESH_TOKEN_SECRET: string =
  process.env.REFRESH_TOKEN_SECRET ||
  "your-refresh-secret-change-in-production";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (
  userId: string,
  email: string
): string => {
  return jwt.sign(
    { userId, email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (
  userId: string,
  email: string
): string => {
  return jwt.sign(
    { userId, email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

export const verifyAccessToken = (
  token: string
): (JwtPayload & TokenPayload) | null => {
  try {
    return jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): (JwtPayload & TokenPayload) | null => {
  try {
    return jwt.verify(
      token,
      REFRESH_TOKEN_SECRET
    ) as JwtPayload & TokenPayload;
  } catch {
    return null;
  }
};

export const decodeToken = (
  token: string
): JwtPayload | string | null => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

export const generateTokens = (
  userId: string,
  email: string
): {
  accessToken: string;
  refreshToken: string;
} => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
};