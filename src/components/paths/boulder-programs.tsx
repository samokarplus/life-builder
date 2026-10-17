"use client";
import { useMemo,useState } from "react";
import { boulderCourses,boulderPrograms,boulderTuitionExample } from "@/data/boulder";
import { evaluateBoulderProgram } from "@/lib/boulder-requirements";
import { planContext } from "@/lib/plan-context";
import { ruleCourseIds } from "@/lib/requirements";
import { usePlanner } from "@/store/planner";
import { SourceStatus } from "@/components/ui/source-status";
import Link from "next/link";
const label={satisfied:"Covered by verified completed coursework",projected:"Projected from planned coursework",uncertain:"Needs official review",unsatisfied:"Not yet covered in this plan"};
export function BoulderPrograms(){
 const {profile,semesters}=usePlanner();
 const [selected,setSelected]=useState(boulderPrograms[0].id);
 const program=boulderPrograms.find(p=>p.id===selected)!;
 const results=useMemo(()=>evaluateBoulderProgram(selected,planContext(semesters,profile.completed)),[selected,semesters,profile.completed]);
 const courseLabel=(id:string)=>boulderCourses.find(c=>c.id===id)?.code??id.replace('cub:','').replace('-', ' ');
 return <section aria-label="CU Boulder program requirements" className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
  <p className="eyebrow">Explore your major</p><h2 className="mt-2 font-serif text-2xl">What would CU Boulder require?</h2>
  <p className="mt-2 text-sm text-muted">Preview official requirement structures against your coursework. Choosing a preview keeps your saved program and course plan as they are. FRCC courses need official equivalencies before counting here.</p>
  <label className="mt-4 block text-sm">Program preview<select aria-label="Program preview" className="mt-1 block w-full rounded-xl border border-border bg-background p-2" value={selected} onChange={e=>setSelected(e.target.value)}>{boulderPrograms.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
  <div className="mt-4" aria-live="polite"><h3 className="font-medium">{program.name}</h3><p className="mt-1 text-xs text-muted">{program.scope}</p><p className="mt-2 text-sm text-muted">{program.note}</p><SourceStatus sourceId={program.sourceId}/>
   <ul className="mt-4 divide-y divide-border">{results.map(r=><li key={r.requirementId} className="py-3 text-sm"><details><summary className="cursor-pointer font-medium">{r.label}<span className="mt-1 block text-xs font-normal text-muted">{label[r.status]}</span></summary><dl className="mt-3 space-y-2 rounded-xl bg-background p-3 text-xs"><div><dt className="font-medium">Completed counted</dt><dd>{r.completedCourseIds.map(courseLabel).join(', ')||'None'}</dd></div><div><dt className="font-medium">Planned counted</dt><dd>{r.projectedCourseIds.map(courseLabel).join(', ')||'None'}</dd></div><div><dt className="font-medium">Catalog course choices</dt><dd className="text-muted">{ruleCourseIds(program.requirements.find(req=>req.id===r.requirementId)!.rule).map(courseLabel).join(', ')||'See official audit conditions below'}</dd></div><div><dt className="font-medium">Review notes</dt><dd className="text-muted">{r.notes.join(' · ')||'Category coverage only; other graduation conditions still apply.'}</dd></div></dl></details></li>)}</ul>
   <p className="mt-4 rounded-xl bg-soft p-3 text-xs text-muted">Planning aid, not an official degree audit. Some course metadata and approved lists are not loaded, so incomplete mappings stay visible. GPA, credit limits, residency and graduation need the full institutional audit.</p><Link className="mt-3 inline-block text-sm text-primary underline" href={`/explorer?q=${selected==='cub-philosophy-general'?'PHIL':selected==='cub-psychology'?'PSYC':'ASEN'}`}>Explore catalog courses by code</Link>
  </div>
 </section>;
}
export function BoulderTuition(){
 const t=boulderTuitionExample;
 const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
 return <section aria-label="Published CU Boulder tuition example" className="mt-8 rounded-2xl border border-border bg-surface p-5"><h2 className="font-serif text-2xl">CU Boulder: a published semester example</h2><p className="mt-2 text-sm text-muted">{t.period} · {t.scope}</p><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm font-medium">Base tier</dt><dd className="mt-1 text-sm">{money(t.baseBeforeCof)} before COF · {money(t.baseStudentShare)} published student share</dd></div><div><dt className="text-sm font-medium">Engineering tier</dt><dd className="mt-1 text-sm">{money(t.engineeringBeforeCof)} before COF · {money(t.engineeringStudentShare)} published student share</dd></div></dl><p className="mt-3 text-xs text-muted">{t.note}</p><SourceStatus sourceId={t.sourceId}/></section>;
}
