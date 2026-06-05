import DashboardShell from "@/components/layout/DashboardShell";
import { UserRole } from "@/constants/roles";

export default function RmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell forcedRole={UserRole.RESOURCE_MANAGER}>
      {children}
    </DashboardShell>
  );
}
