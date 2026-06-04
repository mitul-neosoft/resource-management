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
  Stack,
  Text,
  TextInput,
  Title,
  PasswordInput,
} from "@mantine/core";
import { apiFetch } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devTokenHint, setDevTokenHint] = useState("");

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<{ message: string; resetToken?: string }>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );
      if (data.resetToken) {
        setDevTokenHint(data.resetToken);
        setToken(data.resetToken);
      }
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token.trim()) return setError("Reset token is required");
    if (!password.trim()) return setError("Password is required");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    setError("");

    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex" }}>
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
            <Title fw={800}>Forgot Password</Title>
            <Text c="dimmed">
              {step === "email"
                ? "Enter your email to receive reset instructions"
                : "Enter reset token and new password"}
            </Text>
          </Stack>

          <Paper radius="xl" p="xl" withBorder>
            <Stack>
              {step === "email" && (
                <>
                  <TextInput
                    label="Email"
                    placeholder="john@example.com"
                    value={email}
                    error={error}
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                      setError("");
                    }}
                  />
                  <Button
                    loading={loading}
                    onClick={handleSendEmail}
                    radius="xl"
                    style={{
                      background:
                        "linear-gradient(255deg,#f12b20 0%,#eb0f5b 100%)",
                    }}
                  >
                    Send Reset Link
                  </Button>
                </>
              )}

              {step === "reset" && (
                <>
                  <Text size="sm" c="green" fw={600}>
                    Reset instructions sent for {email}
                  </Text>
                  {devTokenHint && (
                    <Text size="xs" c="dimmed">
                      Dev reset token: {devTokenHint}
                    </Text>
                  )}
                  <TextInput
                    label="Reset Token"
                    value={token}
                    onChange={(e) => setToken(e.currentTarget.value)}
                    error={error}
                  />
                  <PasswordInput
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  />
                  <Button
                    loading={loading}
                    onClick={handleResetPassword}
                    radius="xl"
                    style={{
                      background:
                        "linear-gradient(255deg,#f12b20 0%,#eb0f5b 100%)",
                    }}
                  >
                    Reset Password
                  </Button>
                </>
              )}

              <Text ta="center" size="sm" c="dimmed">
                Back to{" "}
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
          <Image src="/images/emp1.png" alt="Employee" h={420} fit="contain" />
        </Box>
        <Title c="white" ta="center">
          Recover Your Account
        </Title>
      </Stack>
    </Box>
  );
}
