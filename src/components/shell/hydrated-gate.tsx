"use client";

import { useHydrated } from "@/store/planner";

export function HydratedGate({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  if (!ready) {
    return (
      <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading your plan">
        <div className="h-10 w-64 rounded-xl bg-warm" />
        <div className="h-64 rounded-[14px] bg-warm" />
      </div>
    );
  }
  return <>{children}</>;
}
