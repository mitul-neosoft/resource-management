import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { userRepository } from "@/lib/repositories/user.repository";

export const GET = createHandler(
  async ({ params }) => {
    const user = await userRepository.findBenchUserById(params.id);
    if (!user) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ candidate: user });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const PUT = createHandler(
  async ({ params, body }) => {
    const data = body as {
      clientContractEndDate?: string;
      resignDate?: string | null;
      noticePeriodDays?: number;
      status?: string;
      location?: string;
      experience?: string;
    };

    const update: Record<string, unknown> = { ...data };
    if (data.clientContractEndDate) {
      update.clientContractEndDate = new Date(data.clientContractEndDate);
    }
    if (data.resignDate === null) {
      update.resignDate = null;
    } else if (data.resignDate) {
      update.resignDate = new Date(data.resignDate);
    }

    const candidate = await userRepository.update(params.id, update);
    if (!candidate) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ message: "Updated.", candidate });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const DELETE = createHandler(
  async ({ params }) => {
    await userRepository.delete(params.id);
    return jsonOk({ message: "Deleted." });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
