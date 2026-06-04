"use client";

import React, { useState } from "react";

const T = {
  red: "#F12B20",
  redLight: "#FFF3F2",
  green: "#10B981",
  amber: "#F59E0B",
  border: "#E5E7EB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
};

interface LearningItemProps {
  icon: string;
  title: string;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface ProgressPayload {
  LND_progress: number;
  project_progress: number;
}

function LearningItem({
  icon,
  title,
  progress,
  setProgress,
}: LearningItemProps): React.JSX.Element {
  const completed = progress === 100;

  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 16,
        display: "flex",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 10,
          background: T.redLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 14,
              color: T.text,
            }}
          >
            {title}
          </p>

          <span
            style={{
              background: completed ? "#ECFDF5" : "#FEF3C7",
              color: completed ? T.green : T.amber,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {completed ? "Completed" : "In Progress"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ color: T.muted, fontSize: 12 }}>Progress</span>

          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: completed ? T.green : T.red,
            }}
          >
            {progress}%
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProgress(Number(e.target.value))
          }
          style={{
            width: "100%",
            accentColor: T.red,
          }}
        />
      </div>
    </div>
  );
}

export default function LDCard(): React.JSX.Element {
  const [courseProgress, setCourseProgress] = useState<number>(70);
  const [projectProgress, setProjectProgress] = useState<number>(45);
  const [loading] = useState<boolean>(false);

  const handleSubmit = (): void => {
    const payload: ProgressPayload = {
      LND_progress: courseProgress,
      project_progress: projectProgress,
    };

    console.log("L&D Progress Payload:", payload);

    alert("Progress submitted successfully");
  };

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 20,
      }}
    >
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: 15,
          fontWeight: 700,
          color: T.text,
        }}
      >
        L&D Assigned Learning
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <LearningItem
          icon="📚"
          title="React Advanced Patterns"
          progress={courseProgress}
          setProgress={setCourseProgress}
        />

        <LearningItem
          icon="💻"
          title="Employee Bench Portal Project"
          progress={projectProgress}
          setProgress={setProjectProgress}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 16,
          width: "100%",
          background: T.red,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "12px",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : "Submit Progress"}
      </button>
    </div>
  );
}
