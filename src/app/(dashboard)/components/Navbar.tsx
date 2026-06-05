"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

export default function Navbar(): React.JSX.Element {
  const router = useRouter();
  const [name, setName] = useState("User");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    apiFetch<{
      user: { firstName: string; lastName: string };
    }>("/api/dashboard")
      .then((data) => {
        const full = `${data.user.firstName} ${data.user.lastName}`;
        setName(full);
        setInitials(
          `${data.user.firstName?.[0] || ""}${data.user.lastName?.[0] || ""}`.toUpperCase()
        );
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        background: "#e43e38",
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>
        Resource Engagement Portal
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
          }}
        >
          {initials}
        </div>
        <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>
          {name}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.8)",
            color: "#fff",
            borderRadius: 24,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
