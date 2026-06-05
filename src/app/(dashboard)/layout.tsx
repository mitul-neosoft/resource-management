import type { ReactNode } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { UserRole } from "@/constants/roles";
import "remixicon/fonts/remixicon.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell forcedRole={UserRole.USER}>{children}</DashboardShell>
  );
}
