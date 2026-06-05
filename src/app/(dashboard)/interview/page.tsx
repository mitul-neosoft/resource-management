// "use client";

// import { Box, Container, Text, Title } from "@mantine/core";

// export default function InterviewPage() {
//   return (
//     <Box style={{ padding: 24 }}>
//       <Container>
//         <Title order={2}>Interview</Title>
//         <Text c="dimmed" mt="sm">
//           Interview scheduling and feedback will appear here when assigned by your
//           resource manager.
//         </Text>
//       </Container>
//     </Box>
//   );
// }


"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Flex,
  Badge,
  Button,
  TextInput,
  Modal,
  ScrollArea,
  Divider,
  UnstyledButton,
  Collapse,
  Group,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IV_DATA,
  QB,
  SUBTOPICS,
  type Interview,
  type Question,
  type TechKey,
} from "./data/interviewData";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ iv }: { iv: Interview }) {
  if (iv.status === "upcoming") {
    return (
      <Badge variant="light" color="blue" radius="xl" size="sm">
        Upcoming
      </Badge>
    );
  }
  if (iv.result === "passed") {
    return (
      <Badge variant="light" color="green" radius="xl" size="sm">
        ✓ Passed
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="red" radius="xl" size="sm">
      ✗ Rejected
    </Badge>
  );
}

function RoundBadge({ round }: { round: string }) {
  return (
    <Badge variant="light" color="violet" radius="xl" size="sm">
      {round}
    </Badge>
  );
}

interface InterviewCardProps {
  iv: Interview;
  onDetails: (iv: Interview) => void;
  onQuestions: (iv: Interview) => void;
}

function InterviewCard({ iv, onDetails, onQuestions }: InterviewCardProps) {
  const borderColor =
    iv.status === "upcoming"
      ? "#1565C0"
      : iv.result === "passed"
        ? "#2E7D32"
        : "#C62828";

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        borderTop: `1px solid #E5E7EB`,
        borderRight: `1px solid #E5E7EB`,
        borderBottom: `1px solid #E5E7EB`,
        backgroundColor: "#fff",
      }}
    >
      <Flex align="center" gap="md" wrap="wrap">
        {/* Left: info */}
        <Box style={{ flex: 1, minWidth: 200 }}>
          <Group gap={8} mb={4} wrap="wrap">
            <Text fw={800} size="sm" c="dark">
              {iv.role}
            </Text>
            <StatusBadge iv={iv} />
            <RoundBadge round={iv.round} />
          </Group>
          <Text size="xs" c="dimmed">
            {iv.company} · {iv.interviewer} · 📅 {iv.date}
          </Text>
        </Box>

        {/* Score (completed only) */}
        {iv.score !== null && (
          <Box ta="center" mr={4}>
            <Text
              fw={800}
              size="xl"
              c={iv.result === "passed" ? "green" : "red"}
              lh={1}
            >
              {iv.score}
            </Text>
            <Text size="xs" c="dimmed">
              / 5.0
            </Text>
          </Box>
        )}

        {/* Actions */}
        <Group gap={8} wrap="nowrap">
          <Button
            size="xs"
            variant="outline"
            color="red"
            radius="md"
            onClick={() => onDetails(iv)}
          >
            Details
          </Button>
          <Button
            size="xs"
            variant="filled"
            color="red"
            radius="md"
            onClick={() => onQuestions(iv)}
          >
            Interview Questions
          </Button>
        </Group>
      </Flex>
    </Paper>
  );
}

interface DetailModalProps {
  iv: Interview | null;
  opened: boolean;
  onClose: () => void;
}

