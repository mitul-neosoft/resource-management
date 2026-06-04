import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/config/db";
import RefreshToken from "@/lib/models/RefreshToken";
import { authenticateRequest } from "@/lib/auth/authMiddleware";

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const requestBody = await request.json().catch(() => ({}));
    const refreshToken = requestBody.refreshToken || request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required." }, { status: 400 });
    }

    await connectDB();

    await RefreshToken.updateOne(
      { token: refreshToken, user: (auth.data as any).userId },
      { revoked: true }
    );

    const response = NextResponse.json({ message: "Logged out successfully." }, { status: 200 });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
