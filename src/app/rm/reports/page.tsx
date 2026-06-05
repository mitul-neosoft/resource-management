"use client";

import { useApi } from "@/hooks/useApi";

interface Overview {
  totalBench: number;
  criticalBench: number;
  averageBenchDays: number;
  totalJobs: number;
  openJobs: number;
  urgentJobs: number;
  allocationRate: number;
  matchRatio: number;
  courseCompletionRate: number;
  benchAgeBreakdown: {
    fresh: number;
    moderate: number;
    highRisk: number;
    critical: number;
  };
  noticeRisk: Array<{
    _id: string;
    name: string;
    role?: string;
    benchDays: number | null;
    noticePeriodDays: number | null;
  }>;
}

export default function ReportsPage() {
  const { data, loading, error } = useApi<Overview>("/api/reports/overview");

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const total = data.totalBench || 1;
  const breakdown = data.benchAgeBreakdown;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open Jobs", value: data.openJobs },
          { label: "Match Ratio", value: `${data.matchRatio} avg/job` },
          { label: "Allocation Rate", value: `${data.allocationRate}%` },
          { label: "Course Completion", value: `${data.courseCompletionRate}%` },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border bg-white p-4">
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-sm text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-1 font-semibold">Bench Age Distribution</h2>
          <p className="mb-4 text-sm text-gray-500">Live calculated from contract end dates</p>
          {[
            { label: "0-7 days (Fresh)", key: "fresh", color: "bg-green-500" },
            { label: "8-20 days (Moderate)", key: "moderate", color: "bg-orange-500" },
            { label: "21-30 days (High Risk)", key: "highRisk", color: "bg-red-400" },
            { label: "30+ days (Critical)", key: "critical", color: "bg-red-700" },
          ].map((row) => {
            const count = breakdown[row.key as keyof typeof breakdown];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={row.key} className="mb-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span>{count} ({pct}%)</span>
                </div>
                <div className="h-2 rounded bg-gray-200">
                  <div className={`h-2 rounded ${row.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-1 font-semibold">RM KPIs</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between">
              <span>Average Bench Duration</span>
              <strong className="text-green-600">{data.averageBenchDays} days</strong>
            </li>
            <li className="flex justify-between">
              <span>Critical Resources</span>
              <strong className="text-red-600">{data.criticalBench}</strong>
            </li>
            <li className="flex justify-between">
              <span>Job Allocation Rate</span>
              <strong className="text-orange-600">{data.allocationRate}%</strong>
            </li>
            <li className="flex justify-between">
              <span>L&D Completion Rate</span>
              <strong className="text-blue-600">{data.courseCompletionRate}%</strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-1 font-semibold">Notice Period Risk</h2>
        {data.noticeRisk.length === 0 ? (
          <p className="text-sm text-gray-500">No notice period risks.</p>
        ) : (
          data.noticeRisk.map((c) => (
            <div
              key={c._id}
              className="mb-3 flex flex-col gap-2 rounded-lg border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">
                  {c.role} · {c.benchDays ?? 0}d on bench
                </p>
              </div>
              <p className="font-bold text-red-600">
                {c.noticePeriodDays}d notice left · Urgent
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
