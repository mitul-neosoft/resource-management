import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { courseAssignmentSchema } from "@/lib/validations/schemas";
import { courseRepository } from "@/lib/repositories/course.repository";
import User from "@/lib/models/User";

export const GET = createHandler(
  async ({ auth, req }) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (auth.role === UserRole.USER) {
      const assignments = await courseRepository.findAssignmentsByUser(
        auth.userId
      );
      return jsonOk({ assignments });
    }

    const filter = userId ? { userId: new Types.ObjectId(userId) } : {};
    const assignments = await courseRepository.findAssignments(filter);
    return jsonOk({ assignments });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ body }) => {
    const data = body as ReturnType<typeof courseAssignmentSchema.parse>;
    const user = await User.findById(data.userId);
    if (!user) return jsonOk({ error: "User not found" }, 404);

    const progress = data.progress ?? 0;
    const status =
      data.status ||
      (progress >= 100 ? "Completed" : progress >= 75 ? "On Track" : "In Progress");

    const assignment = await courseRepository.createAssignment({
      userId: new Types.ObjectId(data.userId),
      courseId: new Types.ObjectId(data.courseId),
      progress,
      status,
    });

    return jsonOk({ message: "Course assigned.", assignment }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: courseAssignmentSchema }
);
