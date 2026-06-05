import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { resolveRoleForEmail } from "@/constants/auth";
import { UserRole } from "@/constants/roles";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";
import { registerSchema } from "@/lib/validations/schemas";
import { ensureDashboardStats } from "@/lib/seed/seedData";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    await connectDB();

    const email = body.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const role = resolveRoleForEmail(email);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const employeeId = `EMP-${Date.now().toString().slice(-6)}`;

    const user = await User.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      password: hashedPassword,
      role,
      isActive: true,
      employeeId,
      designation:
        role === UserRole.RESOURCE_MANAGER
          ? "Resource Manager"
          : "Software Developer",
    });

    if (role === UserRole.USER) {
      await ensureDashboardStats(employeeId);
      await benchCandidateRepository.upsertByEmail(email, {
        name: `${body.firstName.trim()} ${body.lastName.trim()}`,
        email,
        role: user.designation || "Software Developer",
        skills: [],
        experience: "0 yrs",
        location: "Remote",
        benchDays: 0,
        noticePeriodDays: 90,
        status: "Active",
        userId: user._id,
      });
    }

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error." },
      { status: 500 }
    );
  }
}
