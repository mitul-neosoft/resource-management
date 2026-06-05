import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";
import { jobRepository } from "@/lib/repositories/job.repository";

function parseExperienceYears(exp: string): number {
  const match = exp.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseRequiredYears(exp: string): number {
  const match = exp.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export async function getJobMatches(jobId: string) {
  const job = await jobRepository.findById(jobId);
  if (!job) return null;

  const candidates = await benchCandidateRepository.findAll({
    status: { $ne: "Allocated" },
  });

  const requiredYears = parseRequiredYears(job.experienceRequired);
  const jobSkills = (job.skills || []).map((s) => s.toLowerCase());

  const matches = candidates
    .map((candidate) => {
      const candidateSkills = (candidate.skills || []).map((s) =>
        s.toLowerCase()
      );
      const matchedSkills = jobSkills.filter((js) =>
        candidateSkills.some(
          (cs) => cs.includes(js) || js.includes(cs)
        )
      );

      const skillScore =
        jobSkills.length > 0
          ? (matchedSkills.length / jobSkills.length) * 70
          : 0;

      const candidateYears = parseExperienceYears(
        String(candidate.experience)
      );
      const expScore =
        candidateYears >= requiredYears
          ? 30
          : Math.max(0, (candidateYears / Math.max(requiredYears, 1)) * 30);

      const score = Math.round(skillScore + expScore);

      return {
        candidate,
        score,
        matchedSkills,
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return { job, matches };
}
