"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

interface Course {
  _id: string;
  title: string;
  duration: string;
}

interface UserOption {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
}

interface Assignment {
  _id: string;
  progress: number;
  status: string;
  userId: { _id: string; firstName: string; lastName: string; designation?: string };
  courseId: { _id: string; title: string };
}

export default function LndPage() {
  const { data: coursesData, reload: reloadCourses } = useApi<{ courses: Course[] }>(
    "/api/courses"
  );
  const { data: assignmentsData, reload: reloadAssignments } = useApi<{
    assignments: Assignment[];
  }>("/api/course-assignments");
  const { data: usersData } = useApi<{ users: UserOption[] }>("/api/users");

  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
  });

  const courses = coursesData?.courses ?? [];
  const assignments = assignmentsData?.assignments ?? [];
  const users = usersData?.users ?? [];

  const overview = assignments.reduce<
    Record<string, { name: string; role: string; courses: number; total: number; assignmentId?: string }>
  >((acc, a) => {
    const uid = String(a.userId?._id || "unknown");
    const name = a.userId
      ? `${a.userId.firstName} ${a.userId.lastName}`
      : "Unknown";
    if (!acc[uid]) {
      acc[uid] = {
        name,
        role: a.userId?.designation || "Employee",
        courses: 0,
        total: 0,
        assignmentId: a._id,
      };
    }
    acc[uid].courses += 1;
    acc[uid].total += a.progress;
    acc[uid].assignmentId = a._id;
    return acc;
  }, {});

  const assignCourse = async () => {
    if (!userId || !courseId) {
      alert("Select candidate and course");
      return;
    }
    await apiFetch("/api/course-assignments", {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    });
    setUserId("");
    setCourseId("");
    reloadAssignments();
  };

  const createCourse = async () => {
    await apiFetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(courseForm),
    });
    setShowAddCourse(false);
    setCourseForm({ title: "", description: "", duration: "" });
    reloadCourses();
  };

  const nudge = async (assignmentId?: string) => {
    if (!assignmentId) return;
    await apiFetch("/api/nudge", {
      method: "POST",
      body: JSON.stringify({ courseAssignmentId: assignmentId }),
    });
    alert("Nudge sent!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">L&D Management</h1>
        <button
          type="button"
          onClick={() => setShowAddCourse(true)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          + Add Course
        </button>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-sm font-bold uppercase text-gray-500">Quick Assignment</h2>
        <p className="mb-4 text-sm text-gray-500">
          Quickly assign a course to a registered user
        </p>
        <div className="flex flex-wrap gap-3">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="min-w-[200px] rounded-lg border px-3 py-2"
          >
            <option value="">Select candidate...</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="min-w-[200px] rounded-lg border px-3 py-2"
          >
            <option value="">Select course...</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={assignCourse}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Assign →
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 overflow-x-auto">
        <h2 className="mb-4 font-semibold">Candidate Learning Overview</h2>
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Candidate</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Avg Progress</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(overview).map(([uid, row]) => {
              const avg = row.courses ? Math.round(row.total / row.courses) : 0;
              const status = avg >= 75 ? "On Track" : "In Progress";
              return (
                <tr key={uid} className="border-b">
                  <td className="py-3 font-medium">{row.name}</td>
                  <td>{row.role}</td>
                  <td>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                      {row.courses} courses
                    </span>
                  </td>
                  <td className={avg >= 75 ? "font-bold text-green-600" : "font-bold text-red-600"}>
                    {avg}%
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        status === "On Track"
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => nudge(row.assignmentId)}
                      className="rounded-lg border border-red-600 px-3 py-1 text-red-600"
                    >
                      Nudge
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {assignments.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">No assignments yet.</p>
        )}
      </div>

      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="mb-4 font-bold">Add Course</h2>
            {(["title", "description", "duration"] as const).map((f) => (
              <input
                key={f}
                placeholder={f}
                className="mb-2 w-full rounded-lg border px-3 py-2 capitalize"
                value={courseForm[f]}
                onChange={(e) =>
                  setCourseForm((c) => ({ ...c, [f]: e.target.value }))
                }
              />
            ))}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={createCourse}
                className="flex-1 rounded-lg bg-red-600 py-2 text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="flex-1 rounded-lg border py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
