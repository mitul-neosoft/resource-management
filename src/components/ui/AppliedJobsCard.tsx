"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

interface Application {
  _id: string;
  status: string;
  jobId: {
    title: string;
    company: string;
    location: string;
    status: string;
  };
}

export default function AppliedJobsCard(): React.JSX.Element {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ applications: Application[] }>("/api/job-applications")
      .then((d) => setApplications(d.applications))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>
        Applied Jobs
      </h3>
      {loading ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>Loading...</p>
      ) : applications.length === 0 ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>
          No applications yet. Browse the job marketplace to apply.
        </p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {applications.map((a) => (
            <li
              key={a._id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                {a.jobId?.title}
              </p>
              <p style={{ margin: "2px 0", fontSize: 12, color: "#6B7280" }}>
                {a.jobId?.company} · {a.jobId?.location}
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#F12B20",
                  textTransform: "capitalize",
                }}
              >
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
