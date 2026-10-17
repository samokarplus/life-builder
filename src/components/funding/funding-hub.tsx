"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ExternalLink, HandCoins, Landmark, Rocket, Sparkles, Stethoscope } from "lucide-react";
import { fundingItems, upcomingFundingDates, type FundingItem } from "@/data/funding";
import { stageLabels, stageOrder, type Stage } from "@/data/pathways";
import { SourceStatus } from "@/components/ui/source-status";
import { cn } from "@/lib/utils";

type PathFilter = "all" | "lpc-colorado" | "astronaut-bioastronautics";
const kindLabel: Record<FundingItem["kind"], string> = { federal: "Federal aid", state: "State aid", scholarship: "Scholarship", program: "Program", fellowship: "Fellowship" };

export function FundingHub() {
  const today = useMemo(() => new Date(), []);
  const [path, setPath] = useState<PathFilter>("astronaut-bioastronautics");
  const [stage, setStage] = useState<Stage | "all">("all");
  const dates = useMemo(() => upcomingFundingDates(today), [today]);
  const items = fundingItems.filter((f) => (path === "all" || f.paths.includes("all") || f.paths.includes(path)) && (stage === "all" || f.stages.includes(stage)));
  const chip = (active: boolean) => cn("rounded-full border px-4 py-1.5 text-sm", active ? "border-primary bg-soft text-primary" : "border-border bg-surface hover:bg-soft");

  return (
    <div className="space-y-8">
      <section className="hero-glow rounded-[24px] border border-border bg-surface p-6 shadow-card sm:p-8">
        <p className="eyebrow flex items-center gap-2"><HandCoins size={14} aria-hidden /> Paying for your dream</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Funding, FAFSA and the dates that matter.</h2>
        <p className="mt-2 max-w-2xl text-muted">A long road like astronaut or counselor means years of school. Here is how aid works, what Colorado and CU Boulder publish, and when to act. Every item shows its source, and anything we couldn&apos;t confirm says so.</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Your dream">
          <button onClick={() => setPath("astronaut-bioastronautics")} aria-pressed={path === "astronaut-bioastronautics"} className={cn(chip(path === "astronaut-bioastronautics"), "inline-flex items-center gap-2")}><Rocket size={14} aria-hidden /> Astronaut</button>
          <button onClick={() => setPath("lpc-colorado")} aria-pressed={path === "lpc-colorado"} className={cn(chip(path === "lpc-colorado"), "inline-flex items-center gap-2")}><Stethoscope size={14} aria-hidden /> Counselor (LPC)</button>
          <button onClick={() => setPath("all")} aria-pressed={path === "all"} className={chip(path === "all")}>Everything</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Your stage">
          <button onClick={() => setStage("all")} aria-pressed={stage === "all"} className={chip(stage === "all")}>Any stage</button>
          {stageOrder.filter((s) => s !== "career").map((s) => <button key={s} onClick={() => setStage(s)} aria-pressed={stage === s} className={chip(stage === s)}>{stageLabels[s]}</button>)}
        </div>
      </section>

      <section aria-labelledby="dates-h" className="rounded-[20px] border border-border bg-surface p-6 shadow-card">
        <h2 id="dates-h" className="flex items-center gap-2 font-medium"><CalendarClock size={16} className="text-primary" aria-hidden /> Dates to know</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {dates.map((d) => (
            <li key={d.id} className={cn("lift rounded-2xl border p-4", d.days <= 30 ? "border-amber-500/60" : "border-border")}>
              <p className="tabular font-serif text-2xl">{d.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              <p className={cn("tabular text-xs", d.days <= 30 ? "font-medium text-amber-700 dark:text-amber-400" : "text-primary")}>{d.days === 0 ? "today" : `in ${d.days} days`}</p>
              <p className="mt-2 text-sm font-medium">{d.label}</p>
              {d.note && <p className="mt-1 text-xs text-muted">{d.note}</p>}<SourceStatus sourceId={d.sourceId} />
            </li>
          ))}
          <li className="rounded-2xl border border-border p-4">
            <p className="tabular font-serif text-2xl">Jun 30, 2028</p>
            <p className="text-xs text-muted">federal 2027-28 FAFSA deadline</p>
            <p className="mt-2 text-sm font-medium">Last day to submit the 2027-28 FAFSA</p>
            <p className="mt-1 text-xs text-muted">11:59 p.m. Central; corrections until Sept. 12, 2028. Schools set earlier dates, so use theirs.</p>
          </li>
        </ol>
        <p className="mt-3 text-xs text-muted">CU Boulder dates are its annual pattern from the 2026-27 page, shown for the next time they come around. Confirm each cycle on the official pages.</p>
      </section>

      <section aria-labelledby="items-h">
        <h2 id="items-h" className="mb-3 flex items-center gap-2 font-medium"><Landmark size={16} className="text-primary" aria-hidden /> Aid, scholarships and programs <span className="text-sm font-normal text-muted">({items.length})</span></h2>
        <ul className="grid gap-4 lg:grid-cols-2">
          {items.map((f) => {
            return (
              <li key={f.id} className="lift rounded-2xl border border-border bg-surface p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{kindLabel[f.kind]}</span>
                  <SourceStatus sourceId={f.sourceId} />
                </div>
                <h3 className="mt-2 font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.summary}</p>
                {f.amount && <p className="mt-3 rounded-xl bg-soft px-3 py-2 text-sm"><span className="font-medium">Amount: </span>{f.amount}</p>}
                {f.eligibility && <><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">Who it&apos;s for</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{f.eligibility.map((e) => <li key={e}>{e}</li>)}</ul></>}
                {f.howToApply && <><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">How to apply</p><ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{f.howToApply.map((e) => <li key={e}>{e}</li>)}</ol></>}
                {f.caveat && <p className="mt-3 flex gap-2 text-xs text-muted"><Sparkles size={13} className="mt-0.5 shrink-0" aria-hidden />{f.caveat}</p>}
                <a href={f.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary underline">Official page <ExternalLink size={12} aria-hidden /></a>
              </li>
            );
          })}
        </ul>
        {items.length === 0 && <p className="py-10 text-center text-sm text-muted">Nothing loaded for that combination yet. Try &quot;Any stage&quot;.</p>}
      </section>
    </div>
  );
}
