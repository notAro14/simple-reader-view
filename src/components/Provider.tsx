"use client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <Theme accentColor="iris" panelBackground="translucent">
        {children}
      </Theme>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
