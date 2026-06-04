import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/config/db";
import User from "@/lib/models/UserModels";

export async function POST(request:any) {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = await request.json();

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Email, current password, new password, and confirm password are required." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
  } catch (error) {
    console.error("Change-password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
