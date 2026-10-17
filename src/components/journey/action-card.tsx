"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, CalendarClock, ExternalLink, HelpCircle, Info, NotebookPen, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { sourceById } from "@/data/sample";
import { civilDay, parseIsoDay } from "@/lib/calendar";
import { statusLabels, type ActionStatus, type ActionView, type Basis, type Snapshot } from "@/lib/journey/types";
import { cn } from "@/lib/utils";

const basisLabel: Record<Basis, { text: string; cls: string }> = {
  official: { text: "Official source", cls: "bg-soft text-primary" },
  user: { text: "Your information", cls: "bg-gold-soft text-foreground" },
  estimate: { text: "Estimate", cls: "bg-warm text-muted" },
  unverified: { text: "Unverified", cls: "bg-warm text-amber-800 dark:text-amber-300" },
};

export interface CardHandlers {
  setStatus: (v: ActionView, status: Exclude<ActionStatus, "suggested">) => void;
  update: (v: ActionView, patch: { notes?: string; dueDate?: string }) => void;
  restore: (v: ActionView) => void;
  reopen: (v: ActionView) => void;
  remove: (v: ActionView) => void;
}

export const toSnapshot = (v: ActionView): Snapshot => ({ title: v.title, why: v.why, goalLabel: v.goalLabel, evidence: v.evidence, next: v.next, dueDate: v.dueDate });

function dueText(iso: string, today: Date) {
  const days = parseIsoDay(iso) - civilDay(today);
  const date = new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { date, days, label: days < 0 ? `${date}, passed ${-days} day${days === -1 ? "" : "s"} ago` : days === 0 ? `${date}, today` : `${date}, in ${days} day${days === 1 ? "" : "s"}` };
}

export function ActionCard({ view: v, today, h }: { view: ActionView; today: Date; h: CardHandlers }) {
  const [open, setOpen] = useState(false);
  const due = v.dueDate ? dueText(v.dueDate, today) : null;
  const done = v.status === "completed";
  const btn = "h-8 rounded-full border border-border bg-surface px-3 text-xs font-medium hover:bg-soft";
  return (
    <li className={cn("rounded-2xl border bg-surface p-5 shadow-card", v.urgent ? "border-gold" : "border-border", done && "opacity-80")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", v.status === "suggested" ? "bg-warm text-muted" : done ? "bg-soft text-primary" : "bg-primary text-primary-foreground")}>{statusLabels[v.status]}</span>
        {v.custom && <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs">Added by you</span>}
        {v.goalLabel && <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-0.5 text-xs text-muted"><UserRound size={11} aria-hidden /> Supports: {v.goalLabel}</span>}
        {v.urgent && due && <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium">Date within 30 days</span>}
      </div>
      <h3 className={cn("mt-2 font-medium leading-snug", done && "line-through")}>{v.title}</h3>
      <p className="mt-1 text-sm text-muted">{v.why}</p>
      {due && <p className={cn("tabular mt-2 flex items-center gap-1.5 text-sm", due.days < 0 ? "text-muted" : "text-primary")}><CalendarClock size={14} aria-hidden /> {due.label}</p>}

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="What this is based on">
        {v.evidence.map((e) => {
          const src = e.sourceId ? sourceById(e.sourceId) : undefined;
          const b = basisLabel[e.basis];
          return (
            <li key={e.label} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1 text-xs">
              {e.basis === "official" ? <BadgeCheck size={12} className="text-primary" aria-hidden /> : e.basis === "unverified" ? <HelpCircle size={12} aria-hidden /> : <Info size={12} aria-hidden />}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", b.cls)}>{b.text}</span>
              {src?.url ? <a href={src.url} target="_blank" rel="noreferrer" className="underline">{e.label}</a> : <span>{e.label}</span>}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {v.next && (v.next.external
          ? <a href={v.next.href} target="_blank" rel="noreferrer" className={cn(btn, "inline-flex items-center gap-1 border-primary text-primary")}>{v.next.label} <ExternalLink size={12} aria-hidden /></a>
          : <Link href={v.next.href} className={cn(btn, "inline-flex items-center gap-1 border-primary text-primary")}>{v.next.label} <ArrowRight size={12} aria-hidden /></Link>)}
        {v.status === "suggested" && <><button className={btn} onClick={() => h.setStatus(v, "saved")}>Save</button><button className={btn} onClick={() => h.setStatus(v, "in-progress")}>Start</button><button className={btn} onClick={() => h.setStatus(v, "dismissed")}>Dismiss</button></>}
        {v.status === "saved" && <><button className={btn} onClick={() => h.setStatus(v, "in-progress")}>Start</button><button className={btn} onClick={() => h.setStatus(v, "completed")}>Mark done</button></>}
        {v.status === "in-progress" && <><button className={btn} onClick={() => h.setStatus(v, "waiting")}>Waiting for response</button><button className={btn} onClick={() => h.setStatus(v, "completed")}>Mark done</button></>}
        {v.status === "waiting" && <><button className={btn} onClick={() => h.setStatus(v, "in-progress")}>Got a response</button><button className={btn} onClick={() => h.setStatus(v, "completed")}>Mark done</button></>}
        {done && <button className={btn} onClick={() => h.reopen(v)}>Reopen</button>}
        {v.status === "dismissed" && <button className={btn} onClick={() => h.restore(v)}>Bring it back</button>}
        {(v.status === "saved" || v.status === "in-progress" || v.status === "waiting") && !v.custom && <button className={btn} onClick={() => h.setStatus(v, "dismissed")}>Dismiss</button>}
        <button className={cn(btn, "ml-auto inline-flex items-center gap-1")} aria-expanded={open} onClick={() => setOpen((o) => !o)}><NotebookPen size={12} aria-hidden /> {open ? "Hide details" : v.notes || v.dueDate ? "Notes & date" : "Add note or date"}</button>
      </div>

      {open && (
        <div className="mt-3 grid gap-3 rounded-xl bg-background p-3 sm:grid-cols-[12rem_1fr]">
          <label className="flex flex-col gap-1 text-xs">Due date (optional)
            <input type="date" defaultValue={v.record?.dueDate ?? ""} onChange={(e) => h.update(v, { dueDate: e.target.value })} className="h-9 rounded-lg border border-border bg-surface px-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-xs">Notes (stay on this device)
            <textarea defaultValue={v.notes} maxLength={2000} rows={3} onBlur={(e) => e.target.value !== v.notes && h.update(v, { notes: e.target.value })} className="rounded-lg border border-border bg-surface p-2 text-sm" />
          </label>
          {v.custom && <button className="inline-flex items-center gap-1 text-xs text-primary underline sm:col-span-2" onClick={() => h.remove(v)}><Trash2 size={12} aria-hidden /> Delete this action</button>}
        </div>
      )}
    </li>
  );
}
