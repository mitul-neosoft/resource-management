"use client";

import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = <K extends keyof LoginForm>(
    field: K,
    value: LoginForm[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      remember: form.remember,
    };

    try {
      console.log("LOGIN API PAYLOAD:", payload);

      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* LEFT PANEL */}
      <Box
        style={{
          width: "42%",
          minWidth: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "2rem",
          zIndex: 2,
        }}
      >
        <Container size={420} w="100%">
          <Stack gap={8} mb={32}>
            <Title order={1} fw={800}>
              Welcome Back
            </Title>

            <Text c="dimmed" size="md">
              Sign in to continue to your account
            </Text>
          </Stack>

          <Paper
            radius="xl"
            p="xl"
            shadow="xs"
            withBorder
            style={{ borderColor: "#f1f3f5" }}
          >
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="john@example.com"
                radius="md"
                size="md"
                value={form.email}
                onChange={(e) => handleChange("email", e.currentTarget.value)}
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                radius="md"
                size="md"
                value={form.password}
                onChange={(e) =>
                  handleChange("password", e.currentTarget.value)
                }
                error={errors.password}
              />

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  checked={form.remember}
                  onChange={(e) =>
                    handleChange("remember", e.currentTarget.checked)
                  }
                />

                <Anchor
                  href="/forgot-password"
                  c="#eb0f5b"
                  fw={600}
                  underline="never"
                >
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                size="md"
                radius="xl"
                h={48}
                mt={8}
                loading={loading}
                onClick={handleSubmit}
                style={{
                  background: "linear-gradient(255deg,#f12b20 0%,#eb0f5b 100%)",
                }}
              >
                Sign In
              </Button>

              <Text ta="center" size="sm" c="dimmed">
                Don't have an account?{" "}
                <Anchor href="/register" fw={600} c="#eb0f5b" underline="never">
                  Register
                </Anchor>
              </Text>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* CURVED DIVIDER (unchanged) */}
      <Box
        visibleFrom="md"
        style={{
          width: 160,
          height: "100vh",
          marginLeft: -1,
          position: "relative",
          zIndex: 5,
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 220 1000"
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <path
            d="M 0 0 C 180 120, 180 320, 70 500 C -40 680, -40 880, 180 1000 L 220 1000 L 220 0 Z"
            fill="#ffffff"
          />
          <path
            d="M 0 0 C 180 120, 180 320, 70 500 C -40 680, -40 880, 180 1000"
            fill="none"
            stroke="#f12b20"
            strokeWidth="5"
          />
        </svg>
      </Box>

      {/* RIGHT PANEL (unchanged) */}
      <Stack align="center" maw={700}>
        <Box
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 28,
            padding: 32,
            width: "100%",
          }}
        >
          <Image src="/images/emp1.png" alt="employee" h={420} fit="contain" />
        </Box>

        <Title order={2} c="white" ta="center" mt="lg" fw={800}>
          Empower Your Team
        </Title>

        <Text ta="center" size="lg" maw={500} c="rgba(255,255,255,0.85)">
          Collaborate, manage projects and streamline workflows with a modern
          platform built for ambitious teams.
        </Text>
      </Stack>
    </Box>
  );
}
