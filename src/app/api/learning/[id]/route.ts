import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LearningCourse from "@/lib/models/LearningCourse";
import DashboardStats from "@/lib/models/DashboardStats";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    const body = await request.json();

    await connectDB();

    const course = await LearningCourse.findOneAndUpdate(
      { _id: id, employeeId: auth.payload.employeeId },
      body,
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const courses = await LearningCourse.find({
      employeeId: auth.payload.employeeId,
    });
    const learningProgress =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
          )
        : 0;

    await DashboardStats.findOneAndUpdate(
      { employeeId: auth.payload.employeeId },
      { learningProgress },
      { upsert: true }
    );

    return NextResponse.json({ message: "Course updated.", course });
  } catch (error) {
    console.error("PUT learning error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    await connectDB();

    const course = await LearningCourse.findOneAndDelete({
      _id: id,
      employeeId: auth.payload.employeeId,
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted." });
  } catch (error) {
    console.error("DELETE learning error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
