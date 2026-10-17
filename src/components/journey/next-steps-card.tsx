"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";
import { usePlanner } from "@/store/planner";
import { buildSuggestions } from "@/lib/journey/suggest";
import { filterActions, mergeActions, STATUS_ORDER } from "@/lib/journey/actions";
import { statusLabels } from "@/lib/journey/types";

/** The three most relevant things to do next, with a way into the full Action Center. */
export function NextStepsCard() {
  const { profile, semesters, actions } = usePlanner();
  const today = useMemo(() => new Date(), []);
  const active = useMemo(
    () => filterActions(mergeActions(buildSuggestions({ profile, semesters, today }), actions), "active").sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)),
    [profile, semesters, actions, today],
  );
  const top = active.slice(0, 3);
  const waiting = active.filter((v) => v.status === "waiting").length;
  return (
    <section aria-labelledby="ns-h" className="lift mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="ns-h" className="flex items-center gap-2 font-medium"><ListChecks size={16} className="text-primary" aria-hidden /> Your next steps</h2>
        <Link href="/next-steps" className="inline-flex items-center gap-1 text-sm font-medium text-primary">Open Next Steps <ArrowRight size={14} aria-hidden /></Link>
      </div>
      {top.length === 0 ? <p className="mt-3 text-sm text-muted">You&apos;re all caught up. New steps appear as your plan and the calendar change.</p> : (
        <ol className="mt-3 space-y-2">
          {top.map((v) => (
            <li key={v.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 shrink-0 rounded-full bg-warm px-2 py-0.5 text-[11px] text-muted">{statusLabels[v.status]}</span>
              <span>{v.title}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-xs text-muted">{active.length} to do{waiting ? `, ${waiting} waiting on a response` : ""}. Each one shows why it matters and where it comes from.</p>
    </section>
  );
}
