import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import ResetToken from "@/lib/models/ResetToken";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If that email exists, reset instructions have been sent.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await ResetToken.deleteMany({ user: user._id });
    await ResetToken.create({
      user: user._id,
      token: hashedToken,
      expiresAt,
    });

    const response: Record<string, string> = {
      message: "If that email exists, reset instructions have been sent.",
    };

    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
