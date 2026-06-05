"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/hooks/useAuth";

interface NavbarProps {
  user?: AuthUser | null;
}

export default function Navbar({ user }: NavbarProps): React.JSX.Element {
  const router = useRouter();
  const name = user ? `${user.firstName} ${user.lastName}` : "User";
  const initials = user
    ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase()
    : "U";

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
