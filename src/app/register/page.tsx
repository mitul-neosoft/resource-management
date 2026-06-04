"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { apiFetch } from "@/lib/api/client";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = <K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = (): boolean => {
    const err: RegisterErrors = {};
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
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
    setApiError("");

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });
      router.push("/login");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex", overflow: "hidden" }}>
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
              {apiError && (
                <Text c="red" size="sm">
                  {apiError}
                </Text>
              )}

              <TextInput
                label="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.currentTarget.value)}
                error={errors.firstName}
              />

              <TextInput
                label="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.currentTarget.value)}
                error={errors.lastName}
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

      <Stack align="center" maw={700}>
        <Box
          style={{
            background: "rgba(255,255,255,0.12)",
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
