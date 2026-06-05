"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { apiFetch } from "@/lib/api/client";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: any[];
  experienceRequired: string;
  openings: number;
  status: string;
  priority?: string;
  duration?: string;
  type?: string;
  matchedCandidateId?: string;
  createdAt: string;
}

interface Match {
  candidate: { _id: string; name: string; role?: string; benchDays: number };
  score: number;
  matchedSkills: string[];
}

export default function RmJobsPage() {
  const { data, loading, error, reload } = useApi<{ jobs: Job[] }>("/api/jobs");
  const jobs = data?.jobs ?? [];

  const [showModal, setShowModal] = useState(false);
  const [showMatch, setShowMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    experienceRequired: "3+ yrs",
    openings: 1,
    priority: "Medium",
    duration: "6 months",
    type: "Full-time",
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
    setForm({
      title: "",
      company: "",
      location: "",
      description: "",
      skills: "",
      experienceRequired: "3+ yrs",
      openings: 1,
      priority: "Medium",
      duration: "6 months",
      type: "Full-time",
    });
    reload();
  };

  const loadMatches = async (jobId: string) => {
    const res = await apiFetch<{ matches: Match[] }>(
      `/api/jobs/${jobId}/matches`,
    );
    setMatches(res.matches);
    setShowMatch(jobId);
  };

  const allocate = async (candidateId: string, jobId: string) => {
    await apiFetch("/api/allocations", {
      method: "POST",
      body: JSON.stringify({ candidateId, jobId }),
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
  const matchedCount = jobs.filter((j) => j.matchedCandidateId).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          + Post New Job
        </button>
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
          { label: "Matched", val: matchedCount, icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4">
            <div className="text-2xl">{s.icon}</div>
            <p className="text-2xl font-bold">{s.val ? s.val : 0}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                    {job.priority} Priority
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    {job.status}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {job.openings} slots
                  </span>
                </div>
                <p className="text-sm text-red-600">{job.company}</p>
                <p className="text-sm text-gray-500">
                  {job.location} · {job.duration} · {job.type}
                </p>
                <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(job) &&
                    job?.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                      >
                        {s}
                      </span>
                    ))}
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {job.experienceRequired}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => loadMatches(job._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Show Matches
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
                {job.matchedCandidateId && (
                  <span className="text-xs font-semibold text-teal-600">
                    ✓ Candidate Matched
                  </span>
                )}
              </div>
            </div>

            {showMatch === job._id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="mb-2 font-semibold">
                  Matches ({matches.length})
                </h4>
                {matches.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No matching candidates.
                  </p>
                ) : (
                  matches.map((m) => (
                    <div
                      key={m.candidate._id}
                      className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-medium">{m.candidate.name}</p>
                        <p className="text-xs text-gray-500">
                          Score: {m.score}% · Skills:{" "}
                          {m.matchedSkills.join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => allocate(m.candidate._id, job._id)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
                      >
                        Allocate
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Post New Job</h2>
            <div className="space-y-3">
              {[
                ["title", "Title"],
                ["company", "Company"],
                ["location", "Location"],
                ["description", "Description"],
                ["skills", "Skills (comma-separated)"],
                ["experienceRequired", "Experience Required"],
                ["duration", "Duration"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={form[key as keyof typeof form] as string}
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
