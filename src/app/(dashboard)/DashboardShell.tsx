"use client";

import { ReactNode } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { UserRole } from "@/constants/roles";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({
  children,
}: DashboardShellProps): React.JSX.Element {
  const NAVBAR_HEIGHT = 56;

  // TODO: Replace with session/auth role
  const role = UserRole.USER;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* TOP NAVBAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Navbar />
      </div>

      {/* BODY */}
      <div
        style={{
          display: "flex",
          paddingTop: NAVBAR_HEIGHT,
          minHeight: "100vh",
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            position: "fixed",
            top: NAVBAR_HEIGHT,
            left: 0,
            bottom: 0,
            background: "#fff",
            borderRight: "1px solid #E5E7EB",
          }}
        >
          <Sidebar role={role} />
        </div>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            marginLeft: 120,
            background: "#F9FAFB",
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
