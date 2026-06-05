import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { courseCreateSchema } from "@/lib/validations/schemas";
import { courseRepository } from "@/lib/repositories/course.repository";

export const PUT = createHandler(
  async ({ params, body }) => {
    const data = body as Partial<ReturnType<typeof courseCreateSchema.parse>>;
    const course = await courseRepository.updateCourse(params.id, data);
    if (!course) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ message: "Course updated.", course });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
