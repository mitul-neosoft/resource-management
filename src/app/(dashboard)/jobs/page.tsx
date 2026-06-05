"use client";

import { useEffect, useState } from "react";
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

function mapJob(job: ApiJob): Job {
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
    match: 70 + ((job.skills?.length || 0) % 25),
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

  const newJobs = jobs.filter((job) => job.isNew).length;

  return (
    <Box style={{ minHeight: "100vh", background: "#F9FAFB", padding: 24 }}>
      <Container size="xl">
        <Stack gap={4} mb={20}>
          <Title order={2}>Internal Job Marketplace</Title>
          <Text size="sm" c="dimmed">
            {jobs.length} openings · {newJobs} new today
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
            <JobFilters />
            <JobList jobs={jobs} onApply={handleApply} />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
