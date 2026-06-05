import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { benchCandidateSchema } from "@/lib/validations/schemas";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";

export const GET = createHandler(
  async ({ params }) => {
    const candidate = await benchCandidateRepository.findById(params.id);
    if (!candidate) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ candidate });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const PUT = createHandler(
  async ({ params, body }) => {
    const data = body as Partial<ReturnType<typeof benchCandidateSchema.parse>>;
    const candidate = await benchCandidateRepository.update(params.id, {
      ...data,
      experience: data.experience !== undefined ? String(data.experience) : undefined,
    });
    if (!candidate) return jsonOk({ error: "Not found" }, 404);
    return jsonOk({ message: "Updated.", candidate });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const DELETE = createHandler(
  async ({ params }) => {
    await benchCandidateRepository.delete(params.id);
    return jsonOk({ message: "Deleted." });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
