interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
interface AuthResult {
  error: string | null;
  status: number;
  data: JwtPayload | null;
}
interface TokenPayload {
  userId: string;
  email: string;
}
export type { JwtPayload, AuthResult, TokenPayload };