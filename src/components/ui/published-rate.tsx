"use client";

import { SourceStatus } from "./source-status";
import { BadgeCheck } from "lucide-react";
import { tuitionRates, sourceById } from "@/data/sample";
import { usePlanner } from "@/store/planner";

/** Shows an officially published rate and lets the user copy it into their own (user-entered) rate. */
export function PublishedRate({ institutionId }: { institutionId: string }) {
  const setTuition = usePlanner((s) => s.setTuition);
  const rate = tuitionRates.find((t) => t.institutionId === institutionId);
  const src = rate && sourceById(rate.sourceId);
  if (!rate || rate.perCredit == null || !src) {
    return (
      <p className="rounded-xl bg-warm px-3 py-2 text-xs text-muted">
        No verified published rate is loaded for this institution{src?.note ? `. ${src.note}` : ""}. Enter your own.
      </p>
    );
  }
  const withCof = rate.cofStipend ? Math.round((rate.perCredit - rate.cofStipend) * 100) / 100 : null;
  return (
    <div className="rounded-xl bg-soft px-3 py-2 text-xs">
      <p className="flex items-center gap-1.5 font-medium text-primary"><BadgeCheck size={14} aria-hidden /> Published {rate.academicYear} rate (resident)</p>
      <p className="mt-1 text-muted">${rate.perCredit.toFixed(2)} per credit before fees{withCof != null ? `; $${withCof.toFixed(2)} after the $${rate.cofStipend} College Opportunity Fund stipend, if you qualify` : ""}. Campus fees are extra.</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setTuition(institutionId, rate.perCredit)} className="rounded-full border border-border bg-surface px-3 py-1 hover:bg-background">Use ${rate.perCredit.toFixed(2)}</button>
        {withCof != null && <button type="button" onClick={() => setTuition(institutionId, withCof)} className="rounded-full border border-border bg-surface px-3 py-1 hover:bg-background">Use ${withCof.toFixed(2)}</button>}
        {src.url && <a href={src.url} target="_blank" rel="noreferrer" className="text-primary underline">Source</a>}
        <SourceStatus sourceId={rate.sourceId} />
      </div>
    </div>
  );
}
