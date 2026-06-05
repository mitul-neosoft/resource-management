"use client";

import { useEffect, useState, useMemo } from "react";
import { Box, Container, Loader, Stack, Text, Title } from "@mantine/core";
import { apiFetch } from "@/lib/api/client";
import JobFilters from "@/components/job-marketplace/JobFilters";
import JobList, { type Job } from "@/components/job-marketplace/JobList";

interface ApiJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experienceRequired: string;
  status: string;
  duration?: string;
  type?: string;
  createdAt: string;
}

interface UserMatch {
  _id: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  jobId: ApiJob;
}

function mapJob(job: ApiJob, match?: UserMatch): Job & {
  missingSkills?: string[];
  matchedSkills?: string[];
  recommended?: boolean;
} {
  const created = new Date(job.createdAt);
  const isNew = Date.now() - created.getTime() < 24 * 60 * 60 * 1000;
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    description: job.description,
    skills: job.skills || [],
    experience: job.experienceRequired,
    duration: job.duration || "6 months",
    location: job.location,
    type: job.type || "Full-time",
    match: match?.score ?? 0,
    isNew,
    missingSkills: match?.missingSkills,
    matchedSkills: match?.matchedSkills,
    recommended: (match?.score ?? 0) >= 50,
  };
}

export default function JobMarketplace(): React.JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<{ jobs: ApiJob[] }>("/api/jobs"),
      apiFetch<{ matches: UserMatch[] }>("/api/jobs/matches"),
    ])
      .then(([jobsRes, matchesRes]) => {
        setMatches(matchesRes.matches);
        const matchMap = new Map(
          matchesRes.matches.map((m) => [String(m.jobId?._id), m])
        );
        setJobs(
          jobsRes.jobs.map((j) => mapJob(j, matchMap.get(j._id)))
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  const recommended = useMemo(
    () => jobs.filter((j) => (j as Job & { recommended?: boolean }).recommended),
    [jobs]
  );

  const handleApply = async (jobId: string | number) => {
    try {
      await apiFetch("/api/job-applications", {
        method: "POST",
        body: JSON.stringify({ jobId: String(jobId) }),
      });
      alert("Application submitted!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Apply failed");
    }
  };

  return (
    <Box style={{ minHeight: "100vh", background: "#F9FAFB", padding: 24 }}>
      <Container size="xl">
        <Stack gap={4} mb={20}>
          <Title order={2}>Internal Job Marketplace</Title>
          <Text size="sm" c="dimmed">
            {jobs.length} openings · {recommended.length} recommended for you
          </Text>
        </Stack>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader color="red" />
          </div>
        )}
        {error && <Text c="red">{error}</Text>}

        {!loading && !error && (
          <Stack gap={20}>
            {recommended.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-bold text-red-600">
                  ⭐ Recommended Jobs
                </h3>
                <JobList jobs={recommended} onApply={handleApply} showMatchDetails />
              </div>
            )}
            <JobFilters />
            <JobList jobs={jobs} onApply={handleApply} showMatchDetails />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
