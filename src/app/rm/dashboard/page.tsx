"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useApi } from "@/hooks/useApi";

interface RmDashboardData {
  overview: {
    totalBench: number;
    criticalBench: number;
    averageBenchDays: number;
    urgentJobs: number;
    openJobs: number;
  };
  allocations: Array<{
    _id: string;
    createdAt: string;
    candidateId: { name: string; role?: string };
    jobId: { title: string; company: string };
  }>;
  criticalCandidates: Array<{
    _id: string;
    name: string;
    role?: string;
    location: string;
    benchDays: number;
    noticePeriodDays: number;
  }>;
  urgentJobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    skills: string[];
    priority?: string;
    openings: number;
    duration?: string;
  }>;
  rmUser?: { firstName: string; lastName: string };
}

export default function RmDashboardPage() {
  const { data, loading, error, reload } =
    useApi<RmDashboardData>("/api/rm/dashboard");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/candidates", {
      method: "POST",
      body: form,
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) {
      setUploadMsg(json.error || "Upload failed");
      return;
    }
    setUploadMsg(`Uploaded: ${json.success} success, ${json.failed} failed`);
    reload();
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const { overview, criticalCandidates, urgentJobs, allocations, rmUser } =
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
        <h1 className="mt-2 text-3xl font-bold">Good Morning, {greeting}!</h1>
        <p className="mt-2 text-sm opacity-80">
          Here&apos;s your bench summary for today
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-2xl font-bold">{overview.totalBench}</p>
            <p className="text-xs uppercase">On Bench</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-2xl font-bold">{overview.criticalBench}</p>
            <p className="text-xs uppercase">Critical Cases</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-2xl font-bold">{overview.averageBenchDays}d</p>
            <p className="text-xs uppercase">Avg Bench Days</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-semibold text-red-600"
        >
          Upload Excel Sheet
        </button>
        {uploadMsg && (
          <span className="text-sm text-gray-600">{uploadMsg}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Bench Candidates",
            value: overview.totalBench,
            icon: "👥",
          },
          {
            label: "Critical (30+ days)",
            value: overview.criticalBench,
            icon: "🚨",
          },
          { label: "Open Job Slots", value: overview.openJobs, icon: "💼" },
          { label: "Urgent Openings", value: overview.urgentJobs, icon: "⚡" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            🚨 Critical Bench Cases
          </h2>
          {criticalCandidates.length === 0 ? (
            <p className="text-sm text-gray-500">No critical cases.</p>
          ) : (
            criticalCandidates.map((c) => (
              <div
                key={c._id}
                className="mb-3 rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-500">
                      {c.role} · {c.location}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-bold text-red-600">
                      {c.benchDays}d bench
                    </p>
                    <p className="text-gray-500">
                      {c.noticePeriodDays}d notice
                    </p>
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
              <div className="flex justify-between">
                <h3 className="font-semibold">{job.title}</h3>
                <span className="text-xs font-bold text-red-600">
                  {job.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {job.company} · {job.location}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills?.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                  >
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

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Allocations</h2>
        {allocations.length === 0 ? (
          <p className="text-sm text-gray-500">No allocations yet.</p>
        ) : (
          <ul className="space-y-2">
            {allocations.map((a) => (
              <li
                key={a._id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>
                  <strong>{a.candidateId?.name}</strong> → {a.jobId?.title}
                </span>
                <span className="text-gray-400">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
