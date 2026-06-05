import { UserRole } from "@/constants/roles";

export interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

export const SIDEBAR_MENU: Record<UserRole, MenuItem[]> = {
  [UserRole.USER]: [
    {
      name: "Dashboard",
      icon: "ri-dashboard-line",
      path: "/dashboard",
    },
    {
      name: "Jobs",
      icon: "ri-briefcase-line",
      path: "/jobs",
    },
    {
      name: "Interview",
      icon: "ri-user-search-line",
      path: "/dashboard/interview",
    },
    {
      name: "Assessment",
      icon: "ri-clipboard-line",
      path: "/dashboard/assessment",
    },
    {
      name: "Learning",
      icon: "ri-book-open-line",
      path: "/learning",
    },
  ],

  [UserRole.RESOURCE_MANAGER]: [
    {
      name: "Overview",
      icon: "ri-dashboard-line",
      path: "/rm/dashboard",
    },
    {
      name: "Bench",
      icon: "ri-team-line",
      path: "/rm/bench",
    },
    {
      name: "Jobs",
      icon: "ri-briefcase-line",
      path: "/rm/jobs",
    },
    {
      name: "L&D",
      icon: "ri-book-open-line",
      path: "/rm/lnd",
    },
    {
      name: "Reports",
      icon: "ri-bar-chart-line",
      path: "/rm/reports",
    },
  ],
};
