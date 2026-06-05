import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { getJobMatches } from "@/lib/services/matching.service";

export const GET = createHandler(
  async ({ params }) => {
    const result = await getJobMatches(params.id);
    if (!result) return jsonOk({ error: "Job not found" }, 404);
    return jsonOk(result);
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);
