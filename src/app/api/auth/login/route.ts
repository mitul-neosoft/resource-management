import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/schemas";
import { UserRole } from "@/constants/roles";
import { resolveRoleForEmail } from "@/constants/auth";
import { ensureDashboardStats, seedLearningForEmployee } from "@/lib/seed/seedData";
import { seedRmDataIfEmpty } from "@/lib/seed/rmSeed";

export async function POST(request: Request) {
  try {
    const { email, password } = loginSchema.parse(await request.json());
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const expectedRole = resolveRoleForEmail(user.email);
    if (user.role !== expectedRole) {
      user.role = expectedRole;
      await user.save();
    }

    const employeeId = user.employeeId || String(user._id);

    if (user.role === UserRole.USER) {
      await ensureDashboardStats(employeeId);
      await seedLearningForEmployee(employeeId);
    }

    if (user.role === UserRole.RESOURCE_MANAGER) {
      await seedRmDataIfEmpty(String(user._id));
    }

    const token = generateToken({
      userId: String(user._id),
      email: user.email,
      employeeId,
      role: user.role as UserRole,
    });

    const response = NextResponse.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId,
        designation: user.designation,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set("role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
