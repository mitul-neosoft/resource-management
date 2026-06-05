import { Types } from "mongoose";
import Allocation from "@/lib/models/Allocation";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";
import { jobRepository } from "@/lib/repositories/job.repository";

export async function allocateCandidateToJob(
  candidateId: string,
  jobId: string,
  allocatedBy: string
) {
  const candidate = await benchCandidateRepository.findById(candidateId);
  const job = await jobRepository.findById(jobId);

  if (!candidate) throw new Error("Candidate not found");
  if (!job) throw new Error("Job not found");
  if (job.status === "closed") throw new Error("Job is closed");

  await benchCandidateRepository.update(candidateId, {
    assignedJobId: new Types.ObjectId(jobId),
    status: "Allocated",
  });

  await jobRepository.setMatched(jobId, candidateId);

  const allocation = await Allocation.create({
    candidateId: new Types.ObjectId(candidateId),
    jobId: new Types.ObjectId(jobId),
    allocatedBy: new Types.ObjectId(allocatedBy),
  });

  return allocation;
}

export async function getRecentAllocations(limit = 5) {
  return Allocation.find()
    .populate("candidateId", "name email role location")
    .populate("jobId", "title company location")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
