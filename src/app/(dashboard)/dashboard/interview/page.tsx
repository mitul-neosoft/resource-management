"use client";

import { Box, Container, Text, Title } from "@mantine/core";

export default function InterviewPage() {
  return (
    <Box style={{ padding: 24 }}>
      <Container>
        <Title order={2}>Interview</Title>
        <Text c="dimmed" mt="sm">
          Interview scheduling and feedback will appear here when assigned by your
          resource manager.
        </Text>
      </Container>
    </Box>
  );
}
