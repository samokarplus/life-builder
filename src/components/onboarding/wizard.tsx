"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { courses, institutions } from "@/data/sample";
import { CourseSearch } from "@/components/ui/course-search";
import { defaultProfile, usePlanner } from "@/store/planner";
import { generatePlan } from "@/lib/schedule";
import type { CompletedCourse } from "@/lib/types";
import { cn } from "@/lib/utils";

const dreams = ["Therapist / Counselor", "Astronaut", "Nurse", "Doctor", "Teacher", "EMT / Paramedic", "Electrician", "Engineer", "Entrepreneur", "Software Developer", "Still Exploring"];
const priorityOptions = ["Lowest total cost", "Fastest graduation", "Balanced workload", "Mostly online", "Fewest campus days", "Career preparation"];
const majors = ["Philosophy", "Psychology", "Sociology", "Undecided"];
const titles = ["What would you love to do someday?", "Where are you starting?", "Where do you want to go?", "What have you completed?", "What matters most?", "Ready to map it out?"];

const field = "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm";

export function Wizard() {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const finish = usePlanner((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [dream, setDream] = useState("");
  const [unsure, setUnsure] = useState(false);
  const [program, setProgram] = useState("Associate of Arts");
  const [semester, setSemester] = useState("fall-2026");
  const [major, setMajor] = useState("Philosophy");
  const [degree, setDegree] = useState("Bachelor of Arts");
  const [completed, setCompleted] = useState<CompletedCourse[]>([]);
  const [otherCredits, setOtherCredits] = useState(0);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [maxCredits, setMaxCredits] = useState(15);
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [where, setWhere] = useState<"college" | "high-school">("college");

  const byId = new Map(courses.map((c) => [c.id, c]));
  const doneCredits = completed.reduce((n, c) => n + (byId.get(c.courseId)?.credits ?? 0), 0) + otherCredits;

  const next = () => {
    setError("");
    if (step === 0 && !unsure && !dream.trim()) return setError("Pick a card, write your own, or choose “I'm not sure yet.”");
    if (step === 3 && (!Number.isFinite(otherCredits) || otherCredits < 0 || otherCredits > 200)) return setError("Transfer/AP credits must be between 0 and 200.");
    if (step === 4 && (!Number.isInteger(maxCredits) || maxCredits < 3 || maxCredits > 24)) return setError("Choose between 3 and 24 credits per semester.");
    if (step === 4 && budget && (!Number.isFinite(Number(budget)) || Number(budget) < 0)) return setError("Budget must be a positive number.");
    setStep((s) => s + 1);
  };

  const generate = () => {
    const [term, y] = semester.split("-");
    const profile = { ...defaultProfile, currentStage: where, dream: unsure ? "Still exploring" : dream.trim(), major, priorities, maxCreditsPerSemester: maxCredits, completed, startingSemester: semester, program, desiredDegree: degree, budget: budget ? Number(budget) : null, unverifiedExternalCredits: otherCredits };
    try {
    const semesters = generatePlan(profile, courses, { term: term as "fall" | "spring", year: Number(y) });
    finish(profile, semesters);
    toast.success("Your roadmap is ready", { description: "Generated from sample catalog data. Assumptions are listed on your dashboard." });
    router.push("/overview");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not generate your plan. Please review your credit limit and prerequisites."); }
  };

  const card = (selected: boolean) => cn("rounded-2xl border p-4 text-left text-sm transition", selected ? "border-primary bg-soft text-primary" : "border-border bg-surface hover:border-sage");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
      <div className="mb-10 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-warm" role="progressbar" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step + 1} aria-label="Onboarding progress">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / 6) * 100}%` }} />
        </div>
        <span className="tabular text-xs text-muted">{step + 1} / 6</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: reducedMotion ? 0 : 24 }} animate={{ x: 0 }} exit={{ x: reducedMotion ? 0 : -24 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} className="flex-1">
          <h1 className="font-serif text-4xl">{titles[step]}</h1>

          {step === 0 && (
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dreams.map((d) => (
                  <button key={d} aria-pressed={!unsure && dream === d} onClick={() => { setDream(d); setUnsure(false); }} className={card(!unsure && dream === d)}>{d}</button>
                ))}
              </div>
              <input aria-label="Your own dream" className={field} placeholder="Or type your own…" value={dream} onChange={(e) => { setDream(e.target.value); setUnsure(false); }} />
              <button aria-pressed={unsure} onClick={() => setUnsure(!unsure)} className={cn(card(unsure), "w-full")}>I&apos;m not sure yet</button>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 space-y-4">
              <label className="block text-sm">Where are you right now?
                <select className={cn(field, "mt-1")} value={where} onChange={(e) => setWhere(e.target.value as "college" | "high-school")}>
                  <option value="college">In college at {institutions[0].name}</option>
                  <option value="high-school">In a Colorado high school</option>
                </select>
                <span className="mt-1 block text-xs text-muted">{where === "high-school" ? "Your roadmap starts at FRCC when you begin. FRCC offers college classes to public high school students; see Colorado Dreams after you finish." : "FRCC is the only college supported so far."}</span>
              </label>
              <label className="block text-sm">Degree program
                <select className={cn(field, "mt-1")} value={program} onChange={(e) => setProgram(e.target.value)}>
                  <option>Associate of Arts</option><option>Associate of Science</option><option>Not sure</option>
                </select>
              </label>
              <label className="block text-sm">{where === "high-school" ? "When will you start at FRCC?" : "Current semester"}
                <select className={cn(field, "mt-1")} value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="fall-2026">Fall 2026</option><option value="spring-2027">Spring 2027</option><option value="fall-2027">Fall 2027</option>
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-4">
              <label className="block text-sm">Transfer university
                <select className={cn(field, "mt-1")} disabled><option>{institutions[1].name}</option></select>
                <span className="mt-1 block text-xs text-muted">CU Boulder is the only destination supported so far.</span>
              </label>
              <div>
                <p className="mb-2 text-sm">Intended major</p>
                <div className="flex flex-wrap gap-2">
                  {majors.map((m) => <button key={m} aria-pressed={major === m} onClick={() => setMajor(m)} className={cn("rounded-full border px-4 py-1.5 text-sm", major === m ? "border-primary bg-soft text-primary" : "border-border bg-surface")}>{m}</button>)}
                </div>
              </div>
              <label className="block text-sm">Desired degree
                <select className={cn(field, "mt-1")} value={degree} onChange={(e) => setDegree(e.target.value)}><option>Bachelor of Arts</option><option>Bachelor of Science</option></select>
              </label>
              <p className="text-xs text-muted">Major requirement data for CU Boulder isn&apos;t loaded yet; your plan will cover the FRCC portion.</p>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-5">
              <CourseSearch exclude={completed.map((c) => c.courseId)} onPick={(c) => setCompleted([...completed, { courseId: c.id, kind: "regular", verified: false }])} />
              {completed.length > 0 && (
                <ul className="space-y-2">
                  {completed.map((c, i) => (
                    <li key={c.courseId} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                      <span className="tabular flex-1"><span className="font-medium text-primary">{byId.get(c.courseId)?.code}</span> {byId.get(c.courseId)?.title}</span>
                      <input aria-label="Grade (optional)" placeholder="Grade" maxLength={2} value={c.grade ?? ""} onChange={(e) => setCompleted(completed.map((x, j) => (j === i ? { ...x, grade: e.target.value.toUpperCase() } : x)))} className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-center text-xs" />
                      <button aria-label={`Remove ${byId.get(c.courseId)?.code}`} onClick={() => setCompleted(completed.filter((_, j) => j !== i))}><X size={14} /></button>
                    </li>
                  ))}
                </ul>
              )}
              <label className="block text-sm">Other transfer / AP / IB credits
                <input type="number" min={0} className={cn(field, "mt-1")} value={otherCredits} onChange={(e) => setOtherCredits(Number(e.target.value))} />
                <span className="mt-1 block text-xs text-muted">Saved separately as unverified. Not applied to requirements until specific course credit is reviewed.</span>
              </label>
              <p className="tabular rounded-xl bg-soft px-4 py-3 text-sm" role="status">{doneCredits} credits reported so far{otherCredits > 0 ? ` (${otherCredits} unverified)` : ""}</p>
            </div>
          )}

          {step === 4 && (
            <div className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((p) => {
                  const on = priorities.includes(p);
                  return <button key={p} aria-pressed={on} onClick={() => setPriorities(on ? priorities.filter((x) => x !== p) : [...priorities, p])} className={card(on)}>{p}</button>;
                })}
              </div>
              <label className="block text-sm">Maximum credits per semester
                <input type="number" className={cn(field, "mt-1")} value={maxCredits} onChange={(e) => setMaxCredits(Number(e.target.value))} />
              </label>
              <label className="block text-sm">Rough budget (optional, $)
                <input type="number" className={cn(field, "mt-1")} value={budget} onChange={(e) => setBudget(e.target.value)} />
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="mt-8 space-y-3 text-sm">
              <p>We&apos;ll arrange the courses in our sample catalog into semesters of up to {maxCredits} credits, keeping prerequisites in earlier terms.</p>
              <ul className="list-disc space-y-1 pl-5 text-muted">
                <li>Course data is an illustrative sample and has not been verified.</li>
                <li>Course availability by term is unknown and not checked.</li>
                <li>Transfer equivalencies to CU Boulder aren&apos;t loaded, so none are assumed.</li>
                <li>This is a planning aid, not an eligibility or degree audit.</li>
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p role="alert" className="mt-4 text-sm text-amber-700 dark:text-amber-400">{error}</p>}
      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="flex h-11 items-center gap-2 rounded-full px-5 text-sm hover:bg-soft disabled:invisible"><ArrowLeft size={15} /> Back</button>
        {step < 5 ? (
          <button onClick={next} className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Continue <ArrowRight size={15} /></button>
        ) : (
          <button onClick={generate} className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"><Sparkles size={15} /> Generate my roadmap</button>
        )}
      </div>
    </div>
  );
}
