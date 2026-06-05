import User from "@/lib/models/User";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";

export const GET = createHandler(
  async ({ auth }) => {
    const user = await User.findById(auth.userId).select("-password");
    if (!user) {
      return jsonOk({ error: "User not found" }, 404);
    }
    return jsonOk({ user });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);
