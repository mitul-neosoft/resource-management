"use client";

import { useApi } from "@/hooks/useApi";
import { Box, Container, Loader, Text, Title } from "@mantine/core";

interface Assessment {
  _id: string;
  title: string;
  status: string;
  score?: number;
  dueDate?: string;
}

export default function AssessmentPage() {
  const { data, loading, error } = useApi<{ assessments: Assessment[] }>(
    "/api/assessments"
  );

  return (
    <Box style={{ padding: 24 }}>
      <Container>
        <Title order={2}>Assessment</Title>
        <Text c="dimmed" mt="sm" mb="lg">
          Skill assessments assigned by your resource manager
        </Text>

        {loading && <Loader color="red" />}
        {error && <Text c="red">{error}</Text>}

        {!loading && !error && (
          <div className="space-y-4">
            {(data?.assessments ?? []).length === 0 ? (
              <Text c="dimmed">No assessments assigned yet.</Text>
            ) : (
              data?.assessments.map((a) => (
                <div
                  key={a._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <h3 className="font-semibold">{a.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === "Completed"
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  {a.dueDate && (
                    <p className="mt-2 text-sm text-gray-500">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {a.score !== undefined && (
                    <p className="mt-2 text-lg font-bold text-red-600">
                      Score: {a.score}%
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
