import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/config/db";
import User from "@/lib/models/UserModels";
import ResetToken from "@/lib/models/ResetToken";
import sendEmail from "@/lib/services/mail/sendMail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await ResetToken.create({ user: user._id, token: hashedToken });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/forgot-password?token=${resetToken}`;
    const html = `
      <p>Hi ${user.name || "User"},</p>
      <p>We received a request to reset your password. Use the code below or follow the link to reset it securely.</p>
      <p><strong>Reset code:</strong> ${resetToken}</p>
      <p><strong>Reset link:</strong> <a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail(user.email, "Reset your password", html);
    } catch (err) {
      console.error("Failed sending reset password email:", err);
      // continue, but the user should still be notified if delivery fails in production
    }

    return NextResponse.json(
      {
        message: "Reset instructions have been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forget-password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
