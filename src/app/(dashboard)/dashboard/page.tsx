"use client";

import { Box, Container, Flex, Stack, Text, Title } from "@mantine/core";

import MotivationCard from "@/components/ui/MotivationalQuo";
import LDCard from "@/components/ui/LDevelopmenet";
import EmployeeWelcomeCard from "@/components/ui/EmployeeCard";
import SkillsCard from "@/components/ui/AddSkillsCard";

export default function Dashboard(): React.JSX.Element {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        padding: 24,
      }}
    >
      <Container size="lg">
        {/* Header */}
        <Stack gap={4} mb={20}>
          <Title order={2}>Employee Dashboard</Title>

          <Text size="sm" c="dimmed">
            Profile, motivation, skills & learning overview
          </Text>
        </Stack>

        {/* Content */}
        <Flex gap={25} align="flex-start" wrap="wrap">
          {/* Left */}
          <Stack
            gap={20}
            style={{
              flex: 1,
              minWidth: 320,
            }}
          >
            <EmployeeWelcomeCard />

            <LDCard />
          </Stack>

          {/* Right */}
          <Stack
            gap={20}
            style={{
              flex: 1,
              minWidth: 320,
            }}
          >
            <MotivationCard />

            <SkillsCard />
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
