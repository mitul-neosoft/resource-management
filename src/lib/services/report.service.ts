import { userRepository } from "@/lib/repositories/user.repository";
import { jobRepository } from "@/lib/repositories/job.repository";
import { courseRepository } from "@/lib/repositories/course.repository";
import { matchRepository } from "@/lib/repositories/match.repository";
import Allocation from "@/lib/models/Allocation";
import Match from "@/lib/models/Match";
import { calculateBenchDays, calculateNoticeDaysLeft } from "@/lib/utils/bench";

export async function getReportsOverview() {
  const users = await userRepository.findBenchUsersEnriched();
  const jobs = await jobRepository.findAll();
  const assignments = await courseRepository.findAssignments();

  const benchDaysList = users
    .map((u) => u.benchDays)
    .filter((d): d is number => d !== null);

  const totalBench = users.length;
  const criticalBench = users.filter((u) => (u.benchDays ?? 0) >= 30).length;
  const averageBenchDays =
    benchDaysList.length > 0
      ? Math.round(
          benchDaysList.reduce((s, d) => s + d, 0) / benchDaysList.length
        )
      : 0;

  const openJobs = jobs.filter((j) => j.status === "open");
  const urgentJobs = openJobs.filter(
    (j) => j.priority === "High" || j.priority === "Critical"
  ).length;

  const allocationCount = await Allocation.countDocuments();
  const allocationRate =
    totalBench > 0 ? Math.round((allocationCount / totalBench) * 100) : 0;

  const totalMatches = await Match.countDocuments({ score: { $gt: 0 } });
  const matchRatio =
    openJobs.length > 0
      ? Math.round(totalMatches / openJobs.length)
      : 0;

  const completedAssignments = assignments.filter(
    (a) => a.progress >= 100 || a.status === "Completed"
  ).length;
  const courseCompletionRate =
    assignments.length > 0
      ? Math.round((completedAssignments / assignments.length) * 100)
      : 0;

  const avgLearning =
    assignments.length > 0
      ? Math.round(
          assignments.reduce((s, a) => s + a.progress, 0) / assignments.length
        )
      : 0;

  const benchAgeBreakdown = {
    fresh: users.filter((u) => (u.benchDays ?? 0) <= 7).length,
    moderate: users.filter(
      (u) => (u.benchDays ?? 0) > 7 && (u.benchDays ?? 0) <= 20
    ).length,
    highRisk: users.filter(
      (u) => (u.benchDays ?? 0) > 20 && (u.benchDays ?? 0) <= 30
    ).length,
    critical: users.filter((u) => (u.benchDays ?? 0) > 30).length,
  };

  const noticeRisk = users
    .filter((u) => u.resignDate && (u.noticeDaysLeft ?? 999) <= 15)
    .sort((a, b) => (a.noticeDaysLeft ?? 0) - (b.noticeDaysLeft ?? 0))
    .slice(0, 10)
    .map((u) => ({
      _id: u._id,
      name: u.name,
      role: u.designation || u.jd,
      benchDays: u.benchDays,
      noticePeriodDays: u.noticeDaysLeft,
    }));

  const noMatchCount = users.filter(
    (u) => !u.assignedJobId && u.status !== "Allocated"
  ).length;

  return {
    totalBench,
    criticalBench,
    averageBenchDays,
    totalJobs: jobs.length,
    openJobs: openJobs.length,
    urgentJobs,
    allocationRate,
    matchRatio,
    courseCompletionRate,
    learningProgress: avgLearning,
    benchAgeBreakdown,
    noticeRisk,
    candidatesWithNoMatch: noMatchCount,
  };
}
