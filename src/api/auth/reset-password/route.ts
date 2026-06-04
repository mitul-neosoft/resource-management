import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/config/db";
import User from "@/lib/models/UserModels";
import ResetToken from "@/lib/models/ResetToken";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Token, new password, and confirm password are required." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    await connectDB();

    // Hash the token for comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find and verify the reset token
    const resetToken = await ResetToken.findOne({ token: hashedToken });
    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    // Check if token is expired (1 hour)
    const tokenAge = Date.now() - new Date(resetToken.createdAt).getTime();
    if (tokenAge > 3600000) {
      await ResetToken.deleteOne({ _id: resetToken._id });
      return NextResponse.json({ error: "Reset token has expired." }, { status: 400 });
    }

    // Find the user
    const user = await User.findById(resetToken.user);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset token
    await ResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Password reset successfully. You can now login with your new password." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
