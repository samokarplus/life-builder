"use client";

import { CheckCircle2, CircleDashed, CircleHelp, Clock } from "lucide-react";
import { courses, requirements } from "@/data/sample";
import { evaluateRequirements, type ReqStatus } from "@/lib/requirements";
import { planContext } from "@/lib/plan-context";
import { usePlanner } from "@/store/planner";

const meta: Record<ReqStatus, { label: string; icon: React.ElementType; cls: string }> = {
  satisfied: { label: "Complete", icon: CheckCircle2, cls: "text-primary" },
  projected: { label: "On track (planned)", icon: Clock, cls: "text-primary" },
  uncertain: { label: "Needs a check", icon: CircleHelp, cls: "text-amber-700 dark:text-amber-400" },
  unsatisfied: { label: "Not yet in plan", icon: CircleDashed, cls: "text-muted" },
};

export function RequirementsPanel() {
  const { semesters, profile } = usePlanner();
  const ctx = planContext(semesters, profile.completed);
  const results = evaluateRequirements(requirements, { courses, ...ctx });
  const code = (id: string) => courses.find((c) => c.id === id)?.code ?? id;
  return (
    <section className="mt-10 rounded-[14px] border border-border bg-surface p-5 shadow-card" aria-labelledby="req-h">
      <h2 id="req-h" className="font-medium">Requirement tracker</h2>
      <p className="mt-1 text-xs text-muted">Illustrative sample requirements, not the official FRCC degree requirements. Completed and planned coursework are kept separate.</p>
      <ul className="mt-4 divide-y divide-border">
        {results.map((r) => {
          const m = meta[r.status];
          return (
            <li key={r.requirementId} className="flex flex-wrap items-start gap-3 py-3 text-sm">
              <m.icon size={16} className={`mt-0.5 ${m.cls}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <details><summary className="font-medium marker:text-muted">{r.label}</summary>
                  <dl className="mt-3 grid gap-2 rounded-xl bg-background p-3 text-xs"><div><dt className="font-medium">Completed coursework</dt><dd className="text-muted">{r.completedCourseIds.map(code).join(", ") || "None counted"}</dd></div><div><dt className="font-medium">Projected coursework</dt><dd className="text-muted">{r.projectedCourseIds.map(code).join(", ") || "None planned"}</dd></div><div><dt className="font-medium">Missing courses</dt><dd className="text-muted">{r.missingCourseIds.map(code).join(", ") || (r.status==="unsatisfied"?"More eligible credits needed; review the notes below.":"None identified in this sample rule")}</dd></div><div><dt className="font-medium">Needs verification</dt><dd className="text-muted">{r.uncertainCourseIds.map(code).join(", ") || "All sample rules still need official catalog verification."}</dd></div><div><dt className="font-medium">Credits counted</dt><dd>{r.creditsCounted} illustrative credits; each course counted once within this requirement.</dd></div></dl>
                </details>
                <p className="text-xs text-muted">{r.notes.join(" · ") || (r.usedCourseIds.length ? r.usedCourseIds.map(code).join(", ") : "")}</p>
              </div>
              <span className={`text-xs font-medium ${m.cls}`}>{m.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
