import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import DashboardStats from "@/lib/models/DashboardStats";
import Skill from "@/lib/models/Skill";
import LearningCourse from "@/lib/models/LearningCourse";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";
import { ensureDashboardStats } from "@/lib/seed/seedData";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    await connectDB();

    const { employeeId } = auth.payload;
    await ensureDashboardStats(employeeId);

    const [user, stats, skillCount, courses] = await Promise.all([
      User.findById(auth.payload.userId).select(
        "firstName lastName email employeeId designation resignDate clientContractEndDate role"
      ),
      DashboardStats.findOne({ employeeId }),
      Skill.countDocuments({ employeeId }),
      LearningCourse.find({ employeeId }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const avgLearning =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
          )
        : stats?.learningProgress ?? 0;

    if (stats && stats.totalSkills !== skillCount) {
      stats.totalSkills = skillCount;
      stats.learningProgress = avgLearning;
      await stats.save();
    }

    return NextResponse.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId: user.employeeId || employeeId,
        designation: user.designation || "Employee",
        resignDate: user.resignDate,
        clientContractEndDate: user.clientContractEndDate,
      },
      stats: {
        employeeId,
        benchDays: stats?.benchDays ?? 0,
        noticeDaysLeft: stats?.noticeDaysLeft ?? 0,
        totalSkills: skillCount,
        learningProgress: avgLearning,
        updatedAt: stats?.updatedAt,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
