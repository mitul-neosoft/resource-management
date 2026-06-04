import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/lib/models/Skill";
import DashboardStats from "@/lib/models/DashboardStats";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    const { skillName, experience, level } = await request.json();

    await connectDB();

    const skill = await Skill.findOne({
      _id: id,
      employeeId: auth.payload.employeeId,
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }

    if (skillName) skill.skillName = skillName.trim();
    if (experience !== undefined) skill.experience = Number(experience);
    if (level) skill.level = level;
    await skill.save();

    return NextResponse.json({ message: "Skill updated.", skill });
  } catch (error) {
    console.error("PUT skill error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    await connectDB();

    const deleted = await Skill.findOneAndDelete({
      _id: id,
      employeeId: auth.payload.employeeId,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    }

    const totalSkills = await Skill.countDocuments({
      employeeId: auth.payload.employeeId,
    });
    await DashboardStats.findOneAndUpdate(
      { employeeId: auth.payload.employeeId },
      { totalSkills }
    );

    return NextResponse.json({ message: "Skill deleted." });
  } catch (error) {
    console.error("DELETE skill error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
