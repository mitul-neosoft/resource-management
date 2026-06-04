"use client";

import { usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

export default function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      icon: "ri-dashboard-line",
      path: "/dashboard",
    },
    {
      name: "Jobs",
      icon: "ri-briefcase-line",
      path: "/dashboard/jobs",
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
      path: "/dashboard/learning",
    },
  ];

  return (
    <div
      style={{
        width: 120,
        height: "100%",
        background: "#fff",
        borderRight: "1px solid #E5E7EB",
        padding: "16px 10px",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          fontWeight: 800,
          fontSize: 16,
          marginBottom: 20,
          paddingLeft: 10,
        }}
      />

      {/* MENU */}
      {menu.map((item: MenuItem) => {
        const active = pathname === item.path;

        return (
          <a
            key={item.path}
            href={item.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 10px",
              marginBottom: 10,
              borderRadius: 12,
              textDecoration: "none",
              background: active ? "#e43e38" : "transparent",
              color: active ? "#fff" : "#111827",
              transition: "0.2s",
            }}
          >
            <i
              className={item.icon}
              style={{
                fontSize: 26,
                marginBottom: 6,
              }}
            />

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {item.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
