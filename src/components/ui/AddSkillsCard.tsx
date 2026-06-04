"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

interface Skill {
  _id: string;
  skillName: string;
  experience: number;
  level: string;
}

interface Theme {
  red: string;
  redLight: string;
  border: string;
  card: string;
  text: string;
  muted: string;
}

export default function SkillsCard(): React.JSX.Element {
  const T: Theme = {
    red: "#F12B20",
    redLight: "#FFF3F2",
    border: "#E5E7EB",
    card: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
  };

  const [skillName, setSkillName] = useState("");
  const [experience, setExperience] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ skills: Skill[] }>("/api/skills");
      setSkills(data.skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const addSkill = async (): Promise<void> => {
    if (!skillName.trim() || !experience || !level) return;

    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({
          skillName,
          experience: Number(experience),
          level,
        }),
      });
      setSkillName("");
      setExperience("");
      setLevel("");
      await loadSkills();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (id: string): Promise<void> => {
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/skills/${id}`, { method: "DELETE" });
      await loadSkills();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: T.card,
        borderRadius: 12,
        border: `1px solid ${T.border}`,
        padding: 24,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ margin: "0 0 20px", color: T.text }}>My Skill Sets</h3>

      {error && (
        <p style={{ color: T.red, fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          style={{
            flex: "2 1 250px",
            minWidth: 180,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />
        <input
          type="number"
          min="0"
          placeholder="Years"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{
            width: 90,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            width: 170,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            background: "#fff",
          }}
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
        <button
          type="button"
          onClick={addSkill}
          disabled={saving}
          style={{
            background: T.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Add Skill"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: T.muted }}>Loading skills...</p>
      ) : skills.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.redLight }}>
              <th style={thStyle(T)}>Skill</th>
              <th style={thStyle(T)}>Experience</th>
              <th style={thStyle(T)}>Level</th>
              <th style={thStyle(T)}>Action</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((item) => (
              <tr key={item._id}>
                <td style={tdStyle(T)}>{item.skillName}</td>
                <td style={tdStyle(T)}>
                  {item.experience} Year{item.experience > 1 ? "s" : ""}
                </td>
                <td style={tdStyle(T)}>{item.level}</td>
                <td style={tdStyle(T)}>
                  <button
                    type="button"
                    onClick={() => removeSkill(item._id)}
                    disabled={saving}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: T.red,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: T.muted, fontSize: 14 }}>No skills added yet.</p>
      )}
    </div>
  );
}

const thStyle = (T: Theme): React.CSSProperties => ({
  textAlign: "left",
  padding: "12px",
  color: T.red,
  borderBottom: `2px solid ${T.border}`,
});

const tdStyle = (T: Theme): React.CSSProperties => ({
  padding: "12px",
  borderBottom: `1px solid ${T.border}`,
});
