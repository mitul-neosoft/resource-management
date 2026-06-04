"use client";

import { useEffect, useState } from "react";
import { Box, Container, Loader, Stack, Text, Title } from "@mantine/core";
import { apiFetch } from "@/lib/api/client";

import JobFilters from "@/components/job-marketplace/JobFilters";
import JobList, { type Job } from "@/components/job-marketplace/JobList";

interface ApiJob {
  _id: string;
  title: string;
  client: string;
  location: string;
  description: string;
  requiredSkills: string[];
  status: string;
  createdAt: string;
}

function mapJob(job: ApiJob): Job {
  const created = new Date(job.createdAt);
  const isNew = Date.now() - created.getTime() < 24 * 60 * 60 * 1000;

  return {
    id: job._id,
    title: job.title,
    company: job.client,
    description: job.description,
    skills: job.requiredSkills,
    experience: "3+ yrs",
    duration: "6 months",
    location: job.location,
    type: job.status === "open" ? "Full-time" : job.status,
    match: 70 + (job.requiredSkills.length % 25),
    isNew,
  };
}

export default function JobMarketplace(): React.JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ jobs: ApiJob[] }>("/api/jobs")
      .then((data) => setJobs(data.jobs.map(mapJob)))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  const newJobs = jobs.filter((job) => job.isNew).length;

  return (
    <Box style={{ minHeight: "100vh", background: "#F9FAFB", padding: 24 }}>
      <Container size="xl">
        <Stack gap={4} mb={20}>
          <Title order={2}>Internal Job Marketplace</Title>
          <div className="flex items-center gap-3 mt-1">
            <Text size="sm" c="dimmed">
              {jobs.length} openings
            </Text>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
              {newJobs} New Today
            </span>
          </div>
        </Stack>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader color="red" />
          </div>
        )}

        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}

        {!loading && !error && (
          <Stack gap={20}>
            <JobFilters />
            <JobList jobs={jobs} />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
