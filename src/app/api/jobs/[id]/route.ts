import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { jobUpdateSchema } from "@/lib/validations/schemas";
import { jobRepository } from "@/lib/repositories/job.repository";

export const GET = createHandler(
  async ({ params }) => {
    const job = await jobRepository.findById(params.id);
    if (!job) return jsonOk({ error: "Job not found" }, 404);
    return jsonOk({ job });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const PUT = createHandler(
  async ({ params, body }) => {
    const job = await jobRepository.update(
      params.id,
      body as Record<string, unknown>
    );
    if (!job) return jsonOk({ error: "Job not found" }, 404);
    return jsonOk({ message: "Job updated.", job });
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: jobUpdateSchema }
);

export const DELETE = createHandler(
  async ({ params }) => {
    await jobRepository.delete(params.id);
    return jsonOk({ message: "Job deleted." });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
