"use client";

import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

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

interface Course {
  _id: string;
  title: string;
  description: string;
  progress: number;
  assignedBy: string;
  dueDate: string;
}

interface LearningItemProps {
  course: Course;
  onProgressChange: (id: string, progress: number) => void;
  saving: boolean;
}

function LearningItem({
  course,
  onProgressChange,
  saving,
}: LearningItemProps): React.JSX.Element {
  const completed = course.progress === 100;

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
        📚
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: T.text }}>
            {course.title}
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

        <p style={{ margin: "0 0 8px", fontSize: 12, color: T.muted }}>
          {course.description} · Due{" "}
          {new Date(course.dueDate).toLocaleDateString()} · {course.assignedBy}
        </p>

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
            {course.progress}%
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={course.progress}
          disabled={saving}
          onChange={(e) =>
            onProgressChange(course._id, Number(e.target.value))
          }
          style={{ width: "100%", accentColor: T.red }}
        />
      </div>
    </div>
  );
}

export default function LearningAssigned(): React.JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ courses: Course[] }>("/api/learning");
      setCourses(data.courses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const updateProgress = async (id: string, progress: number) => {
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? { ...c, progress } : c))
    );
    setSaving(true);
    try {
      await apiFetch(`/api/learning/${id}`, {
        method: "PUT",
        body: JSON.stringify({ progress }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update progress");
      await loadCourses();
    } finally {
      setSaving(false);
    }
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

      {error && (
        <p style={{ color: T.red, fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}

      {loading ? (
        <p style={{ color: T.muted }}>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p style={{ color: T.muted }}>No assigned courses yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {courses.map((course) => (
            <LearningItem
              key={course._id}
              course={course}
              onProgressChange={updateProgress}
              saving={saving}
            />
          ))}
        </div>
      )}
    </div>
  );
}