function DetailModal({ iv, opened, onClose }: DetailModalProps) {
  if (!iv) return null;

  const fields: [string, string][] = [
    ["Role", iv.role],
    ["Company", iv.company],
    ["Date & Time", iv.date],
    ["Round", iv.round],
    ["Interviewer", iv.interviewer],
    [
      "Status",
      iv.status === "upcoming"
        ? "Upcoming"
        : iv.result === "passed"
          ? "✓ Passed"
          : "✗ Rejected",
    ],
    ["Score", iv.score ? `${iv.score} / 5.0` : "—"],
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={800} size="lg">
          Interview Details
        </Text>
      }
      centered
      withinPortal
      zIndex={1100}
      radius="md"
      size="md"
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
    >
      <Stack gap={10}>
        {fields.map(([k, v]) => (
          <Flex key={k} gap={12} align="flex-start">
            <Text size="sm" c="dimmed" fw={600} w={110} style={{ flexShrink: 0 }}>
              {k}
            </Text>
            <Text size="sm" fw={500} c="dark">
              {v}
            </Text>
          </Flex>
        ))}

        {iv.feedback && (
          <>
            <Divider my={4} />
            <Box
              p="sm"
              style={{
                background: "#F9FAFB",
                borderRadius: 8,
                borderLeft: "3px solid #e43e38",
              }}
            >
              <Text
                size="sm"
                fw={700}
                tt="uppercase"
                c="dimmed"
                mb={4}
                style={{ letterSpacing: "0.07em" }}
              >
                Interviewer Feedback
              </Text>
              <Text size="sm" c="dark" lh={1.7}>
                {iv.feedback}
              </Text>
            </Box>
          </>
        )}

        <Button
          fullWidth
          variant="outline"
          color="red"
          radius="md"
          mt={8}
          onClick={onClose}
        >
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

interface QPrepModalProps {
  iv: Interview | null;
  opened: boolean;
  onClose: () => void;
}

function QPrepModal({ iv, opened, onClose }: QPrepModalProps) {
  if (!iv) return null;
  const allQs = iv.tech in QB ? Object.values(QB[iv.tech]).flat() : [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Box>
          <Text fw={800} size="md">
            Prep Questions: {iv.role}
          </Text>
          <Text size="xs" c="dimmed">
            {iv.tech} stack · {iv.company}
          </Text>
        </Box>
      }
      centered
      withinPortal
      zIndex={1100}
      radius="md"
      size="lg"
      scrollAreaComponent={ScrollArea.Autosize}
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
    >
      <Stack gap={8}>
        {allQs.map((item, i) => (
          <Paper key={i} withBorder radius="md" p="sm">
            <Text size="sm" fw={700} c="dark" mb={4}>
              Q{i + 1}. {item.q}
            </Text>
            <Text size="xs" c="dimmed" lh={1.6}>
              <Text component="span" fw={700} c="dimmed">
                Hint:{" "}
              </Text>
              {item.hint}
            </Text>
          </Paper>
        ))}
        <Button
          fullWidth
          variant="outline"
          color="red"
          radius="md"
          mt={4}
          onClick={onClose}
        >
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

interface QuestionRowProps {
  item: Question;
  index: number;
}

function QuestionRow({ item, index }: QuestionRowProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 9,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <UnstyledButton
        onClick={toggle}
        style={{ width: "100%", padding: "13px 16px" }}
      >
        <Flex gap={12} align="flex-start">
          <Box
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "#FFEBEE",
              color: "#e43e38",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            Q{index + 1}
          </Box>
          <Text size="sm" fw={600} c="dark" style={{ flex: 1, lineHeight: 1.5 }}>
            {item.q}
          </Text>
          <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
            {opened ? "▴" : "▾"}
          </Text>
        </Flex>
      </UnstyledButton>

      <Collapse expanded={opened}>
        <Box
          px={16}
          pb={14}
          pt={12}
          ml={38}
          style={{
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FAFAFA",
          }}
        >
          <Text
            size="sm"
            fw={700}
            tt="uppercase"
            c="dimmed"
            mb={4}
            style={{ letterSpacing: "0.07em" }}
          >
            Hint / Answer Pointer
          </Text>
          <Text size="sm" c="dark" lh={1.7}>
            {item.hint}
          </Text>
        </Box>
      </Collapse>

    </Box>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function InterviewManagement(): React.JSX.Element {
  const interviews = IV_DATA;

  // Modals
  const [detailIv, setDetailIv] = useState<Interview | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);

  const [prepIv, setPrepIv] = useState<Interview | null>(null);
  const [prepOpened, { open: openPrep, close: closePrep }] =
    useDisclosure(false);

  function handleDetails(iv: Interview) {
    setDetailIv(iv);
    openDetail();
  }
  function handleQuestions(iv: Interview) {
    setPrepIv(iv);
    openPrep();
  }

  // Question Bank state
  const techs = Object.keys(SUBTOPICS) as TechKey[];
  const [activeTech, setActiveTech] = useState<TechKey>("React");
  const [activeSub, setActiveSub] = useState("All");
  const [qSearch, setQSearch] = useState("");
  const [aiQLoading, setAiQLoading] = useState(false);
  const [aiQs, setAiQs] = useState<Question[]>([]);

  const subtopics = SUBTOPICS[activeTech] ?? ["All"];

  const baseQs =
    activeSub === "All"
      ? Object.values(QB[activeTech] ?? {}).flat()
      : (QB[activeTech]?.[activeSub] ?? []);

  const allQs = [...baseQs, ...aiQs];

  const filteredQs = qSearch.trim()
    ? allQs.filter(
        (q) =>
          q.q.toLowerCase().includes(qSearch.toLowerCase()) ||
          q.hint.toLowerCase().includes(qSearch.toLowerCase())
      )
    : allQs;

  async function generateAiQs() {
    setAiQLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate 3 advanced interview questions for ${activeTech}${activeSub !== "All" ? ` — ${activeSub}` : ""}. Return ONLY a JSON array: [{"q":"...","hint":"..."}]. No markdown, no extra text.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text: string = data.content?.[0]?.text ?? "[]";
      const parsed: Question[] = JSON.parse(
        text.replace(/```json|```/g, "").trim()
      );
      setAiQs(parsed);
    } catch {
      // silent fail — bank still shows static questions
    }
    setAiQLoading(false);
  }

  const upcoming = interviews.filter((iv) => iv.status === "upcoming");
  const history = interviews.filter((iv) => iv.status === "completed");

  return (
    <Box style={{ minHeight: "100vh", background: "#F9FAFB", padding: 24 }}>
      <Container size="lg">
        {/* Page header */}
        <Stack gap={4} mb={24}>
          <Title order={2}>Interview Management</Title>
          <Text size="sm" c="dimmed">
            Upcoming interviews, past history, and tech-stack question bank
          </Text>
        </Stack>

        <Stack gap={28}>
          {/* ── Upcoming Interviews ── */}
          <Box>
            <Box mb={14}>
              <Text
                fw={800}
                size="xs"
                tt="uppercase"
                style={{ letterSpacing: "0.07em", color: "#374151" }}
              >
                Upcoming Interviews
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {upcoming.length} scheduled
              </Text>
            </Box>
            <Stack gap={10}>
              {upcoming.length === 0 ? (
                <Paper withBorder radius="md" p="xl" ta="center">
                  <Text c="dimmed" size="sm">
                    No upcoming interviews scheduled.
                  </Text>
                </Paper>
              ) : (
                upcoming.map((iv) => (
                  <InterviewCard
                    key={iv.id}
                    iv={iv}
                    onDetails={handleDetails}
                    onQuestions={handleQuestions}
                  />
                ))
              )}
            </Stack>
          </Box>

          {/* ── Previous History ── */}
          <Box>
            <Box mb={14}>
              <Text
                fw={800}
                size="xs"
                tt="uppercase"
                style={{ letterSpacing: "0.07em", color: "#374151" }}
              >
                Previous Interview History
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {history.length} completed ·{" "}
                {history.filter((iv) => iv.result === "passed").length} passed ·{" "}
                {history.filter((iv) => iv.result === "rejected").length} rejected
              </Text>
            </Box>
            <Stack gap={10}>
              {history.map((iv) => (
                <InterviewCard
                  key={iv.id}
                  iv={iv}
                  onDetails={handleDetails}
                  onQuestions={handleQuestions}
                />
              ))}
            </Stack>
          </Box>

          {/* ── Question Bank ── */}
          <Paper withBorder radius="md" p="lg" style={{ backgroundColor: "#fff" }}>
            {/* Bank header */}
            <Flex justify="space-between" align="center" mb={16} wrap="wrap" gap={12}>
              <Box>
                <Text
                  fw={800}
                  size="xs"
                  tt="uppercase"
                  style={{ letterSpacing: "0.07em", color: "#374151" }}
                >
                  Interview Question Bank
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  Filter by tech stack and subtopic
                </Text>
              </Box>
              <TextInput
                placeholder="🔍  Search questions..."
                value={qSearch}
                onChange={(e) => setQSearch(e.currentTarget.value)}
                size="sm"
                radius="md"
                w={240}
                styles={{
                  input: {
                    borderColor: "#E5E7EB",
                    "&:focus": { borderColor: "#e43e38" },
                  },
                }}
              />
            </Flex>

            {/* Tech tabs */}
            <Flex gap={6} mb={10} wrap="wrap">
              {techs.map((t) => (
                <Button
                  key={t}
                  size="xs"
                  radius="xl"
                  variant={activeTech === t ? "filled" : "outline"}
                  color="red"
                  onClick={() => {
                    setActiveTech(t);
                    setActiveSub("All");
                    setAiQs([]);
                  }}
                  styles={
                    activeTech !== t
                      ? { root: { borderColor: "#E5E7EB", color: "#6B7280" } }
                      : {}
                  }
                >
                  {t}
                </Button>
              ))}
            </Flex>

            {/* Subtopic chips + AI button */}
            <Flex gap={6} mb={20} wrap="wrap" align="center">
              {subtopics.map((st) => (
                <Button
                  key={st}
                  size="xs"
                  radius="xl"
                  variant={activeSub === st ? "light" : "subtle"}
                  color={activeSub === st ? "red" : "gray"}
                  onClick={() => {
                    setActiveSub(st);
                    setAiQs([]);
                  }}
                  styles={
                    activeSub === st
                      ? { root: { fontWeight: 700 } }
                      : { root: { color: "#6B7280" } }
                  }
                >
                  {st}
                </Button>
              ))}

              <Button
                size="xs"
                radius="xl"
                variant="light"
                color="violet"
                loading={aiQLoading}
                onClick={generateAiQs}
                ml="auto"
              >
                ✨ AI Generate
              </Button>
            </Flex>

            <Divider mb={16} />

            {/* Question list */}
            <Stack gap={8}>
              {filteredQs.length === 0 ? (
                <Box ta="center" py={32}>
                  <Text c="dimmed" size="sm">
                    No questions found. Try a different filter or click{" "}
                    <Text component="span" c="violet" fw={700}>
                      ✨ AI Generate
                    </Text>
                    .
                  </Text>
                </Box>
              ) : (
                filteredQs.map((item, i) => (
                  <QuestionRow key={`${activeTech}-${activeSub}-${i}`} item={item} index={i} />
                ))
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Modals */}
      <DetailModal
        iv={detailIv}
        opened={detailOpened}
        onClose={() => {
          closeDetail();
          setDetailIv(null);
        }}
      />
      <QPrepModal
        iv={prepIv}
        opened={prepOpened}
        onClose={() => {
          closePrep();
          setPrepIv(null);
        }}
      />
    </Box>
  );
}