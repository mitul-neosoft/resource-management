import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { getReportsOverview } from "@/lib/services/report.service";

export const GET = createHandler(
  async () => {
    const overview = await getReportsOverview();
    return jsonOk(overview);
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
