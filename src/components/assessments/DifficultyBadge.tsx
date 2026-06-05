"use client";

interface DifficultyBadgeProps {
  level: string;
}

export default function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const map: Record<string, string> = {
    easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    hard: "bg-rose-50 text-rose-700 border border-rose-200",
    Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border border-amber-200",
    Hard: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[level] ?? "bg-gray-100 text-gray-600"}`}
    >
      {level}
    </span>
  );
}