"use client";

import { MantineProvider } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

export default function AppMantineProvider({ children }: Props) {
  return (
    <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
  );
}
