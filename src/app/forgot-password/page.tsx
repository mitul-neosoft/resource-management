"use client";

import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  PasswordInput,
} from "@mantine/core";
import { Image } from "@mantine/core";
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // STEP 1: SEND EMAIL
  const handleSendEmail = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      console.log("SEND RESET LINK:", { email });

      // simulate API success
      setTimeout(() => {
        setStep("reset");
        setLoading(false);
      }, 800);
    } catch (err) {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async () => {
    if (!code.trim()) return setError("Reset code is required");
    if (!password.trim()) return setError("Password is required");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);

    try {
      const payload = {
        email,
        code,
        password,
        confirmPassword,
      };

      console.log("RESET PASSWORD PAYLOAD:", payload);

      setTimeout(() => {
        alert("Password reset successful");
        setLoading(false);
      }, 800);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex" }}>
      {/* LEFT */}
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
                ? "Enter your email to receive reset link"
                : "Enter code & new password"}
            </Text>
          </Stack>

          <Paper radius="xl" p="xl" withBorder>
            <Stack>
              {/* STEP 1 */}
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

              {/* STEP 2 */}
              {step === "reset" && (
                <>
                  <Text size="sm" c="green" fw={600}>
                    Reset link sent to {email}
                  </Text>

                  <TextInput
                    label="Reset Code (from email)"
                    value={code}
                    onChange={(e) => setCode(e.currentTarget.value)}
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
      {/* Right Section */}
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

        <Text ta="center" c="rgba(255,255,255,0.85)" maw={500}>
          We'll send a secure password reset link to your registered email
          address.
        </Text>
      </Stack>
    </Box>
  );
}
