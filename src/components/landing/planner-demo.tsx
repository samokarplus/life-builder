"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { courses } from "@/data/sample";
import { generatePlan, semesterLabel } from "@/lib/schedule";
import { semesterCredits } from "@/lib/credits";
export function PlannerDemo() {
  const [max, setMax] = useState(12);
  const plan = generatePlan({ maxCreditsPerSemester: max, completed: [], currentInstitutionId: "frcc", destinationInstitutionId: "cub" }, courses, {term:"fall",year:2026}).filter(s=>s.courses.length);
  return <section className="my-16 grid gap-8 rounded-2xl border border-border bg-soft p-6 md:grid-cols-2 md:p-10" aria-labelledby="demo-title">
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">A little room to experiment</p><h2 id="demo-title" className="mt-3 font-serif text-3xl md:text-4xl">Same dream.<br />Your own pace.</h2><p className="mt-4 text-sm text-muted">Try a lighter semester. See how your sample roadmap changes, without changing your saved plan.</p><div role="group" aria-label="Demo semester pace" className="mt-6 flex flex-wrap gap-2">{[9,12,15].map(n=><button key={n} aria-pressed={max===n} onClick={()=>setMax(n)} className={`rounded-full border px-4 py-2 text-sm ${max===n?'border-primary bg-primary text-primary-foreground':'border-border bg-surface'}`}>{max===n&&<Check size={13} className="mr-1 inline" />}{n} credits</button>)}</div><Link href="/onboarding" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">Make it yours <ArrowRight size={16}/></Link></div>
    <div className="rounded-2xl border border-border bg-surface p-5"><p aria-live="polite" className="mb-5 text-sm font-medium">{plan.length} sample semesters · {max} credits maximum</p><ol className="space-y-4">{plan.map((s,i)=><li key={s.id} className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft text-primary"><CalendarDays size={16}/></span><div className="flex-1"><p className="text-sm font-medium">{semesterLabel(s)}</p><p className="text-xs text-muted">{s.courses.length} courses · {semesterCredits(s,courses)} illustrative credits</p></div><span className="text-xs text-muted">0{i+1}</span></li>)}</ol><p className="mt-5 border-t border-border pt-4 text-xs text-muted">A planning example, not a graduation forecast. Course availability and transfer eligibility are unknown.</p></div>
  </section>;
}
