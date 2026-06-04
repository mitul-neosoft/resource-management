import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/config/db";
import User from "@/lib/models/UserModels";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error?.stack || error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Internal server error." : (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
