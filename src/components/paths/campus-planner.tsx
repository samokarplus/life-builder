"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { coloradoCampuses } from "@/data/campuses";
import { SourceStatus } from "@/components/ui/source-status";
import { campusDeadlines, type CampusAudience } from "@/lib/campus-deadlines";
import type { EntryTerm } from "@/lib/deadlines";

const money=(amount:number)=>amount.toLocaleString("en-US",{style:"currency",currency:"USD"});
export function CampusPlanner({calendar=false}:{calendar?:boolean}){
 const today=useMemo(()=>new Date(),[]);
 const [campusId,setCampusId]=useState(coloradoCampuses[0].id);
 const [audience,setAudience]=useState<CampusAudience>("transfer");
 const [term,setTerm]=useState<EntryTerm>("fall");
 const [year,setYear]=useState(Math.max(2027,today.getFullYear()));
 const campus=coloradoCampuses.find(c=>c.id===campusId)!;
 const dates=campusDeadlines(campus,audience,term,year,today);
 const admission=campus.admissions.find(a=>a.audience===audience)!;
 const heading=calendar?"Campus application and aid calendar":"Explore a Colorado transfer destination";
 return <section aria-label={heading} className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
  <p className="eyebrow">More Colorado campuses</p><h2 className="mt-2 font-serif text-2xl">{heading}</h2>
  <p className="mt-2 text-sm text-muted">Explore school options alongside your career route. Check your major with an adviser before choosing courses.</p>
  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
   <label className="text-sm">Campus<select className="mt-1 block w-full rounded-xl border border-border bg-background p-2" value={campusId} onChange={e=>setCampusId(e.target.value)}>{coloradoCampuses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
   <label className="text-sm">Applicant type<select className="mt-1 block w-full rounded-xl border border-border bg-background p-2" value={audience} onChange={e=>setAudience(e.target.value as CampusAudience)}><option value="transfer">Transfer</option><option value="first-year">First year</option></select></label>
   <label className="text-sm">Entry term<select className="mt-1 block w-full rounded-xl border border-border bg-background p-2" value={term} onChange={e=>setTerm(e.target.value as EntryTerm)}>{["spring","summer","fall"].map(t=><option key={t} value={t}>{t}</option>)}</select></label>
   <label className="text-sm">Entry year<select className="mt-1 block w-full rounded-xl border border-border bg-background p-2" value={year} onChange={e=>setYear(Number(e.target.value))}>{Array.from({length:4},(_,i)=>Math.max(2027,today.getFullYear())+i).map(y=><option key={y}>{y}</option>)}</select></label>
  </div>
  <div className="mt-5" aria-live="polite">
   <h3 className="font-medium">Transfer to {campus.name}</h3>
   {!calendar&&<ol className="mt-3 list-decimal space-y-3 pl-5 text-sm"><li>Review your major&apos;s transfer guide with FRCC advising. <Link className="text-primary underline" href="/explorer">Review your coursework</Link><p className="mt-1 text-muted">{campus.transfer.note}</p><SourceStatus sourceId={campus.transfer.sourceId}/><SourceStatus sourceId="src-frcc-transfer-guides" label="FRCC guide index"/></li><li>Confirm application requirements and your term&apos;s dates.<p className="mt-1 text-muted">{admission.note}</p><SourceStatus sourceId={admission.sourceId}/></li><li>Build your budget with your program&apos;s published costs and financial aid office.</li></ol>}
   {calendar&&<><p className="mt-2 text-sm text-muted">{admission.note}</p><SourceStatus sourceId={admission.sourceId}/></>}
   <h4 className="mt-5 text-sm font-semibold">{term[0].toUpperCase()+term.slice(1)} {year} · {audience==="transfer"?"Transfer":"First year"} dates</h4>
   {dates.length?<ol className="mt-3 grid gap-3 sm:grid-cols-2">{dates.map(d=><li key={d.id} className="rounded-xl border border-border bg-background p-3 text-sm"><p className="font-medium">{d.label}</p><p className="tabular mt-1">{d.date} · {d.state==="passed"?`passed ${-d.days} days ago`:d.state==="today"?"today":`in ${d.days} days`}</p><p className="mt-1 text-xs text-muted">{d.when.basis==="fixed-cycle"?"Published cycle date":"Annual pattern · selected year is a planning assumption; confirm this cycle"}</p><SourceStatus sourceId={d.sourceId}/></li>)}</ol>:<p className="mt-3 rounded-xl bg-soft p-3 text-sm">No verified dates loaded for this selection. Confirm with the official source; a missing date does not mean applications are closed.</p>}
   {!calendar&&<div className="mt-5 rounded-xl bg-soft p-4 text-sm"><h4 className="font-semibold">Published tuition example · {campus.tuition.period}</h4><p className="mt-1 text-muted">{campus.tuition.scope}</p><p className="mt-2"><strong>{money(campus.tuition.residentBase)}</strong> base for one credit · {money(campus.tuition.cof)} COF if eligible and authorized.</p><p className="mt-1 text-muted">{campus.tuition.caveat}</p><p className="mt-1 text-xs text-muted">This example is excluded from automatic semester cost estimates.</p><SourceStatus sourceId={campus.tuition.sourceId}/><p className="mt-3"><Link className="text-primary underline" href="/funding">Plan aid and application dates</Link></p></div>}
  </div>
 </section>;
}
