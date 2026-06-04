"use client";

import { Box, Container, Stack, Text, Title } from "@mantine/core";

import JobFilters from "@/components/job-marketplace/JobFilters";
import JobList from "@/components/job-marketplace/JobList";

import jobsData from "@/data/jobs.json";

export default function JobMarketplace(): React.JSX.Element {
  const totalJobs = jobsData.jobs.length;

  const newJobs = jobsData.jobs.filter((job) => job.isNew).length;

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        padding: 24,
      }}
    >
      <Container size="xl">
        <Stack gap={4} mb={20}>
          <Title order={2}>Internal Job Marketplace</Title>

          <div className="flex items-center gap-3 mt-1">
            <Text size="sm" c="dimmed">
              {totalJobs} openings
            </Text>

            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
              {newJobs} New Today
            </span>
          </div>
        </Stack>

        <Stack gap={20}>
          <JobFilters />

          <JobList jobs={jobsData.jobs} />
        </Stack>
      </Container>
    </Box>
  );
}
