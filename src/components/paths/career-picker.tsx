"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { CareerBadge } from "@/components/brand/career-badge";
import { buildCards, searchCareers } from "@/lib/career-search";
import type { Category } from "@/data/career-meta";
import { cn } from "@/lib/utils";

const categories: Category[] = ["Space & science", "Mental health", "Health care", "Skilled trades", "Education"];

export interface PickerState { query: string; category: Category | "all"; noDegree: boolean; highSchool: boolean }

export function CareerPicker({ state, onState, selected, onSelect }: { state: PickerState; onState: (s: PickerState) => void; selected: string; onSelect: (id: string) => void }) {
  const cards = useMemo(() => buildCards(), []);
  const results = searchCareers(cards, state);
  const chip = (active: boolean) => cn("rounded-full border px-3.5 py-1.5 text-sm", active ? "border-primary bg-soft text-primary" : "border-border bg-surface text-muted hover:text-foreground");
  const clear = () => onState({ query: "", category: "all", noDegree: false, highSchool: false });
  const filtered = state.query || state.category !== "all" || state.noDegree || state.highSchool;

  return (
    <section aria-labelledby="pick-h" className="mt-8">
      <h2 id="pick-h" className="font-serif text-2xl sm:text-3xl">Pick a dream</h2>
      <label className="relative mt-4 block max-w-xl">
        <span className="sr-only">Search careers, schools, programs and requirements</span>
        <Search size={16} className="absolute left-4 top-3.5 text-muted" aria-hidden />
        <input type="search" value={state.query} onChange={(e) => onState({ ...state, query: e.target.value })} placeholder="Search a job, school, exam or keyword (try “nurse”, “no degree”, “NASA”)" className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm shadow-card" />
      </label>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filters">
        <button onClick={() => onState({ ...state, category: "all" })} aria-pressed={state.category === "all"} className={chip(state.category === "all")}>All fields</button>
        {categories.map((c) => <button key={c} onClick={() => onState({ ...state, category: c })} aria-pressed={state.category === c} className={chip(state.category === c)}>{c}</button>)}
        <span className="mx-1 hidden w-px bg-border sm:block" aria-hidden />
        <button onClick={() => onState({ ...state, noDegree: !state.noDegree })} aria-pressed={state.noDegree} className={chip(state.noDegree)}>Can start without a degree</button>
        <button onClick={() => onState({ ...state, highSchool: !state.highSchool })} aria-pressed={state.highSchool} className={chip(state.highSchool)}>Has a high school step</button>
        {filtered && <button onClick={clear} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-primary underline"><X size={13} aria-hidden /> Clear</button>}
      </div>
      <p className="mt-3 text-xs text-muted" role="status">{results.length} of {cards.length} routes</p>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Career routes">
        {results.map((c) => (
          <li key={c.id}>
            <button onClick={() => onSelect(c.id)} aria-pressed={c.id === selected} className={cn("lift flex h-full w-full gap-4 rounded-2xl border bg-surface p-4 text-left shadow-card", c.id === selected ? "border-primary ring-2 ring-primary/30" : "border-border")}>
              <CareerBadge icon={c.meta.icon} theme={c.meta.theme} size={56} />
              <span className="min-w-0">
                <span className="block font-medium leading-snug">{c.career}</span>
                <span className="mt-0.5 block text-xs text-muted">{c.meta.category} · {c.jurisdiction}</span>
                <span className="mt-2 block text-sm text-muted">{c.meta.headline}</span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {c.meta.startsWithoutDegree && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-foreground">Can start without a degree</span>}
                  <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted">{c.stepCount} steps</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          <p>No route matches that yet. We add careers only when we can source them.</p>
          <button onClick={clear} className="mt-2 text-primary underline">Clear search</button>
        </div>
      )}
      <p className="mt-4 rounded-xl bg-warm p-3 text-xs text-muted">Coming next, each added only with an official source: engineer, software developer, entrepreneur and more Colorado campuses (CU Denver, CSU, Colorado School of Mines, Colorado Mesa, UNC).</p>
    </section>
  );
}
