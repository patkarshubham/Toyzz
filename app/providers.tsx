"use client";

import { ThemeProvider } from "next-themes";
import { CommerceProvider } from "./commerce-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <CommerceProvider>{children}</CommerceProvider>
    </ThemeProvider>
  );
}
