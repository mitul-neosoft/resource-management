import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { getReportsOverview } from "@/lib/services/report.service";
import { getRecentAllocations } from "@/lib/services/allocation.service";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import User from "@/lib/models/User";

export const GET = createHandler(
  async ({ auth }) => {
    const [overview, allocations, candidates, jobs, rmUser] =
      await Promise.all([
        getReportsOverview(),
        getRecentAllocations(5),
        benchCandidateRepository.findAll(),
        jobRepository.findAll({ status: "open" }),
        User.findById(auth.userId).select("firstName lastName"),
      ]);

    const criticalCandidates = candidates
      .filter((c) => c.benchDays >= 20)
      .slice(0, 5);

    const urgentJobs = jobs
      .filter((j) => j.priority === "High" || j.priority === "Critical")
      .slice(0, 5);

    return jsonOk({
      overview,
      allocations,
      criticalCandidates,
      urgentJobs,
      rmUser,
    });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
