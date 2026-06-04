"use client";

import React from "react";

const T = {
  red: "#F12B20",
  redLight: "#FFF3F2",
  border: "#E5E7EB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
};

const data = [
  {
    name: "React Advanced Patterns",
    platform: "Udemy",
    duration: "8 Hours",
    reason: "Based on your React skills and frontend role.",
  },
  {
    name: "System Design Basics",
    platform: "Coursera",
    duration: "12 Hours",
    reason: "Important for senior developer growth.",
  },
  {
    name: "AWS Cloud Fundamentals",
    platform: "AWS",
    duration: "10 Hours",
    reason: "Cloud skills are trending in your domain.",
  },
];

export default function RecommendedForYou() {
  return (
    <div>
      {/* TITLE */}
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>
          Recommended for You
        </h3>

        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.muted }}>
          Based on your skills and job market trends
        </p>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            {/* CHIP */}
            <span
              style={{
                background: T.redLight,
                color: T.red,
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {item.platform}
            </span>

            {/* NAME */}
            <h4
              style={{
                color: T.text,
                fontSize: 14,
                fontWeight: 700,
                margin: "10px 0 4px",
              }}
            >
              {item.name}
            </h4>

            {/* DURATION */}
            <p style={{ color: T.muted, fontSize: 12, margin: "0 0 6px" }}>
              ⏱ {item.duration}
            </p>

            {/* REASON */}
            <p
              style={{
                color: T.muted,
                fontSize: 12,
                margin: "0 0 14px",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {item.reason}
            </p>

            {/* BUTTON */}
            <button
              style={{
                width: "100%",
                background: T.red,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Enroll Free
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
