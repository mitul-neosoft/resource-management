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

interface ProgressBarProps {
  value: number;
  color: string;
}

interface CardProps {
  children: ReactNode;
}

interface SectionTitleProps {
  children: ReactNode;
}

interface Course {
  name: string;
  assigned: string;
  due: string;
  progress: number;
}

const ProgressBar = ({ value, color }: ProgressBarProps): React.JSX.Element => (
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

const Card = ({ children }: CardProps): React.JSX.Element => (
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

const SectionTitle = ({ children }: SectionTitleProps): React.JSX.Element => (
  <h3
    style={{
      margin: "0 0 16px",
      fontSize: 14,
      fontWeight: 700,
      color: T.text,
    }}
  >
    {children}
  </h3>
);

export default function LDCard(): React.JSX.Element {
  const course: Course = {
    name: "React Advanced Training",
    assigned: "HR Team",
    due: "12 Jun 2026",
    progress: 68,
  };

  if (!course) {
    return <></>;
  }

  const isGood = course.progress > 75;
  const barColor = isGood ? T.green : T.red;

  return (
    <Card>
      <SectionTitle>L&D Assigned Learning</SectionTitle>

      <div style={{ marginBottom: 18 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                color: T.text,
                fontSize: 13,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {course.name}
            </p>

            <p
              style={{
                color: T.muted,
                fontSize: 11,
                margin: "2px 0 0",
              }}
            >
              Due {course.due}
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
            {course.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar value={course.progress} color={barColor} />
      </div>
    </Card>
  );
}
