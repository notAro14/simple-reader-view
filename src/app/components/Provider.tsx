"use client";
import { Toaster } from "react-hot-toast";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
}
