"use client";

import { useEffect, useState } from "react";
import { Box, Container, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { apiFetch } from "@/lib/api/client";

import MotivationCard from "@/components/ui/MotivationalQuo";
import LDCard from "@/components/ui/LDevelopmenet";
import EmployeeWelcomeCard from "@/components/ui/EmployeeCard";
import SkillsCard from "@/components/ui/AddSkillsCard";
import AppliedJobsCard from "@/components/ui/AppliedJobsCard";
import LearningAssigned from "@/components/ui/LearningAssigned";

interface DashboardResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    designation: string;
    resignDate?: string;
    clientContractEndDate?: string;
  };
  stats: {
    benchDays: number;
    noticeDaysLeft: number;
    totalSkills: number;
    learningProgress: number;
  };
}

export default function Dashboard(): React.JSX.Element {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DashboardResponse>("/api/dashboard")
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box style={{ minHeight: "100vh", background: "#F9FAFB", padding: 24 }}>
      <Container size="lg">
        <Stack gap={4} mb={20}>
          <Title order={2}>Employee Dashboard</Title>
          <Text size="sm" c="dimmed">
            Profile, motivation, skills & learning overview
          </Text>
        </Stack>

        {loading ? (
          <Flex justify="center" py={40}>
            <Loader color="red" />
          </Flex>
        ) : (
          <Flex gap={25} align="flex-start" wrap="wrap">
            <Stack gap={20} style={{ flex: 1, minWidth: 320 }}>
              <EmployeeWelcomeCard
                user={data?.user}
                stats={data?.stats}
                error={error}
              />
              <LDCard learningProgress={data?.stats.learningProgress} />
              <LearningAssigned />
            </Stack>

            <Stack gap={20} style={{ flex: 1, minWidth: 320 }}>
              <MotivationCard />
              <AppliedJobsCard />
              <SkillsCard />
            </Stack>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
