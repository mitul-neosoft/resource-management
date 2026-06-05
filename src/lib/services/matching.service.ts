import { Types } from "mongoose";
import { jobRepository } from "@/lib/repositories/job.repository";
import { userRepository } from "@/lib/repositories/user.repository";
import { matchRepository } from "@/lib/repositories/match.repository";
import { computeSkillMatch } from "@/lib/utils/skillsParser";
import { calculateBenchDays } from "@/lib/utils/bench";
import { calculateNoticeDaysLeft } from "@/lib/utils/bench";

export async function runMatchingForJob(jobId: string) {
  const job = await jobRepository.findById(jobId);
  if (!job) return [];

  await matchRepository.deleteByJob(jobId);

  const users = await userRepository.findBenchUsers({
    status: { $ne: "Allocated" },
    assignedJobId: null,
  });

  const jobSkills = job.skills || [];
  const results = [];

  for (const user of users) {
    const { score, matchedSkills, missingSkills } = computeSkillMatch(
      user.skills || [],
      jobSkills
    );

    if (score > 0) {
      const match = await matchRepository.upsertMatch({
        jobId,
        userId: String(user._id),
        score,
        matchedSkills,
        missingSkills,
      });
      results.push(match);
    }
  }

  return results.sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0));
}

export async function runMatchingForAllJobs() {
  const jobs = await jobRepository.findAll({ status: "open" });
  for (const job of jobs) {
    await runMatchingForJob(String(job._id));
  }
}

export async function getJobMatches(jobId: string) {
  const job = await jobRepository.findById(jobId);
  if (!job) return null;

  let matches = await matchRepository.findByJob(jobId);

  if (matches.length === 0 && job.skills?.length) {
    await runMatchingForJob(jobId);
    matches = await matchRepository.findByJob(jobId);
  }

  const enriched = matches.map((m) => {
    const user = m.userId as unknown as {
      _id: string;
      firstName: string;
      lastName: string;
      location?: string;
      experience?: string;
      skills?: string[];
      clientContractEndDate?: Date;
      resignDate?: Date;
      noticePeriodDays?: number;
    };

    return {
      _id: m._id,
      score: m.score,
      matchedSkills: m.matchedSkills,
      missingSkills: m.missingSkills,
      candidate: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        location: user.location,
        experience: user.experience,
        skills: user.skills,
        benchDays: calculateBenchDays(user.clientContractEndDate),
        noticeDaysLeft: calculateNoticeDaysLeft(
          user.resignDate,
          user.noticePeriodDays ?? 90
        ),
      },
    };
  });

  return { job, matches: enriched };
}

export async function getUserJobMatches(userId: string) {
  return matchRepository.findForUser(userId);
}
