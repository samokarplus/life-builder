"use client";
import { usePathname } from "next/navigation";
import { useHydrated } from "@/store/planner";
import { PageSkeleton } from "@/components/ui/page-skeleton";
export function HydratedGate({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const path = usePathname();
  return ready ? <>{children}</> : <PageSkeleton page={path.split("/")[1]} />;
}
