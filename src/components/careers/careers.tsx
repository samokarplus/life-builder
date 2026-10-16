"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { careers } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { cn } from "@/lib/utils";

export function Careers() {
  const { profile } = usePlanner();
  const initial = careers.find((c) => profile.dream && c.name.toLowerCase().includes(profile.dream.toLowerCase().split(" ")[0]))?.id ?? "lpc";
  const [id, setId] = useState(initial);
  const career = careers.find((c) => c.id === id)!;

  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <ul className="space-y-1" aria-label="Careers">
        {careers.map((c) => (
          <li key={c.id}>
            <button onClick={() => setId(c.id)} aria-current={id === c.id} className={cn("flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm", id === c.id ? "bg-soft font-medium text-primary" : "hover:bg-soft")}>
              {c.name}
              {c.status === "placeholder" && <span className="rounded-full bg-warm px-2 py-0.5 text-[10px] uppercase text-muted">Placeholder</span>}
            </button>
          </li>
        ))}
      </ul>
      <section className="rounded-[14px] border border-border bg-surface p-6 shadow-card">
        <h2 className="font-serif text-3xl">{career.name}</h2>
        {career.status === "placeholder" ? (
          <p className="mt-4 text-sm text-muted">This career hasn&apos;t been researched yet. We&apos;d rather show nothing than guess at its education requirements.</p>
        ) : (
          <>
            <ol className="mt-6 space-y-0">
              {career.stages.map((s, i) => (
                <li key={s.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-primary-foreground">{i + 1}</span>
                    {i < career.stages.length - 1 && <span className="w-px flex-1 bg-sage" />}
                  </div>
                  <div className="pb-6"><h3 className="font-medium">{s.label}</h3><p className="text-sm text-muted">{s.description}</p></div>
                </li>
              ))}
            </ol>
            <p className="rounded-xl bg-soft p-4 text-sm"><Info size={14} className="mr-1 inline" aria-hidden />Jurisdiction: {career.jurisdiction}. Requirements differ by state and change over time. This outline is illustrative, not licensing advice; confirm every step with your state&apos;s official licensing board. No official source link is loaded yet.</p>
          </>
        )}
      </section>
    </div>
  );
}
