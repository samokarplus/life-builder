"use client";
import { usePathname } from "next/navigation";
import { useSaveState } from "@/lib/persistence";
import { useHydrated, usePlanner } from "@/store/planner";
import { PageSkeleton } from "@/components/ui/page-skeleton";
export function HydratedGate({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const path = usePathname();
  const save = useSaveState();
  if (save.phase === "error" && save.loadFailed) return <section role="alert" className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6"><h1 className="font-serif text-2xl">Your saved plan needs attention</h1><p className="my-4 text-sm text-muted">{save.error}</p><button className="rounded-full bg-primary px-4 py-2 text-primary-foreground" onClick={()=>usePlanner.persist.rehydrate()}>Retry loading</button><p className="mt-4 text-xs text-muted">Keep this browser’s data intact. Your previous localStorage plan remains available as a backup if it was migrated.</p></section>;
  return ready ? <>{children}</> : <PageSkeleton page={path.split("/")[1]} />;
}
