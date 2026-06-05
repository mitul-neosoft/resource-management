import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skill from "@/lib/models/Skill";
import DashboardStats from "@/lib/models/DashboardStats";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    await connectDB();
    const skills = await Skill.find({ employeeId: auth.payload.employeeId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("GET skills error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { skillName, experience, level } = await request.json();

    if (!skillName?.trim() || experience === undefined || !level) {
      return NextResponse.json(
        { error: "Skill name, experience, and level are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const skill = await Skill.create({
      employeeId: auth.payload.employeeId,
      skillName: skillName.trim(),
      experience: Number(experience),
      level,
    });

    const totalSkills = await Skill.countDocuments({
      employeeId: auth.payload.employeeId,
    });
    await DashboardStats.findOneAndUpdate(
      { employeeId: auth.payload.employeeId },
      { totalSkills },
      { upsert: true }
    );

    return NextResponse.json({ message: "Skill added.", skill }, { status: 201 });
  } catch (error) {
    console.error("POST skills error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
