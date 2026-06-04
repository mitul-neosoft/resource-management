"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

const T = {
  red: "#F12B20",
  redLight: "#FFF3F2",
  border: "#E5E7EB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
};

interface Course {
  _id: string;
  title: string;
  description: string;
  progress: number;
  assignedBy: string;
}

export default function RecommendedForYou(): React.JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ courses: Course[] }>("/api/learning")
      .then((data) => {
        const recommended = data.courses.filter((c) => c.progress < 80);
        setCourses(recommended.slice(0, 3));
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>
          Recommended for You
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.muted }}>
          Courses with room to grow
        </p>
      </div>

      {loading ? (
        <p style={{ color: T.muted }}>Loading recommendations...</p>
      ) : courses.length === 0 ? (
        <p style={{ color: T.muted }}>No recommendations right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {courses.map((item) => (
            <div
              key={item._id}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
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
                {item.assignedBy}
              </span>
              <h4
                style={{
                  color: T.text,
                  fontSize: 14,
                  fontWeight: 700,
                  margin: "10px 0 4px",
                }}
              >
                {item.title}
              </h4>
              <p style={{ color: T.muted, fontSize: 12, margin: "0 0 6px" }}>
                Progress: {item.progress}%
              </p>
              <p
                style={{
                  color: T.muted,
                  fontSize: 12,
                  margin: "0 0 14px",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
