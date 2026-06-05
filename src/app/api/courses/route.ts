import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { courseCreateSchema } from "@/lib/validations/schemas";
import { courseRepository } from "@/lib/repositories/course.repository";

export const GET = createHandler(
  async () => {
    const courses = await courseRepository.findAllCourses();
    return jsonOk({ courses });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const data = body as ReturnType<typeof courseCreateSchema.parse>;
    const course = await courseRepository.createCourse({
      ...data,
      createdBy: new Types.ObjectId(auth.userId),
    });
    return jsonOk({ message: "Course created.", course }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: courseCreateSchema }
);
