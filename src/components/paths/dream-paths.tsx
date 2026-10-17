"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, ExternalLink, HelpCircle, PiggyBank } from "lucide-react";
import { pathways, type PathwayStep } from "@/data/pathways";
import { sourceById } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { cuTransferDeadlines, describeDeadline, nextFallEntry, type EntryTerm } from "@/lib/deadlines";
import { cn } from "@/lib/utils";

const kindLabel: Record<PathwayStep["kind"], string> = {
  degree: "Degree", transfer: "Transfer", application: "Application", exam: "Exam", experience: "Experience", license: "License", selection: "Selection", requirement: "Requirement",
};

function Confidence({ sourceId }: { sourceId: string }) {
  const src = sourceById(sourceId);
  if (src?.status === "verified")
    return <a href={src.url ?? undefined} target="_blank" rel="noreferrer" title={src.note} className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-0.5 text-xs font-medium text-primary"><BadgeCheck size={12} aria-hidden /> Official source, checked {src.lastVerified}</a>;
  return <span title={src?.note} className="inline-flex items-center gap-1 rounded-full bg-warm px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300"><HelpCircle size={12} aria-hidden /> Confirm with the official source</span>;
}

export function DreamPaths() {
  const { profile, setProfile } = usePlanner();
  const today = useMemo(() => new Date(), []);
  const [pathId, setPathId] = useState(pathways[0].id);
  const [term, setTerm] = useState<EntryTerm>("fall");
  const [year, setYear] = useState(nextFallEntry(today));
  const path = pathways.find((p) => p.id === pathId)!;
  const key = `path:${path.id}`;
  const done = profile.careerStageProgress?.[key] ?? [];
  const toggle = (id: string) => setProfile({ careerStageProgress: { ...profile.careerStageProgress, [key]: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] } });
  const deadlines = cuTransferDeadlines(term, year);
  const pct = Math.round((done.length / path.steps.length) * 100);
  const sel = "h-9 rounded-full border border-border bg-surface px-3 text-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside>
        <ul className="space-y-2" aria-label="Dream paths">
          {pathways.map((p) => (
            <li key={p.id}>
              <button onClick={() => setPathId(p.id)} aria-pressed={p.id === pathId} className={cn("lift w-full rounded-2xl border p-4 text-left", p.id === pathId ? "border-primary bg-soft" : "border-border bg-surface")}>
                <span className="eyebrow">{p.career}</span>
                <span className="mt-1 block font-medium">{p.title}</span>
                <span className="mt-1 block text-xs text-muted">{p.jurisdiction} · {p.steps.length} steps</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-warm p-3 text-xs text-muted">More careers and universities across Colorado are on the way. Each one is added only with an official source.</p>
      </aside>

      <section className="min-w-0">
        <h2 className="font-serif text-3xl">{path.title}</h2>
        <p className="mt-2 text-muted">{path.summary}</p>
        <div className="mt-4 flex items-center gap-3" role="img" aria-label={`${done.length} of ${path.steps.length} steps marked done by you`}>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-warm"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
          <span className="tabular text-xs text-muted">{done.length}/{path.steps.length} done (self-reported)</span>
        </div>
        <p className="mt-3 rounded-xl border border-border bg-surface p-3 text-xs text-muted">{path.caution}</p>

        <ol className="mt-8 space-y-0">
          {path.steps.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <li key={s.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={cn("tabular grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold", isDone ? "bg-primary text-primary-foreground" : "bg-soft text-primary")}>{i + 1}</span>
                  {i < path.steps.length - 1 && <span className="w-px flex-1 bg-sage" aria-hidden />}
                </div>
                <article className="mb-5 min-w-0 flex-1 rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{kindLabel[s.kind]}</span><Confidence sourceId={s.sourceId} /></div>
                  <h3 className={cn("mt-2 font-medium", isDone && "text-muted line-through")}>{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.detail}</p>
                  {s.facts && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}

                  {s.deadlines === "cu-transfer" && (
                    <div className="mt-4 rounded-xl bg-soft p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <CalendarClock size={15} className="text-primary" aria-hidden />
                        <label className="sr-only" htmlFor={`term-${s.id}`}>Entry term</label>
                        <select id={`term-${s.id}`} value={term} onChange={(e) => setTerm(e.target.value as EntryTerm)} className={sel}><option value="fall">Fall</option><option value="spring">Spring</option><option value="summer">Summer</option></select>
                        <label className="sr-only" htmlFor={`year-${s.id}`}>Entry year</label>
                        <select id={`year-${s.id}`} value={year} onChange={(e) => setYear(Number(e.target.value))} className={sel}>{[0, 1, 2, 3].map((n) => <option key={n} value={today.getFullYear() + n}>{today.getFullYear() + n}</option>)}</select>
                        <span className="text-xs text-muted">entry at CU Boulder</span>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {deadlines.map((d) => {
                          const info = describeDeadline(d, today);
                          return (
                            <li key={d.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                              <span><span className="font-medium">{d.label}</span>{d.note && <span className="block text-xs text-muted">{d.note}</span>}</span>
                              <span className="tabular text-right"><span className="block">{new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                <span className={cn("text-xs", info.state === "passed" ? "text-muted" : info.state === "soon" || info.state === "today" ? "font-medium text-amber-700 dark:text-amber-400" : "text-primary")}>
                                  {info.state === "passed" ? `passed ${-info.days} days ago` : info.state === "today" ? "due today" : `in ${info.days} days`}
                                </span></span>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-3 text-xs text-muted">Month and day come from CU Boulder&apos;s Transfer Timeline page; it doesn&apos;t print years, so confirm the dates for your cycle.</p>
                    </div>
                  )}

                  {s.funding?.map((f) => (
                    <p key={f.label} className="mt-3 flex items-start gap-2 text-sm"><PiggyBank size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden /><span><span className="font-medium">{f.label}.</span> <span className="text-muted">{f.note}</span></span></p>
                  ))}
                  {s.links && <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">{s.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">{l.label}<ExternalLink size={12} aria-hidden /></a>)}</p>}

                  <label className="mt-4 flex items-center gap-2 text-xs"><input type="checkbox" checked={isDone} onChange={() => toggle(s.id)} className="accent-[var(--primary)]" /> I&apos;ve completed this (self-reported)</label>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
