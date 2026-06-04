"use client";

import { useState } from "react";

interface Skill {
  skill: string;
  experience: string;
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

  const [skillName, setSkillName] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const [skills, setSkills] = useState<Skill[]>([]);

  const addSkill = (): void => {
    if (!skillName.trim() || !experience || !level) {
      return;
    }

    setSkills((prev) => [
      ...prev,
      {
        skill: skillName,
        experience,
        level,
      },
    ]);

    setSkillName("");
    setExperience("");
    setLevel("");
  };

  const removeSkill = (index: number): void => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (): Promise<void> => {
    console.log("Skills Payload:", skills);

    // await axios.post("/api/skills", { skills });

    alert("Ready for API call");
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
      <h3
        style={{
          margin: "0 0 20px",
          color: T.text,
        }}
      >
        My Skill Sets
      </h3>

      {/* Add Skill Row */}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSkillName(e.target.value)
          }
          style={{
            flex: "2 1 250px",
            minWidth: 180,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <input
          type="number"
          min="0"
          placeholder="Years"
          value={experience}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setExperience(e.target.value)
          }
          style={{
            width: 90,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <select
          value={level}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setLevel(e.target.value)
          }
          style={{
            width: 170,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            background: "#fff",
            boxSizing: "border-box",
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
          style={{
            background: T.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Add Skill
        </button>
      </div>

      {/* Skills Table */}
      {skills.length > 0 && (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead>
              <tr style={{ background: T.redLight }}>
                <th style={thStyle(T)}>Skill</th>
                <th style={thStyle(T)}>Experience</th>
                <th style={thStyle(T)}>Level</th>
                <th style={thStyle(T)}>Action</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle(T)}>{item.skill}</td>

                  <td style={tdStyle(T)}>
                    {item.experience} Year
                    {Number(item.experience) > 1 ? "s" : ""}
                  </td>

                  <td style={tdStyle(T)}>{item.level}</td>

                  <td style={tdStyle(T)}>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
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

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              background: T.red,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Submit Skills
          </button>
        </>
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
