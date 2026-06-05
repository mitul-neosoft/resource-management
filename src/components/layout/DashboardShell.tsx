"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/constants/roles";
import { Loader, Center } from "@mantine/core";

interface DashboardShellProps {
  children: ReactNode;
  forcedRole?: UserRole;
}

export default function DashboardShell({
  children,
  forcedRole,
}: DashboardShellProps): React.JSX.Element {
  const NAVBAR_HEIGHT = 56;
  const { user, loading } = useAuth();
  const role = forcedRole || user?.role || UserRole.USER;

  if (loading && !forcedRole) {
    return (
      <Center style={{ minHeight: "100vh" }}>
        <Loader color="red" />
      </Center>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Navbar user={user} />
      </div>

      <div
        style={{
          display: "flex",
          paddingTop: NAVBAR_HEIGHT,
          minHeight: "100vh",
        }}
      >
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
