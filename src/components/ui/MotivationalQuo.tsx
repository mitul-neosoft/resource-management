"use client";

import { ReactNode, useEffect, useState } from "react";

const T = {
  red: "#F12B20",
  redLight: "#FFF3F2",
  border: "#E5E7EB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
};

interface Quote {
  q: string;
  a: string;
}

interface ChipProps {
  children: ReactNode;
}

interface CardProps {
  children: ReactNode;
}

const Chip = ({ children }: ChipProps): React.JSX.Element => (
  <span
    style={{
      background: T.redLight,
      color: T.red,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const Card = ({ children }: CardProps): React.JSX.Element => (
  <div
    style={{
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
    }}
  >
    {children}
  </div>
);

export default function MotivationCard(): React.JSX.Element {
  const [quote, setQuote] = useState<Quote>({
    q: "Loading inspiration...",
    a: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuote = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await fetch("https://api.quotable.io/random");

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data: {
        content: string;
        author: string;
      } = await response.json();

      setQuote({
        q: data.content,
        a: data.author,
      });
    } catch (error) {
      console.error(error);

      setQuote({
        q: "Keep going. Everything happens at the right time.",
        a: "Unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchQuote();
  }, []);

  return (
    <Card>
      {/* Top Chip */}
      <div style={{ marginBottom: 14 }}>
        <Chip>Daily Motivation</Chip>
      </div>

      {/* Quote */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            color: T.red,
            fontSize: 36,
            lineHeight: 1,
            marginRight: 8,
          }}
        >
          “
        </span>

        <p
          style={{
            color: T.text,
            fontSize: 14,
            fontStyle: "italic",
            lineHeight: 1.7,
            margin: 0,
            fontWeight: 500,
            opacity: loading ? 0.6 : 1,
            flex: 1,
          }}
        >
          {quote.q}
        </p>

        <span
          style={{
            color: T.red,
            fontSize: 36,
            lineHeight: 1,
            marginLeft: 8,
            alignSelf: "flex-end",
          }}
        >
          ”
        </span>
      </div>

      {/* Author */}
      <p
        style={{
          color: T.muted,
          fontSize: 12,
          margin: "12px 0 0",
          fontWeight: 600,
        }}
      >
        — {quote.a || "Unknown"}
      </p>
    </Card>
  );
}
