import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { jobApplicationSchema } from "@/lib/validations/schemas";
import JobApplication from "@/lib/models/JobApplication";
import { jobRepository } from "@/lib/repositories/job.repository";

export const GET = createHandler(
  async ({ auth }) => {
    const applications = await JobApplication.find({
      userId: auth.userId,
    })
      .populate("jobId")
      .sort({ createdAt: -1 })
      .lean();
    return jsonOk({ applications });
  },
  { roles: [UserRole.USER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const { jobId } = body as ReturnType<typeof jobApplicationSchema.parse>;
    const job = await jobRepository.findById(jobId);
    if (!job || job.status !== "open") {
      return jsonOk({ error: "Job not available" }, 400);
    }

    const existing = await JobApplication.findOne({
      userId: auth.userId,
      jobId,
    });
    if (existing) {
      return jsonOk({ error: "Already applied" }, 409);
    }

    const application = await JobApplication.create({
      userId: new Types.ObjectId(auth.userId),
      jobId: new Types.ObjectId(jobId),
      status: "applied",
    });

    return jsonOk({ message: "Application submitted.", application }, 201);
  },
  { roles: [UserRole.USER], schema: jobApplicationSchema }
);
