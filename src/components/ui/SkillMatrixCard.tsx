"use client";

interface SkillMatrixCardProps {
  skills?: string[];
}

export default function SkillMatrixCard({
  skills = [],
}: SkillMatrixCardProps): React.JSX.Element {
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
        Skill Matrix
      </h3>
      {skills.length === 0 ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>No skills on profile yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {skills.map((s) => (
            <span
              key={s}
              style={{
                background: "#FFF3F2",
                color: "#F12B20",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
