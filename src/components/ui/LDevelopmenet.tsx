"use client";

import { ReactNode } from "react";

const T = {
  text: "#111827",
  muted: "#6B7280",
  red: "#F12B20",
  green: "#10B981",
  border: "#E5E7EB",
  card: "#FFFFFF",
};

interface LDCardProps {
  learningProgress?: number;
}

export default function LDCard({ learningProgress = 0 }: LDCardProps): React.JSX.Element {
  const progress = learningProgress;
  const isGood = progress > 75;
  const barColor = isGood ? T.green : T.red;

  return (
    <Card>
      <SectionTitle>L&D Learning Overview</SectionTitle>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            gap: 12,
          }}
        >
          <div>
            <p style={{ color: T.text, fontSize: 13, fontWeight: 600, margin: 0 }}>
              Overall Learning Progress
            </p>
            <p style={{ color: T.muted, fontSize: 11, margin: "2px 0 0" }}>
              Aggregated from assigned courses
            </p>
          </div>
          <span
            style={{
              color: barColor,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} color={barColor} />
      </div>
    </Card>
  );
}

const ProgressBar = ({
  value,
  color,
}: {
  value: number;
  color: string;
}): React.JSX.Element => (
  <div
    style={{
      width: "100%",
      height: 6,
      background: "#F3F4F6",
      borderRadius: 999,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${value}%`,
        height: "100%",
        background: color,
        transition: "width 0.3s ease",
      }}
    />
  </div>
);

const Card = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <div
    style={{
      padding: 24,
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: T.text }}>
    {children}
  </h3>
);
