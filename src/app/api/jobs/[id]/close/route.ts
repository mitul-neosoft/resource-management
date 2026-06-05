import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { jobRepository } from "@/lib/repositories/job.repository";

export const POST = createHandler(
  async ({ params }) => {
    const job = await jobRepository.close(params.id);
    if (!job) return jsonOk({ error: "Job not found" }, 404);
    return jsonOk({ message: "Job closed.", job });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
