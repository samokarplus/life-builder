"use client";
import { useState } from "react";
import { toast } from "sonner";
import { institutions } from "@/data/sample";
import { usePlanner, profileSchema } from "@/store/planner";
import { PRIORITIES } from "@/lib/profile";
export function ProfileForm() {
  const { profile, setProfile } = usePlanner();
  const [draft,setDraft]=useState({...profile,startingSemester:profile.startingSemester??"fall-2026"});
  const [error,setError]=useState("");
  const input="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm";
  const patch=(p:Partial<typeof draft>)=>setDraft({...draft,...p});
  const save=(e:React.FormEvent)=>{
    e.preventDefault();const result=profileSchema.safeParse(draft);
    if(!result.success||!draft.major.trim())return setError("Enter a major and valid credit limit (1–30), semester, and nonnegative budget.");
    setProfile({...result.data,dream:draft.dream.trim(),major:draft.major.trim()});setError("");toast.success("Profile saved",{description:"Your existing course choices are preserved. Review the roadmap for new conflicts."});
  };
  return <form onSubmit={save} className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
    <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">A plan that fits your life</p><h2 className="mt-2 font-serif text-2xl">Your starting point & direction</h2><p className="mt-2 text-sm text-muted">These are your preferences. Updating them never silently moves courses or verifies a requirement.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-1 text-sm">Current starting point<select className={input} value={draft.currentStage ?? "college"} onChange={e=>patch({currentStage:e.target.value as "high-school" | "college"})}><option value="high-school">High school</option><option value="college">College / exploring college</option></select></label>
      <label className="space-y-1 text-sm">Dream career<input className={input} value={draft.dream} onChange={e=>patch({dream:e.target.value})}/></label>
      <label className="space-y-1 text-sm">Intended major<input required className={input} value={draft.major} onChange={e=>patch({major:e.target.value})}/></label>
      <label className="space-y-1 text-sm">Current institution<select className={input} value={draft.currentInstitutionId} onChange={e=>patch({currentInstitutionId:e.target.value})}>{institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
      <label className="space-y-1 text-sm">Destination institution<select className={input} value={draft.destinationInstitutionId} onChange={e=>patch({destinationInstitutionId:e.target.value})}>{institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
      <label className="space-y-1 text-sm">Starting semester<input className={input} value={draft.startingSemester??"fall-2026"} placeholder="fall-2026" onChange={e=>patch({startingSemester:e.target.value})}/></label>
      <label className="space-y-1 text-sm">Degree program<input className={input} value={draft.program??""} placeholder="Your program (user-entered)" onChange={e=>patch({program:e.target.value})}/></label>
      <label className="space-y-1 text-sm">Desired degree<input className={input} value={draft.desiredDegree??""} onChange={e=>patch({desiredDegree:e.target.value})}/></label>
      <label className="space-y-1 text-sm">Max credits per semester<input required min={1} max={30} step={1} type="number" className={input} value={draft.maxCreditsPerSemester} onChange={e=>patch({maxCreditsPerSemester:Number(e.target.value)})}/></label>
      <label className="space-y-1 text-sm">Total budget ($, user-entered)<input min={0} type="number" className={input} value={draft.budget??""} placeholder="Not set" onChange={e=>patch({budget:e.target.value===""?null:Number(e.target.value)})}/></label>
    </div>
    <fieldset><legend className="mb-3 text-sm font-medium">What matters most?</legend><p className="mb-3 text-xs text-muted">The first selected priority leads comparison messages.</p><div className="flex flex-wrap gap-2">{PRIORITIES.map(p=><button key={p} type="button" aria-pressed={draft.priorities.includes(p)} onClick={()=>patch({priorities:draft.priorities.includes(p)?draft.priorities.filter(x=>x!==p):[...draft.priorities,p]})} className={`rounded-full border px-3 py-2 text-sm ${draft.priorities.includes(p)?"border-primary bg-soft text-primary":"border-border hover:bg-soft"}`}>{p}</button>)}</div></fieldset>
    {(draft.unverifiedExternalCredits??0)>0&&<p className="rounded-xl bg-soft p-3 text-sm">{draft.unverifiedExternalCredits} external credits reported separately. These are unverified and are not applied to course requirements.</p>}
    {draft.currentInstitutionId===draft.destinationInstitutionId&&<p className="text-sm text-amber-800 dark:text-amber-300">Both institutions are the same. Your choice is kept; choose a different destination if you intend to transfer.</p>}
    {error&&<p role="alert" className="text-sm text-amber-800 dark:text-amber-300">{error}</p>}<button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Save profile</button>
  </form>;
}
