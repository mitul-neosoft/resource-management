"use client";

import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Container,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = <K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K],
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
    const err: RegisterErrors = {};

    if (!form.name.trim()) {
      err.name = "Name is required";
    }

    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Enter valid email";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Min 6 characters required";
    }

    if (!form.confirmPassword) {
      err.confirmPassword = "Confirm password is required";
    } else if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      console.log("REGISTER API PAYLOAD:", payload);

      // const response = await fetch("/api/auth/register", {
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
      }}
    >
      <Box
        style={{
          width: "42%",
          minWidth: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <Container size={420} w="100%">
          <Stack gap={8} mb={32}>
            <Title fw={800}>Create Account</Title>
            <Text c="dimmed">Sign up to get started</Text>
          </Stack>

          <Paper radius="xl" p="xl" withBorder>
            <Stack>
              <TextInput
                label="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.currentTarget.value)}
                error={errors.name}
              />

              <TextInput
                label="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.currentTarget.value)}
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                value={form.password}
                onChange={(e) =>
                  handleChange("password", e.currentTarget.value)
                }
                error={errors.password}
              />

              <PasswordInput
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.currentTarget.value)
                }
                error={errors.confirmPassword}
              />

              <Button
                loading={loading}
                onClick={handleSubmit}
                radius="xl"
                style={{
                  background: "linear-gradient(255deg,#f12b20 0%,#eb0f5b 100%)",
                }}
              >
                Sign Up
              </Button>

              <Text ta="center" size="sm" c="dimmed">
                Already have an account?{" "}
                <Anchor href="/login" c="#eb0f5b">
                  Login
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
      {/* RIGHT SAME PLACEHOLDER */}
      <Stack align="center" maw={700}>
        <Box
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            borderRadius: 28,
            padding: 32,
            width: "100%",
          }}
        >
          <Image src="/images/emp1.png" h={420} fit="contain" />
        </Box>

        <Title c="white" ta="center">
          Join Us Today
        </Title>
      </Stack>
    </Box>
  );
}
