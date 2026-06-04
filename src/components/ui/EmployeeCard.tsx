"use client";

interface Employee {
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  resignDate: string;
  clientContractEndDate: string;
}

interface StatTileProps {
  value: number;
  label: string;
  valueColor: string;
}

const NOTICE_PERIOD_DAYS = 90;

export default function EmployeeWelcomeCard(): React.JSX.Element {
  const employee: Employee = {
    name: "Shubham Mohite",
    email: "shubham.mohite@company.com",
    employeeId: "EMP-1024",
    designation: "Senior Full Stack Developer",
    resignDate: "2026-05-01",
    clientContractEndDate: "2026-05-30",
  };

  const normalizeDate = (date: Date | string): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getDaysDiff = (start: Date, end: Date): number => {
    const msPerDay = 1000 * 60 * 60 * 24;

    const diff = (start.getTime() - end.getTime()) / msPerDay;

    return Math.round(diff);
  };

  const getNoticeDaysLeft = (): number | null => {
    if (!employee.resignDate) return null;

    const resignDate = normalizeDate(employee.resignDate);

    const noticeEndDate = new Date(resignDate);
    noticeEndDate.setDate(noticeEndDate.getDate() + NOTICE_PERIOD_DAYS);

    const today = normalizeDate(new Date());

    const diff = getDaysDiff(noticeEndDate, today);

    return diff > 0 ? diff : 0;
  };

  const getBenchDays = (): number | null => {
    if (!employee.clientContractEndDate) return null;

    const contractEnd = normalizeDate(employee.clientContractEndDate);

    const today = normalizeDate(new Date());

    const diff = getDaysDiff(today, contractEnd);

    return diff > 0 ? diff : 0;
  };

  const noticeDaysLeft = getNoticeDaysLeft();
  const benchDays = getBenchDays();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)",
        borderRadius: 20,
        padding: 32,
        color: "#fff",
        boxShadow: "0 15px 40px rgba(211,47,47,0.25)",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div>
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

        <h1
          style={{
            margin: "8px 0 6px",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          {employee.name}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {employee.designation}
        </p>
      </div>

      {/* Details */}
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
        <span>ID: {employee.employeeId}</span>
        <span>Email: {employee.email}</span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {benchDays !== null && (
          <StatTile
            value={benchDays}
            label="Days on Bench"
            valueColor="#FFFFFF"
          />
        )}

        {noticeDaysLeft !== null && (
          <StatTile
            value={noticeDaysLeft}
            label="Notice Days Left"
            valueColor="#FFD54F"
          />
        )}
      </div>
    </div>
  );
}

function StatTile({
  value,
  label,
  valueColor,
}: StatTileProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: "18px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          color: valueColor,
        }}
      >
        {value}
      </div>

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
