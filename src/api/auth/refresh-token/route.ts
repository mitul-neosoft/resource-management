import { NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import RefreshToken from "@/lib/models/RefreshToken";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken = request.cookies.get("refreshToken")?.value || body.refreshToken;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required." }, { status: 400 });
    }

    await connectDB();

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired refresh token." }, { status: 401 });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!storedToken) {
      return NextResponse.json({ error: "Refresh token not found or revoked." }, { status: 401 });
    }

    const accessToken = generateAccessToken(decoded.userId, decoded.email);
    const response = NextResponse.json({ message: "Access token refreshed." }, { status: 200 });

    const secure = process.env.NODE_ENV === "production";
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
