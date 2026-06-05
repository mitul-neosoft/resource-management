"use client";

import { useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

interface Candidate {
  _id: string;
  name: string;
  role?: string;
  location: string;
  benchDays: number;
  noticePeriodDays: number;
  status: string;
  skills: string[];
  email: string;
  experience?: string;
  availability?: string;
}

function benchSeverity(days: number) {
  if (days >= 30)
    return { label: "Critical", className: "text-red-600 bg-red-50" };
  if (days > 7)
    return { label: "Moderate", className: "text-orange-600 bg-orange-50" };
  return { label: "Fresh", className: "text-green-600 bg-green-50" };
}

export default function BenchPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data, loading, error, reload } = useApi<{ candidates: Candidate[] }>(
    `/api/bench-candidates?sort=benchDays`,
  );

  const candidates = data?.candidates ?? [];

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.role || "").toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (filter === "critical") list = list.filter((c) => c.benchDays >= 30);
    if (filter === "moderate")
      list = list.filter((c) => c.benchDays > 7 && c.benchDays < 30);
    if (filter === "fresh") list = list.filter((c) => c.benchDays <= 7);
    return list;
  }, [candidates, search, filter]);

  const stats = {
    total: candidates.length,
    critical: candidates.filter((c) => c.benchDays >= 30).length,
    moderate: candidates.filter((c) => c.benchDays > 7 && c.benchDays < 30)
      .length,
    fresh: candidates.filter((c) => c.benchDays <= 7).length,
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this candidate?")) return;
    await apiFetch(`/api/bench-candidates/${id}`, { method: "DELETE" });
    reload();
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bench Candidates</h1>
          <p className="text-sm text-gray-500">
            {stats.total} Total ·{" "}
            <span className="text-red-600">
              {stats.critical} Critical (30d+)
            </span>{" "}
            ·{" "}
            <span className="text-orange-600">
              {stats.moderate} Moderate (7-30d)
            </span>{" "}
            · <span className="text-green-600">{stats.fresh} Fresh (0-7d)</span>
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, role, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-4 py-2 lg:w-72 border-red-200 focus-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 border-red-200"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="moderate">Moderate</option>
            <option value="fresh">Fresh</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((c) => {
          const sev = benchSeverity(c.benchDays);
          const noticeColor =
            c.noticePeriodDays <= 15 ? "text-red-600" : "text-orange-600";
          return (
            <div
              key={c._id}
              className="rounded-xl border border-red-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sev.className}`}
                      >
                        {c.status === "Critical" ? "Critical" : c.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {c.role} · {c.experience ?? ""} ·{" "}
                      <i className="ri-map-pin-line"></i> {c.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="min-w-[80px] rounded-lg bg-red-50 p-3 text-center">
                    <p className="text-xl font-bold text-red-600">
                      {c.benchDays}
                    </p>
                    <p className="text-xs text-gray-500">Bench Days</p>
                  </div>
                  <div className="min-w-[80px] rounded-lg bg-orange-50 p-3 text-center">
                    <p className={`text-xl font-bold ${noticeColor}`}>
                      {c.noticePeriodDays}
                    </p>
                    <p className="text-xs text-gray-500">Notice Left</p>
                  </div>
                  <div className="min-w-[100px] flex items-center rounded-lg bg-purple-50 p-3 text-center text-sm font-semibold text-purple-700">
                    {c.availability || "Immediate"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(c._id)}
                    className="rounded-lg border h-[40px] px-3 py-2 text-xs text-white bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
