import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { courseRepository } from "@/lib/repositories/course.repository";

export const PUT = createHandler(
  async ({ params, body }) => {
    const data = body as { progress?: number; status?: string };
    const progress = data.progress ?? 0;
    const status =
      data.status ||
      (progress >= 100 ? "Completed" : progress >= 75 ? "On Track" : "In Progress");

    const assignment = await courseRepository.updateAssignment(params.id, {
      progress,
      status,
    });
    if (!assignment) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ message: "Updated.", assignment });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);
