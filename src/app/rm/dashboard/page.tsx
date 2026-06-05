"use client";

import Link from "next/link";
import { useApi } from "@/hooks/useApi";

interface RmDashboardData {
  overview: {
    totalBench: number;
    criticalBench: number;
    averageBenchDays: number;
    urgentJobs: number;
    openJobs: number;
    learningProgress: number;
  };
  allocations: Array<{
    _id: string;
    createdAt: string;
    candidateId: { firstName?: string; lastName?: string; name?: string };
    jobId: { title: string; company: string };
  }>;
  criticalCandidates: Array<{
    _id: string;
    name: string;
    designation?: string;
    jd?: string;
    location: string;
    benchDays: number | null;
    noticeDaysLeft: number | null;
  }>;
  urgentJobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    skills: string[];
    priority?: string;
  }>;
  recentUploads: Array<{
    _id: string;
    type: string;
    fileName: string;
    success: number;
    failed: number;
    total: number;
    createdAt: string;
  }>;
  rmUser?: { firstName: string; lastName: string };
}

export default function RmDashboardPage() {
  const { data, loading, error } = useApi<RmDashboardData>("/api/rm/dashboard");

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const { overview, criticalCandidates, urgentJobs, allocations, recentUploads, rmUser } =
    data;
  const greeting = rmUser
    ? `${rmUser.firstName} ${rmUser.lastName}`
    : "Resource Manager";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-red-600 p-6 text-white">
        <p className="text-xs uppercase tracking-wider opacity-80">
          Resource Manager Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Good Morning, {greeting}!
        </h1>
        <p className="mt-2 text-sm opacity-80">
          Here&apos;s your bench summary for today
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-lg bg-white/10 p-4 min-w-[100px]">
            <p className="text-2xl font-bold">{overview.totalBench}</p>
            <p className="text-xs uppercase">On Bench</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 min-w-[100px]">
            <p className="text-2xl font-bold">{overview.criticalBench}</p>
            <p className="text-xs uppercase">Critical</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 min-w-[100px]">
            <p className="text-2xl font-bold">{overview.averageBenchDays}d</p>
            <p className="text-xs uppercase">Avg Bench Age</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Bench", value: overview.totalBench, icon: "👥" },
          { label: "Critical Bench", value: overview.criticalBench, icon: "🚨" },
          { label: "Avg Bench Age", value: `${overview.averageBenchDays}d`, icon: "📅" },
          { label: "Open Jobs", value: overview.openJobs, icon: "💼" },
          { label: "Urgent Jobs", value: overview.urgentJobs, icon: "⚡" },
          { label: "L&D Progress", value: `${overview.learningProgress}%`, icon: "📚" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-xl">{s.icon}</div>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">🚨 Critical Bench Cases</h2>
          {criticalCandidates.length === 0 ? (
            <p className="text-sm text-gray-500">No critical cases.</p>
          ) : (
            criticalCandidates.map((c) => (
              <div
                key={c._id}
                className="mb-3 rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-500">
                      {c.designation || c.jd} · {c.location}
                    </p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="font-bold text-red-600">{c.benchDays ?? 0}d bench</p>
                    {c.noticeDaysLeft !== null && (
                      <p className="text-gray-500">{c.noticeDaysLeft}d notice</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <Link href="/rm/bench" className="text-sm font-semibold text-red-600">
            View all bench →
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">⚡ Urgent Job Openings</h2>
          {urgentJobs.map((job) => (
            <div key={job._id} className="mb-3 rounded-lg border p-4">
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.company} · {job.location}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills?.map((s) => (
                  <span key={s} className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <Link href="/rm/jobs" className="text-sm font-semibold text-red-600">
            Manage jobs →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Allocations</h2>
          {allocations.length === 0 ? (
            <p className="text-sm text-gray-500">No allocations yet.</p>
          ) : (
            <ul className="space-y-2">
              {allocations.map((a) => (
                <li key={a._id} className="flex flex-col gap-1 border-b py-2 text-sm sm:flex-row sm:justify-between">
                  <span>
                    <strong>
                      {a.candidateId?.firstName
                        ? `${a.candidateId.firstName} ${a.candidateId.lastName}`
                        : "Candidate"}
                    </strong>{" "}
                    → {a.jobId?.title}
                  </span>
                  <span className="text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Uploads</h2>
          {recentUploads.length === 0 ? (
            <p className="text-sm text-gray-500">
              No uploads yet. Use Bench or Jobs screen to upload Excel files.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentUploads.map((u) => (
                <li key={u._id} className="border-b py-2 text-sm">
                  <span className="font-medium capitalize">{u.type}</span> — {u.fileName}
                  <span className="ml-2 text-green-600">{u.success} ok</span>
                  {u.failed > 0 && (
                    <span className="ml-1 text-red-600">{u.failed} failed</span>
                  )}
                  <span className="block text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
