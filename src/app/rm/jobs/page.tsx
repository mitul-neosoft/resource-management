"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";
import ExcelUploadButton from "@/components/rm/ExcelUploadButton";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experienceRequired: string;
  openings: number;
  status: string;
  priority?: string;
  duration?: string;
  type?: string;
  matchedUserId?: string;
  matchCount?: number;
  createdAt: string;
}

interface MatchItem {
  _id: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  candidate: {
    _id: string;
    name: string;
    location?: string;
    experience?: string;
    benchDays: number | null;
    noticeDaysLeft: number | null;
  };
}

export default function RmJobsPage() {
  const { data, loading, error, reload } = useApi<{ jobs: Job[] }>("/api/jobs");
  const jobs = data?.jobs ?? [];

  const [showModal, setShowModal] = useState(false);
  const [showMatch, setShowMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    experienceRequired: "3+ yrs",
    openings: 1,
    priority: "Medium",
  });

  const saveJob = async () => {
    await apiFetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        openings: Number(form.openings),
      }),
    });
    setShowModal(false);
    reload();
  };

  const loadMatches = async (jobId: string) => {
    setMatchLoading(true);
    setShowMatch(jobId);
    try {
      const res = await apiFetch<{ matches: MatchItem[] }>(
        `/api/jobs/${jobId}/matches`,
      );
      setMatches(res.matches);
    } catch {
      setMatches([]);
    } finally {
      setMatchLoading(false);
    }
  };

  const allocate = async (userId: string, jobId: string) => {
    await apiFetch("/api/allocations", {
      method: "POST",
      body: JSON.stringify({ candidateId: userId, jobId }),
    });
    setShowMatch(null);
    reload();
  };

  const closeJob = async (id: string) => {
    await apiFetch(`/api/jobs/${id}/close`, { method: "POST" });
    reload();
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete job?")) return;
    await apiFetch(`/api/jobs/${id}`, { method: "DELETE" });
    reload();
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const openJobs = jobs.filter((j) => j.status === "open");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <div className="flex flex-wrap gap-2">
          <ExcelUploadButton
            endpoint="/api/rm/upload/jobs"
            label="Upload Jobs Excel"
            onComplete={() => reload()}
          />
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            + Post New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open Jobs", val: openJobs.length, icon: "📋" },
          {
            label: "Total Slots",
            val: openJobs.reduce((a, j) => a + j.openings, 0),
            icon: "🎯",
          },
          {
            label: "Critical/High",
            val: jobs.filter(
              (j) => j.priority === "Critical" || j.priority === "High",
            ).length,
            icon: "⚡",
          },
          {
            label: "Matched",
            val: jobs.filter((j) => j.matchedUserId).length,
            icon: "✅",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4">
            <div className="text-2xl">{s.icon}</div>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500">
            No jobs yet. Upload Excel or create a job.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                      {job.matchCount ?? 0} matched profiles
                    </span>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                      {job.priority} Priority
                    </span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-red-600">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    {job.location} · {job.experienceRequired}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {job.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(job) &&
                      job.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <button
                    type="button"
                    onClick={() => loadMatches(job._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Show Matches ({job.matchCount ?? 0})
                  </button>
                  {job.status === "open" && (
                    <button
                      type="button"
                      onClick={() => closeJob(job._id)}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Close Job
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteJob(job._id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {showMatch === job._id && (
                <div className="mt-4 border-t pt-4">
                  {matchLoading ? (
                    <p className="text-sm text-gray-500">Loading matches...</p>
                  ) : matches.length === 0 ? (
                    <p className="text-sm font-medium text-gray-600">
                      No profile matched for this requirement
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((m) => (
                        <div
                          key={m._id}
                          className="rounded-lg border bg-gray-50 p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold">
                                {m.candidate.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {m.candidate.location} ·{" "}
                                {m.candidate.experience} ·{" "}
                                {m.candidate.benchDays ?? 0}d bench
                                {m.candidate.noticeDaysLeft !== null &&
                                  ` · ${m.candidate.noticeDaysLeft}d notice`}
                              </p>
                              <p className="mt-2 text-sm">
                                <span className="font-bold text-green-700">
                                  {m.score}% match
                                </span>
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {m.matchedSkills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800"
                                  >
                                    ✓ {s}
                                  </span>
                                ))}
                                {m.missingSkills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800"
                                  >
                                    ✗ {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => allocate(m.candidate._id, job._id)}
                              className="shrink-0 rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
                            >
                              Allocate
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Post New Job</h2>
            <div className="space-y-3">
              {(
                [
                  ["title", "Title"],
                  ["company", "Company"],
                  ["location", "Location"],
                  ["description", "Description"],
                  ["skills", "Skills (comma-separated)"],
                  ["experienceRequired", "Experience Required"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveJob}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
