import { Types } from "mongoose";
import Allocation from "@/lib/models/Allocation";
import { userRepository } from "@/lib/repositories/user.repository";
import { jobRepository } from "@/lib/repositories/job.repository";

export async function allocateCandidateToJob(
  userId: string,
  jobId: string,
  allocatedBy: string
) {
  const user = await userRepository.findBenchUserById(userId);
  const job = await jobRepository.findById(jobId);

  if (!user) throw new Error("Candidate not found");
  if (!job) throw new Error("Job not found");
  if (job.status === "closed") throw new Error("Job is closed");

  await userRepository.update(userId, {
    assignedJobId: new Types.ObjectId(jobId),
    status: "Allocated",
  });

  await jobRepository.update(jobId, {
    matchedUserId: new Types.ObjectId(userId),
  });

  const allocation = await Allocation.create({
    candidateId: new Types.ObjectId(userId),
    jobId: new Types.ObjectId(jobId),
    allocatedBy: new Types.ObjectId(allocatedBy),
  });

  return allocation;
}

export async function getRecentAllocations(limit = 5) {
  return Allocation.find()
    .populate("candidateId", "firstName lastName email designation location")
    .populate("jobId", "title company location")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
