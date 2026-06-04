import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/config/db";
import User from "@/lib/models/UserModels";
import RefreshToken from "@/lib/models/RefreshToken";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const { email, password, remember = false } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id, user.email);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });

    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mustChangePassword: user.mustChangePassword || false,
        },
      },
      { status: 200 }
    );

    const secure = process.env.NODE_ENV === "production";
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: remember ? 7 * 24 * 60 * 60 : undefined,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
