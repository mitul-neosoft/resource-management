"use client";

import { useApi } from "@/hooks/useApi";
import { Box, Container, Loader, Text, Title } from "@mantine/core";

interface Interview {
  _id: string;
  title: string;
  status: string;
  scheduledAt?: string;
  feedback?: string;
  interviewer?: string;
}

export default function InterviewPage() {
  const { data, loading, error } = useApi<{ interviews: Interview[] }>(
    "/api/interviews"
  );

  return (
    <Box style={{ padding: 24 }}>
      <Container>
        <Title order={2}>Interview</Title>
        <Text c="dimmed" mt="sm" mb="lg">
          Interview status and feedback from your resource manager
        </Text>

        {loading && <Loader color="red" />}
        {error && <Text c="red">{error}</Text>}

        {!loading && !error && (
          <div className="space-y-4">
            {(data?.interviews ?? []).length === 0 ? (
              <Text c="dimmed">No interviews scheduled yet.</Text>
            ) : (
              data?.interviews.map((i) => (
                <div
                  key={i._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <h3 className="font-semibold">{i.title}</h3>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {i.status}
                    </span>
                  </div>
                  {i.scheduledAt && (
                    <p className="mt-2 text-sm text-gray-500">
                      Scheduled: {new Date(i.scheduledAt).toLocaleString()}
                    </p>
                  )}
                  {i.interviewer && (
                    <p className="text-sm text-gray-500">
                      Interviewer: {i.interviewer}
                    </p>
                  )}
                  {i.feedback && (
                    <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm italic">
                      Feedback: {i.feedback}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </Container>
    </Box>
  );
}
