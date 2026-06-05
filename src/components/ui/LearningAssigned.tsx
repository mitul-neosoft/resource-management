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

interface Assignment {
  _id: string;
  progress: number;
  status: string;
  courseId: { title: string; description?: string; duration?: string };
}

export default function LearningAssigned(): React.JSX.Element {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ assignments: Assignment[] }>(
        "/api/course-assignments"
      );
      setAssignments(data.assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateProgress = async (id: string, progress: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, progress } : a))
    );
    setSaving(true);
    try {
      await apiFetch(`/api/course-assignments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ progress }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      load();
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
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: T.text }}>
        L&D Assigned Learning
      </h3>
      {error && <p style={{ color: T.red, fontSize: 13 }}>{error}</p>}
      {loading ? (
        <p style={{ color: T.muted }}>Loading courses...</p>
      ) : assignments.length === 0 ? (
        <p style={{ color: T.muted }}>No courses assigned yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a) => {
            const title = a.courseId?.title || "Course";
            const completed = a.progress >= 100;
            return (
              <div
                key={a._id}
                style={{
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{title}</p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: completed ? T.green : T.amber,
                    }}
                  >
                    {a.status}
                  </span>
                </div>
                <p style={{ margin: "8px 0", fontSize: 12, color: T.muted }}>
                  {a.courseId?.description}
                </p>
                <input
                  type="range"
                  className="cursor-pointer"
                  min={0}
                  max={100}
                  value={a.progress}
                  disabled={saving}
                  onChange={(e) => updateProgress(a._id, Number(e.target.value))}
                  style={{ width: "100%", accentColor: T.red }}
                />
                <p style={{ textAlign: "right", fontSize: 13, fontWeight: 700 }}>
                  {a.progress}%
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
