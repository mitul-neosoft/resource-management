"use client";

import { useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";
import ExcelUploadButton from "@/components/rm/ExcelUploadButton";

interface Candidate {
  _id: string;
  employeeId?: string;
  managerEmployeeId?: string;
  name: string;
  firstName: string;
  lastName: string;
  designation?: string;
  jd?: string;
  location: string;
  benchDays: number | null;
  noticeDaysLeft: number | null;
  resignDate?: string;
  status: string;
  skills: string[];
  email: string;
  experience?: string;
  clientContractEndDate?: string;
  isRegistered?: boolean;
}

export default function BenchPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [managerEmployeeId, setManagerEmployeeId] = useState("");

  const query = new URLSearchParams({ sort: "benchDays" });
  if (managerEmployeeId.trim()) {
    query.set("managerEmployeeId", managerEmployeeId.trim());
  }

  const { data, loading, error, reload } = useApi<{ candidates: Candidate[] }>(
    `/api/bench-candidates?${query.toString()}`,
  );

  const candidates = data?.candidates ?? [];

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.designation || c.jd || "").toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (filter === "critical")
      list = list.filter((c) => (c.benchDays ?? 0) >= 30);
    if (filter === "moderate")
      list = list.filter(
        (c) => (c.benchDays ?? 0) > 7 && (c.benchDays ?? 0) < 30,
      );
    if (filter === "fresh") list = list.filter((c) => (c.benchDays ?? 0) <= 7);
    return list;
  }, [candidates, search, filter]);

  const stats = {
    total: candidates.length,
    critical: candidates.filter((c) => (c.benchDays ?? 0) >= 30).length,
    moderate: candidates.filter(
      (c) => (c.benchDays ?? 0) > 7 && (c.benchDays ?? 0) < 30,
    ).length,
    fresh: candidates.filter((c) => (c.benchDays ?? 0) <= 7).length,
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
            · <span className="text-orange-600">{stats.moderate} Moderate</span>{" "}
            · <span className="text-green-600">{stats.fresh} Fresh</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/rm/upload/bench/template"
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Download Template
          </a>
          <ExcelUploadButton
            endpoint="/api/rm/upload/bench"
            label="Upload Bench Excel"
            onComplete={() => reload()}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name, role, skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border px-4 py-2"
        />
        <input
          type="text"
          placeholder="Filter by Manager Employee ID"
          value={managerEmployeeId}
          onChange={(e) => setManagerEmployeeId(e.target.value)}
          className="rounded-lg border px-3 py-2 sm:w-56"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All</option>
          <option value="critical">Critical (30d+)</option>
          <option value="moderate">Moderate (7-30d)</option>
          <option value="fresh">Fresh (0-7d)</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">
            No bench resources. Upload an Excel file to get started.
          </p>
        ) : (
          filtered.map((c) => {
            const benchColor =
              (c.benchDays ?? 0) >= 30
                ? "bg-red-50 text-red-600"
                : (c.benchDays ?? 0) > 7
                  ? "bg-orange-50 text-orange-600"
                  : "bg-green-50 text-green-600";
            return (
              <div
                key={c._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                      {c.firstName[0]}
                      {c.lastName[0]}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{c.name}</h3>
                        {c.employeeId && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                            {c.employeeId}
                          </span>
                        )}
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                          {c.status}
                        </span>
                        {c.isRegistered === false && (
                          <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                            Pending Registration
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {c.designation || c.jd} · {c.experience} · 📍{" "}
                        {c.location}
                        {c.managerEmployeeId
                          ? ` · Manager: ${c.managerEmployeeId}`
                          : ""}
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
                  <div className="flex flex-wrap gap-3">
                    <div
                      className={`min-w-[80px] rounded-lg p-3 text-center ${benchColor}`}
                    >
                      <p className="text-xl font-bold">{c.benchDays ?? "—"}</p>
                      <p className="text-xs opacity-80">Bench Days</p>
                    </div>
                    {c.resignDate && c.noticeDaysLeft !== null && (
                      <div className="min-w-[80px] rounded-lg bg-orange-50 p-3 text-center">
                        <p className="text-xl font-bold text-orange-600">
                          {c.noticeDaysLeft}
                        </p>
                        <p className="text-xs text-gray-500">Notice Left</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
