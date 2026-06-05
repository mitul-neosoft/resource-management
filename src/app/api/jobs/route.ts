import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { jobCreateSchema } from "@/lib/validations/schemas";
import { jobRepository } from "@/lib/repositories/job.repository";

export const GET = createHandler(
  async ({ auth }) => {
    const filter =
      auth.role === UserRole.USER ? { status: "open" } : {};
    const jobs = await jobRepository.findAll(filter);
    return jsonOk({ jobs });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const data = body as ReturnType<typeof jobCreateSchema.parse>;
    const job = await jobRepository.create({
      ...data,
      createdBy: new Types.ObjectId(auth.userId),
    });
    return jsonOk({ message: "Job created.", job }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: jobCreateSchema }
);
