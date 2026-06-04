import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import ResetToken from "@/lib/models/ResetToken";

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Token, password, and confirm password are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await ResetToken.findOne({ token: hashedToken });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      if (resetRecord) {
        await ResetToken.deleteOne({ _id: resetRecord._id });
      }
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await ResetToken.deleteOne({ _id: resetRecord._id });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
