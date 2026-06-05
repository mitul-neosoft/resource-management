"use client";

import React from "react";
import { Box, Container, Flex, Stack, Text, Title } from "@mantine/core";

import LearningAssigned from "@/components/ui/LearningAssigned";
import RecLearningCard from "@/components/ui/RecLearningCard";

export default function LearningPage(): React.JSX.Element {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        padding: 24,
      }}
    >
      <Container size="lg">
        {/* HEADER */}
        <Stack gap={4} mb={20}>
          <Title order={2}>Learning Dashboard</Title>

          <Text size="sm" c="dimmed">
            Assigned courses, progress tracking & recommendations
          </Text>
        </Stack>

        {/* CONTENT */}
        <Flex gap={25} align="flex-start" wrap="wrap">
          {/* LEFT SIDE - ASSIGNED LEARNING */}
          <Stack
            gap={20}
            style={{
              flex: 1,
              minWidth: 320,
            }}
          >
            <LearningAssigned />
          </Stack>

          {/* RIGHT SIDE - RECOMMENDATIONS */}
          <Stack
            gap={20}
            style={{
              flex: 1,
              minWidth: 320,
            }}
          >
            <RecLearningCard />
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
