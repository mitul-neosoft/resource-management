"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    designation?: string;
  };
  courseId: { _id: string; title: string };
}

interface OverviewRow {
  name: string;
  role: string;
  courses: number;
  total: number;
  assignmentId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarColor(name: string): string {
  const colors = [
    "#C62828",
    "#1565C0",
    "#2E7D32",
    "#6A1B9A",
    "#E65100",
    "#00695C",
    "#283593",
    "#AD1457",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length] ?? "#C62828";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressRing({ value }: { value: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 75 ? "#2E7D32" : value >= 40 ? "#E65100" : "#C62828";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={r} fill="none" stroke="#F3F4F6" strokeWidth={4} />
        <circle
          cx={22}
          cy={22}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <span
        className="absolute text-[10px] font-bold"
        style={{ color }}
      >
        {value}%
      </span>
    </div>
  );
}

function StatusPill({ avg }: { avg: number }) {
  if (avg >= 75) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-700 text-green-700 border border-green-200">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        On Track
      </span>
    );
  }
  if (avg >= 40) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-700 text-orange-700 border border-orange-200">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-700 text-red-700 border border-red-200">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Not Started
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
  const [courseForm, setCourseForm] = useState({ title: "", description: "", duration: "" });
  const [nudgedIds, setNudgedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const courses = coursesData?.courses ?? [];
  const assignments = assignmentsData?.assignments ?? [];
  const users = usersData?.users ?? [];

  const overview = assignments.reduce<Record<string, OverviewRow>>((acc, a) => {
    const uid = String(a.userId?._id ?? "unknown");
    const name = a.userId ? `${a.userId.firstName} ${a.userId.lastName}` : "Unknown";
    if (!acc[uid]) {
      acc[uid] = { name, role: a.userId?.designation ?? "Employee", courses: 0, total: 0, assignmentId: a._id };
    }
    acc[uid].courses += 1;
    acc[uid].total += a.progress;
    acc[uid].assignmentId = a._id;
    return acc;
  }, {});

  const filteredRows = Object.entries(overview).filter(([, row]) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * rowsPerPage;
  const pagedRows = filteredRows.slice(pageStart, pageStart + rowsPerPage);

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const assignCourse = async () => {
    if (!userId || !courseId) { alert("Select candidate and course"); return; }
    await apiFetch("/api/course-assignments", {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    });
    setUserId(""); setCourseId(""); reloadAssignments();
  };

  const createCourse = async () => {
    await apiFetch("/api/courses", { method: "POST", body: JSON.stringify(courseForm) });
    setShowAddCourse(false);
    setCourseForm({ title: "", description: "", duration: "" });
    reloadCourses();
  };

  const nudge = async (assignmentId?: string) => {
    if (!assignmentId) return;
    await apiFetch("/api/nudge", { method: "POST", body: JSON.stringify({ courseAssignmentId: assignmentId }) });
    setNudgedIds((prev) => new Set([...prev, assignmentId]));
  };

  // Summary stats
  const totalRows = Object.keys(overview).length;
  const onTrack = Object.values(overview).filter((r) => r.courses ? Math.round(r.total / r.courses) >= 75 : false).length;
  const avgOverall = totalRows
    ? Math.round(Object.values(overview).reduce((s, r) => s + (r.courses ? r.total / r.courses : 0), 0) / totalRows)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">L&D Management</h1>
          <p className="mt-1 text-sm text-gray-500">Assign courses, track learning progress and nudge employees</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddCourse(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
        >
          <span className="text-base">+</span> Add Course
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Enrolled", value: totalRows, sub: "employees", color: "#1565C0", bg: "#EFF6FF" },
          { label: "On Track", value: onTrack, sub: `of ${totalRows}`, color: "#2E7D32", bg: "#F0FDF4" },
          { label: "Avg Progress", value: `${avgOverall}%`, sub: "across all", color: "#C62828", bg: "#FFF5F5" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderTop: `3px solid ${s.color}` }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
            <p className="mt-2 text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Assignment ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Quick Assignment</p>
        <p className="mb-4 text-sm text-gray-500">Quickly assign a course to a registered employee</p>
        <div className="flex flex-wrap gap-3">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="min-w-[200px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Select candidate...</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
            ))}
          </select>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="min-w-[200px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Select course...</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={assignCourse}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            Assign →
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Table header bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-extrabold text-gray-900">Candidate Learning Overview</h2>
            <p className="mt-0.5 text-xs text-gray-400">{filteredRows.length} employees enrolled</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-lg border border-gray-200 pl-8 pr-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">

            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Role / Designation
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Courses
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Avg Progress
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                    {assignments.length === 0 ? "No assignments yet. Assign a course above to get started." : "No results match your search."}
                  </td>
                </tr>
              )}

              {pagedRows.map(([uid, row], idx) => {
                const avg = row.courses ? Math.round(row.total / row.courses) : 0;
                const initials = getInitials(row.name);
                const bgColor = avatarColor(row.name);
                const hasNudged = row.assignmentId ? nudgedIds.has(row.assignmentId) : false;

                return (
                  <tr
                    key={uid}
                    className="hover:bg-red-50/30 transition-colors"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm"
                          style={{ background: bgColor }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-700 text-gray-900">{row.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <span className="text-gray-600">{row.role}</span>
                    </td>

                    {/* Courses */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {row.courses} {row.courses === 1 ? "course" : "courses"}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <ProgressRing value={avg} />
                        <div className="hidden sm:block w-24">
                          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${avg}%`,
                                background: avg >= 75 ? "#2E7D32" : avg >= 40 ? "#E65100" : "#C62828",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <StatusPill avg={avg} />
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      {hasNudged ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-bold text-green-700">
                          ✓ Nudged
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => nudge(row.assignmentId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-150 cursor-pointer"
                        >
                          <span>🔔</span> Nudge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        {filteredRows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-6 py-3">

            {/* Left: count + rows-per-page */}
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-bold text-gray-700">
                  {pageStart + 1}–{Math.min(pageStart + rowsPerPage, filteredRows.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-700">{filteredRows.length}</span>{" "}
                employees
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: page controls */}
            <div className="flex items-center gap-1">
              {/* First */}
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
                title="First page"
              >
                «
              </button>

              {/* Prev */}
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
                title="Previous page"
              >
                ‹
              </button>

              {/* Page numbers */}
              {(() => {
                const window = 2;
                const pages: (number | "...")[] = [];

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (safePage - window > 2) pages.push("...");
                  for (
                    let i = Math.max(2, safePage - window);
                    i <= Math.min(totalPages - 1, safePage + window);
                    i++
                  ) {
                    pages.push(i);
                  }
                  if (safePage + window < totalPages - 1) pages.push("...");
                  pages.push(totalPages);
                }

                return pages.map((pg, i) =>
                  pg === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="flex h-8 w-8 items-center justify-center text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg as number)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
                        safePage === pg
                          ? "border-red-600 bg-red-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {pg}
                    </button>
                  )
                );
              })()}

              {/* Next */}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
                title="Next page"
              >
                ›
              </button>

              {/* Last */}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
                title="Last page"
              >
                »
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ── Add Course Modal ── */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4"
              style={{ borderTop: "4px solid #e43e38" }}>
              <div>
                <h2 className="font-extrabold text-gray-900">Add New Course</h2>
                <p className="mt-0.5 text-xs text-gray-400">Fill in the details to create a learning course</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {(
                [
                  { key: "title",       label: "Course Title",       placeholder: "e.g. React Advanced Patterns" },
                  { key: "description", label: "Description",        placeholder: "Brief overview of the course..." },
                  { key: "duration",    label: "Duration",           placeholder: "e.g. 8 hours, 4 weeks" },
                ] as const
              ).map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    {f.label}
                  </label>
                  {f.key === "description" ? (
                    <textarea
                      rows={3}
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                      value={courseForm[f.key]}
                      onChange={(e) => setCourseForm((c) => ({ ...c, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={courseForm[f.key]}
                      onChange={(e) => setCourseForm((c) => ({ ...c, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={createCourse}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Save Course
              </button>
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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