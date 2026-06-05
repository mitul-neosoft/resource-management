import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Skill from "@/lib/models/Skill";
import { courseRepository } from "@/lib/repositories/course.repository";
import Interview from "@/lib/models/Interview";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";
import {
  calculateBenchDays,
  calculateNoticeDaysLeft,
} from "@/lib/utils/bench";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    await connectDB();

    const user =
      (await User.findOne({ employeeId: auth.payload.employeeId }).select(
        "-password"
      )) ||
      (await User.findById(auth.payload.userId).select("-password"));
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const employeeId = user.employeeId || auth.payload.employeeId;
    const [skillCount, assignments, interviews] = await Promise.all([
      Skill.countDocuments({ employeeId }),
      courseRepository.findAssignmentsByUser(auth.payload.userId),
      Interview.find({ userId: auth.payload.userId })
        .sort({ scheduledAt: -1 })
        .limit(3)
        .lean(),
    ]);

    const avgLearning =
      assignments.length > 0
        ? Math.round(
            assignments.reduce((sum, c) => sum + c.progress, 0) /
              assignments.length
          )
        : 0;

    const benchDays = calculateBenchDays(user.clientContractEndDate);
    const noticeDaysLeft = calculateNoticeDaysLeft(
      user.resignDate,
      user.noticePeriodDays ?? 90
    );

    return NextResponse.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId,
        designation: user.designation || user.jd || "Employee",
        resignDate: user.resignDate,
        clientContractEndDate: user.clientContractEndDate,
        skills: user.skills || [],
      },
      stats: {
        employeeId,
        benchDays,
        noticeDaysLeft,
        totalSkills: skillCount + (user.skills?.length || 0),
        learningProgress: avgLearning,
      },
      recentInterviews: interviews,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
