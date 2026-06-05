import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LearningCourse from "@/lib/models/LearningCourse";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";
import { seedLearningForEmployee } from "@/lib/seed/seedData";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    await connectDB();
    await seedLearningForEmployee(auth.payload.employeeId);

    const courses = await LearningCourse.find({
      employeeId: auth.payload.employeeId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("GET learning error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { title, description, progress, assignedBy, dueDate } = await request.json();

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: "Title and due date are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const course = await LearningCourse.create({
      title,
      description: description || "",
      progress: progress ?? 0,
      assignedBy: assignedBy || "HR Team",
      dueDate: new Date(dueDate),
      employeeId: auth.payload.employeeId,
    });

    return NextResponse.json({ message: "Course created.", course }, { status: 201 });
  } catch (error) {
    console.error("POST learning error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
