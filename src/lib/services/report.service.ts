import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import { courseRepository } from "@/lib/repositories/course.repository";
import Allocation from "@/lib/models/Allocation";
import BenchCandidate from "@/lib/models/BenchCandidate";

export async function getReportsOverview() {
  const candidates = await benchCandidateRepository.findAll();
  const jobs = await jobRepository.findAll();
  const assignments = await courseRepository.findAssignments();

  const totalBench = candidates.length;
  const criticalBench = candidates.filter((c) => c.benchDays >= 30).length;
  const averageBenchDays =
    totalBench > 0
      ? Math.round(
          candidates.reduce((s, c) => s + c.benchDays, 0) / totalBench
        )
      : 0;

  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.status === "open");
  const urgentJobs = openJobs.filter(
    (j) => j.priority === "High" || j.priority === "Critical"
  ).length;

  const allocationCount = await Allocation.countDocuments();
  const allocationRate =
    totalBench > 0 ? Math.round((allocationCount / totalBench) * 100) : 0;

  const completedAssignments = assignments.filter(
    (a) => a.progress >= 100 || a.status === "Completed"
  ).length;
  const courseCompletionRate =
    assignments.length > 0
      ? Math.round((completedAssignments / assignments.length) * 100)
      : 0;

  const benchAgeBreakdown = {
    fresh: candidates.filter((c) => c.benchDays <= 7).length,
    moderate: candidates.filter((c) => c.benchDays > 7 && c.benchDays <= 20)
      .length,
    highRisk: candidates.filter((c) => c.benchDays > 20 && c.benchDays <= 30)
      .length,
    critical: candidates.filter((c) => c.benchDays > 30).length,
  };

  const noticeRisk = await BenchCandidate.find({
    noticePeriodDays: { $lte: 15 },
    status: { $ne: "Allocated" },
  })
    .sort({ noticePeriodDays: 1 })
    .limit(5)
    .lean();

  const noMatchCount = candidates.filter(
    (c) => !c.assignedJobId && c.status !== "Allocated"
  ).length;

  return {
    totalBench,
    criticalBench,
    averageBenchDays,
    totalJobs,
    openJobs: openJobs.length,
    urgentJobs,
    allocationRate,
    courseCompletionRate,
    benchAgeBreakdown,
    noticeRisk,
    candidatesWithNoMatch: noMatchCount,
  };
}
