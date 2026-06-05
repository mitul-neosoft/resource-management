import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { getUserJobMatches } from "@/lib/services/matching.service";

/** USER: all job matches for logged-in user */
export const GET = createHandler(
  async ({ auth }) => {
    const matches = await getUserJobMatches(auth.userId);
    return jsonOk({ matches });
  },
  { roles: [UserRole.USER] }
);
