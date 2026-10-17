import { Check, Flag } from "lucide-react";
import type { RouteStop } from "@/lib/route";
import { cn } from "@/lib/utils";

export function RouteMap({ stops, destination }: { stops: RouteStop[]; destination: string }) {
  if (!stops.length) return null;
  return (
    <section aria-label="Your route" className="lift mt-8 overflow-hidden rounded-[16px] border border-border bg-surface p-5 shadow-card">
      <h2 className="eyebrow">Your route</h2>
      <ol tabIndex={0} aria-label="Semesters on your route, scrolls sideways" className="mt-5 flex items-start gap-0 overflow-x-auto pb-2">
        {stops.map((s, i) => (
          <li key={s.id} className="relative flex min-w-28 flex-1 flex-col items-center text-center" aria-current={s.state === "current" ? "step" : undefined}>
            {i > 0 && <span className={cn("absolute right-1/2 top-4 h-0.5 w-full", stops[i - 1].state === "done" ? "bg-primary" : "bg-border")} aria-hidden />}
            <span className={cn("relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-semibold",
              s.state === "done" && "border-primary bg-primary text-primary-foreground",
              s.state === "current" && "border-primary bg-surface text-primary ring-4 ring-soft",
              s.state === "ahead" && "border-border bg-surface text-muted")}>
              {s.state === "done" ? <Check size={14} aria-label="Complete" /> : i + 1}
            </span>
            <span className="mt-2 text-sm font-medium">{s.label}</span>
            <span className="tabular text-xs text-muted">{s.courseCount ? `${s.credits} cr` : "open"}{s.state === "current" ? " · you are here" : ""}</span>
          </li>
        ))}
        <li className="relative flex min-w-28 flex-1 flex-col items-center text-center">
          <span className="absolute right-1/2 top-4 h-0.5 w-full border-t-2 border-dashed border-border" aria-hidden />
          <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-soft text-primary"><Flag size={14} aria-hidden /></span>
          <span className="mt-2 text-sm font-medium">{destination}</span>
          <span className="text-xs text-muted">your destination</span>
        </li>
      </ol>
    </section>
  );
}
