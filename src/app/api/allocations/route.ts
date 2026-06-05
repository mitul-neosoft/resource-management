import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { allocationSchema } from "@/lib/validations/schemas";
import {
  allocateCandidateToJob,
  getRecentAllocations,
} from "@/lib/services/allocation.service";

export const GET = createHandler(
  async () => {
    const allocations = await getRecentAllocations(10);
    return jsonOk({ allocations });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const { candidateId, employeeId, jobId } = body as ReturnType<
      typeof allocationSchema.parse
    >;
    const allocation = await allocateCandidateToJob(
      candidateId,
      jobId,
      auth.userId,
      employeeId
    );
    return jsonOk({ message: "Candidate allocated.", allocation }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: allocationSchema }
);
