"use client";

interface DashboardUser {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  designation: string;
  resignDate?: string;
  clientContractEndDate?: string;
  skills?: string[];
}

interface DashboardStats {
  benchDays: number | null;
  noticeDaysLeft: number | null;
  totalSkills: number;
  learningProgress: number;
}

interface EmployeeWelcomeCardProps {
  user?: DashboardUser;
  stats?: DashboardStats;
  loading?: boolean;
  error?: string;
}

export default function EmployeeWelcomeCard({
  user,
  stats,
  loading,
  error,
}: EmployeeWelcomeCardProps): React.JSX.Element {
  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
          borderRadius: 20,
          padding: 32,
          color: "#fff",
          minHeight: 200,
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        style={{
          background: "#FEE2E2",
          borderRadius: 20,
          padding: 32,
          color: "#991B1B",
        }}
      >
        {error || "Unable to load employee data."}
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const benchDays = stats?.benchDays ?? null;
  const showNotice = Boolean(user.resignDate) && stats?.noticeDaysLeft !== null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
        borderRadius: 20,
        padding: 32,
        color: "#fff",
        boxShadow: "0 15px 40px rgba(211,47,47,0.25)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        Welcome Back
      </p>
      <h1 style={{ margin: "8px 0 6px", fontSize: 32, fontWeight: 800 }}>
        {fullName}
      </h1>
      <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
        {user.designation}
      </p>

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginTop: 20,
          fontSize: 14,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <span>ID: {user.employeeId}</span>
        <span>Email: {user.email}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {benchDays !== null && (
          <StatTile value={benchDays} label="Days on Bench" valueColor="#FFFFFF" />
        )}
        {showNotice && stats?.noticeDaysLeft !== null && (
          <StatTile
            value={stats!.noticeDaysLeft!}
            label="Notice Days Left"
            valueColor="#FFD54F"
          />
        )}
        {stats && (
          <>
            <StatTile
              value={stats.totalSkills}
              label="Total Skills"
              valueColor="#FFFFFF"
            />
            <StatTile
              value={stats.learningProgress}
              label="Learning %"
              valueColor="#A5D6A7"
            />
          </>
        )}
      </div>
    </div>
  );
}

function StatTile({
  value,
  label,
  valueColor,
}: {
  value: number;
  label: string;
  valueColor: string;
}): React.JSX.Element {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: "18px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 800, color: valueColor }}>{value}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.7)",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}
