import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import User from "@/lib/models/User";

export const GET = createHandler(
  async () => {
    const users = await User.find({ role: UserRole.USER, isActive: true })
      .select("firstName lastName email designation employeeId")
      .sort({ firstName: 1 })
      .lean();
    return jsonOk({ users });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
