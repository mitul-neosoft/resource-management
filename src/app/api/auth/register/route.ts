import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { resolveRoleForEmail } from "@/constants/auth";
import { UserRole } from "@/constants/roles";
import { registerSchema } from "@/lib/validations/schemas";
import { parseSkillsFromJD } from "@/lib/utils/skillsParser";

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
    const designation =
      role === UserRole.RESOURCE_MANAGER ? "Resource Manager" : "Software Developer";

    const user = await User.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      password: hashedPassword,
      role,
      isActive: true,
      employeeId,
      designation,
      jd: designation,
      skills: parseSkillsFromJD(designation),
      noticePeriodDays: 90,
    });

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
