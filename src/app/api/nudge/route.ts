import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { nudgeSchema } from "@/lib/validations/schemas";
import { sendNudge } from "@/lib/services/nudge.service";

export const POST = createHandler(
  async ({ auth, body }) => {
    const data = body as ReturnType<typeof nudgeSchema.parse>;
    const notification = await sendNudge({
      ...data,
      createdBy: auth.userId,
    });
    return jsonOk({ message: "Nudge sent.", notification }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: nudgeSchema }
);
