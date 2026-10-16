import { cn } from "@/lib/utils";
export function PageSkeleton({ page = "overview" }: { page?: string }) {
  const form = ["profile", "settings", "costs", "onboarding"].includes(page);
  const board = page === "roadmap";
  return <div role="status" aria-label="Loading your plan" aria-busy="true" className="mx-auto max-w-5xl animate-pulse space-y-6">
    <span className="sr-only">Loading your plan…</span><div className="h-4 w-24 rounded bg-warm" /><div className="h-10 w-3/4 max-w-lg rounded-xl bg-warm" /><div className="h-4 w-2/3 rounded bg-warm" />
    <div className={cn("grid gap-4", board ? "sm:grid-cols-3" : form ? "mx-auto max-w-2xl" : "sm:grid-cols-2")}>
      {Array.from({ length: form ? 3 : board ? 3 : 4 }, (_, i) => <div key={i} className={cn("rounded-2xl border border-border bg-surface p-5", board ? "h-96" : "h-48")}><div className="h-4 w-1/2 rounded bg-warm" /><div className="mt-6 h-8 w-2/3 rounded bg-soft" /><div className="mt-4 h-4 w-full rounded bg-warm" /><div className="mt-3 h-4 w-4/5 rounded bg-warm" /></div>)}
    </div>
  </div>;
}
