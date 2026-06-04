import type { ReactNode } from "react";

import DashboardShell from "./DashboardShell";
import "remixicon/fonts/remixicon.css";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
