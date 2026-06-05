import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { jobCreateSchema } from "@/lib/validations/schemas";
import { jobRepository } from "@/lib/repositories/job.repository";
import { matchRepository } from "@/lib/repositories/match.repository";
import { runMatchingForJob } from "@/lib/services/matching.service";

export const GET = createHandler(
  async ({ auth }) => {
    const filter =
      auth.role === UserRole.USER ? { status: "open" } : {};
    const jobs = await jobRepository.findAll(filter);

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => ({
        ...job,
        matchCount: await matchRepository.countByJob(String(job._id)),
      }))
    );

    return jsonOk({ jobs: jobsWithCounts });
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
    await runMatchingForJob(String(job._id));
    return jsonOk({ message: "Job created.", job }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: jobCreateSchema }
);
