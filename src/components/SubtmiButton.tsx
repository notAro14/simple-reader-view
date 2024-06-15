"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Submit" }: { children?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      disabled={pending}
      className="btn btn-primary w-full"
      type="submit"
    >
      {children}
    </button>
  );
}
