"use client";

import { Box, Container, Text, Title } from "@mantine/core";

export default function AssessmentPage() {
  return (
    <Box style={{ padding: 24 }}>
      <Container>
        <Title order={2}>Assessment</Title>
        <Text c="dimmed" mt="sm">
          Skill assessments and evaluation results will appear here.
        </Text>
      </Container>
    </Box>
  );
}
