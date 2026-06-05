import { Types } from "mongoose";
import Allocation from "@/lib/models/Allocation";
import { userRepository } from "@/lib/repositories/user.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import { normalizeEmployeeId } from "@/lib/utils/employeeId";

async function resolveBenchUserId(
  candidateId?: string,
  employeeId?: string
): Promise<string> {
  if (employeeId) {
    const user = await userRepository.findBenchUserByEmployeeId(employeeId);
    if (!user) {
      throw new Error(`Employee not found for ID: ${normalizeEmployeeId(employeeId)}`);
    }
    return String(user._id);
  }

  if (candidateId) {
    const user = await userRepository.findBenchUserById(candidateId);
    if (!user) throw new Error("Candidate not found");
    return candidateId;
  }

  throw new Error("candidateId or employeeId is required");
}

export async function allocateCandidateToJob(
  candidateId: string | undefined,
  jobId: string,
  allocatedBy: string,
  employeeId?: string
) {
  const userId = await resolveBenchUserId(candidateId, employeeId);
  const job = await jobRepository.findById(jobId);

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
    .populate(
      "candidateId",
      "firstName lastName email designation location employeeId"
    )
    .populate("jobId", "title company location")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
