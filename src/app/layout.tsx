import "@mantine/core/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import AppMantineProvider from "@/providers/MantineProvider";

export const metadata: Metadata = {
  title: "Resource Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppMantineProvider>{children}</AppMantineProvider>
      </body>
    </html>
  );
}
