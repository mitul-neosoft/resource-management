import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { resolveRoleForEmail } from "@/constants/auth";
import { UserRole } from "@/constants/roles";
import { registerSchema } from "@/lib/validations/schemas";
import { parseSkillsFromJD } from "@/lib/utils/skillsParser";
import { normalizeEmployeeId } from "@/lib/utils/employeeId";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    await connectDB();

    const email = body.email.toLowerCase().trim();
    const employeeId = normalizeEmployeeId(body.employeeId);
    const role = resolveRoleForEmail(email);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    if (role === UserRole.RESOURCE_MANAGER) {
      const [existingEmail, existingEmployeeId] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ employeeId }),
      ]);

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already registered." },
          { status: 409 }
        );
      }
      if (existingEmployeeId) {
        return NextResponse.json(
          { error: "Employee ID already registered." },
          { status: 409 }
        );
      }

      const designation = "Resource Manager";
      const user = await User.create({
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email,
        password: hashedPassword,
        role,
        isActive: true,
        employeeId,
        isRegistered: true,
        uploadedFromBench: false,
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
    }

    const benchUser = await User.findOne({
      employeeId,
      uploadedFromBench: true,
    });

    if (!benchUser) {
      return NextResponse.json(
        {
          error:
            "Employee ID not found in bench records. Please contact your manager.",
        },
        { status: 404 }
      );
    }

    if (benchUser.isRegistered) {
      return NextResponse.json(
        { error: "This Employee ID is already registered." },
        { status: 409 }
      );
    }

    const emailTaken = await User.findOne({
      email,
      _id: { $ne: benchUser._id },
    });
    if (emailTaken) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 }
      );
    }

    benchUser.firstName = body.firstName.trim();
    benchUser.lastName = body.lastName.trim();
    benchUser.email = email;
    benchUser.password = hashedPassword;
    benchUser.isRegistered = true;
    await benchUser.save();

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: benchUser._id,
          firstName: benchUser.firstName,
          lastName: benchUser.lastName,
          email: benchUser.email,
          role: benchUser.role,
          employeeId: benchUser.employeeId,
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
