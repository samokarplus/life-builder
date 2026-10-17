"use client";

import { useState } from "react";
import { AlertTriangle, BookUser, Flag, MapPin, Route } from "lucide-react";
import { accessOptions, audienceLabels, type Audience } from "@/data/access";
import type { CareerMeta } from "@/data/career-meta";
import { SourceStatus } from "@/components/ui/source-status";
import { cn } from "@/lib/utils";

function SourceLink({ sourceId, label }: { sourceId: string; url?: string; label?: string }) {
  return <SourceStatus sourceId={sourceId} label={label} />;
}

export function IdealPath({ meta }: { meta: CareerMeta }) {
  return (
    <section aria-labelledby="ideal-h" className="mt-10">
      <h3 id="ideal-h" className="flex items-center gap-2 font-serif text-2xl"><Route size={20} className="text-primary" aria-hidden /> The ideal path</h3>
      <p className="mt-1 text-sm text-muted">{meta.headline}</p>
      {!meta.ideal.length && <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted">No verified end-to-end duration is loaded for this route. Check the official program and licensing requirements for your pathway.</p>}
      <ol className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {meta.ideal.map((s, i) => (
          <li key={s.label} className="relative rounded-2xl border border-border bg-surface p-4 shadow-card">
            <span className="tabular grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span>
            <p className="mt-3 text-sm font-medium">{s.label}</p>
            <p className="tabular mt-1 font-serif text-lg">{s.duration}</p>
            <p className="mt-2 text-xs"><span className={cn("rounded-full px-2 py-0.5", s.basis === "official" ? "bg-soft text-primary" : "bg-warm text-muted")}>{s.basis === "official" ? "From an official source" : "Our estimate"}</span></p>
            {s.basis === "official" && <div className="mt-2"><SourceLink sourceId={s.sourceId} /></div>}
            {s.note && <p className="mt-2 text-xs text-muted">{s.note}</p>}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted">{meta.idealNote} Everyone moves at a different pace, and working while you study often adds time.</p>
    </section>
  );
}

export function Challenges({ meta }: { meta: CareerMeta }) {
  return (
    <section aria-labelledby="hard-h" className="mt-10">
      <h3 id="hard-h" className="flex items-center gap-2 font-serif text-2xl"><AlertTriangle size={20} className="text-gold" aria-hidden /> What makes it hard</h3>
      <p className="mt-1 text-sm text-muted">Honest hurdles, each with where it comes from. Knowing them early is how people plan around them.</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {meta.challenges.map((c) => (
          <li key={c.title} className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-medium">{c.title}</p>
            <p className="mt-1 text-sm text-muted">{c.detail}</p>
            <div className="mt-2"><SourceLink sourceId={c.sourceId} /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function People({ meta }: { meta: CareerMeta }) {
  return (
    <section aria-labelledby="people-h" className="mt-10">
      <h3 id="people-h" className="flex items-center gap-2 font-serif text-2xl"><BookUser size={20} className="text-primary" aria-hidden /> People who did it</h3>
      {meta.people.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted">We haven&apos;t found a verified story for this route yet, and we don&apos;t make them up. If an official school or agency page tells one, it will show up here.</p>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {meta.people.map((p) => (
            <li key={p.name} className="lift rounded-2xl border border-border bg-surface p-5 shadow-card">
              <p className="font-serif text-xl">{p.name}</p>
              <p className="text-xs text-muted">{p.role}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{p.background.map((b) => <li key={b}>{b}</li>)}</ul>
              {p.lesson && <p className="mt-3 rounded-xl bg-gold-soft px-3 py-2 text-sm"><Flag size={13} className="mr-1 inline" aria-hidden /><span className="font-medium">Our interpretation: </span>{p.lesson}</p>}
              <div className="mt-3"><SourceLink sourceId={p.sourceId} url={p.url} /></div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-muted">Stories published by schools and agencies are their own accounts; we repeat what they report and don&apos;t verify outcomes.</p>
    </section>
  );
}

export function WaysIn({ initial = "high-school" }: { initial?: Audience }) {
  const [aud, setAud] = useState<Audience>(initial);
  const items = accessOptions.filter((o) => o.audience === aud);
  return (
    <section aria-labelledby="ways-h" className="mt-12">
      <h3 id="ways-h" className="flex items-center gap-2 font-serif text-2xl"><MapPin size={20} className="text-primary" aria-hidden /> Different starting points</h3>
      <p className="mt-1 text-sm text-muted">Not everyone starts the same way. Pick yours.</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Your starting point">
        {(Object.keys(audienceLabels) as Audience[]).map((a) => (
          <button key={a} onClick={() => setAud(a)} aria-pressed={aud === a} className={cn("rounded-full border px-4 py-1.5 text-sm", aud === a ? "border-primary bg-soft text-primary" : "border-border bg-surface text-muted hover:text-foreground")}>{audienceLabels[a]}</button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3 lg:grid-cols-2">
        {items.map((o) => (
          <li key={o.id} className="lift rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p className="font-medium">{o.title}</p>
            <p className="mt-1 text-sm text-muted">{o.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{o.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            {o.caveat && <p className="mt-3 text-xs text-muted">{o.caveat}</p>}
            <div className="mt-3"><SourceLink sourceId={o.sourceId} url={o.url} />{o.additionalSourceIds?.map(id => <span key={id} className="ml-2"><SourceLink sourceId={id} /></span>)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
