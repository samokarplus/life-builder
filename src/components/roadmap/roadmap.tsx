"use client";
import { useConfirm } from "@/components/ui/confirmation";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors, type DragEndEvent, type DragStartEvent, type KeyboardCoordinateGetter } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import Link from "next/link";
import { Columns3, ListTree, Network, Plus, Printer, Redo2, Undo2, Sun, Flag } from "lucide-react";
import { courses } from "@/data/sample";
import { creditWarnings, prerequisiteFix, nextSummer } from "@/lib/roadmap";
import { prereqIssues, semesterLabel, sortSemesters } from "@/lib/schedule";
import type { Semester } from "@/lib/types";
import { usePlanner } from "@/store/planner";
import { Modal } from "@/components/ui/modal";
import { CourseSearch } from "@/components/ui/course-search";
import { CourseCard } from "./course-card";
import { SemesterColumn } from "./semester-column";
import { institutions } from "@/data/sample";
import { cn } from "@/lib/utils";
import { DependencyGraph } from "./dependency-graph";
import { RequirementsPanel } from "./requirements-panel";

type SemForm = { id?: string; term: Semester["term"]; year: number; institutionId: string };

export function Roadmap() {
  const confirm = useConfirm();
  const store = usePlanner();
  // Cmd/Ctrl+Z undo, Shift+Cmd/Ctrl+Z or Ctrl+Y redo (never while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) { e.preventDefault(); usePlanner.getState().undo(); }
      else if ((k === "z" && e.shiftKey) || k === "y") { e.preventDefault(); usePlanner.getState().redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const { semesters, profile, tuitionPerCredit } = store;
  const layout = store.roadmapView;
  const setLayout = store.setRoadmapView;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addTo, setAddTo] = useState<string | null>(null);
  const [form, setForm] = useState<SemForm | null>(null);
  const [formError, setFormError] = useState("");

  const catalog = useMemo(() => new Map(courses.map((c) => [c.id, c])), []);
  const sorted = sortSemesters(semesters);
  const issues = prereqIssues(semesters, courses, profile.completed);
  const warnings = creditWarnings(semesters, courses, profile.maxCreditsPerSemester);
  const describeDrag = (id: string | number) => {
    const sem = semesters.find(s=>s.id===id || s.courses.some(p=>p.id===id));
    const pc = sem?.courses.find(p=>p.id===id);
    return pc ? `${catalog.get(pc.courseId)?.code ?? pc.courseId}, ${semesterLabel(sem!)}` : sem ? semesterLabel(sem) : "outside a semester";
  };
  const keyboardCoordinates: KeyboardCoordinateGetter = (event, args) => {
    if (event.code !== "ArrowRight" && event.code !== "ArrowLeft") return sortableKeyboardCoordinates(event, args);
    event.preventDefault();
    const { active, over, droppableRects } = args.context;
    if (!active) return;
    const currentId = over?.id ?? active.id;
    const current = sorted.findIndex(s=>s.id===currentId || s.courses.some(p=>p.id===currentId));
    const next = sorted[current + (event.code === "ArrowRight" ? 1 : -1)];
    if (!next) return;
    const rect = droppableRects.get(next.courses[0]?.id ?? next.id);
    return rect ? { x: rect.left, y: rect.top } : undefined;
  };
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates })
  );

  const active = activeId ? semesters.flatMap((s) => s.courses).find((c) => c.id === activeId) : null;

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const target = semesters.find((s) => s.id === over.id) ?? semesters.find((s) => s.courses.some((c) => c.id === over.id));
    if (!target) return;
    const idx = target.id === over.id ? target.courses.length : target.courses.findIndex((c) => c.id === over.id);
    const before = new Set(prereqIssues(semesters, courses, profile.completed).map((i) => i.plannedId));
    store.moveCourse(String(active.id), target.id, idx);
    const after = prereqIssues(usePlanner.getState().semesters, courses, profile.completed).filter((i) => !before.has(i.plannedId));
    if (after.length) {
      const i = after[0];
      const code = catalog.get(i.courseId)?.code;
      const need = i.missing.map((m) => catalog.get(m)?.code ?? m).join(", ");
      toast.warning(`${code} now comes before ${need}`, {
        description: `Prerequisites should be finished in an earlier term. You can keep this, move ${need} earlier, or undo.`,
        action: { label: "Undo", onClick: () => usePlanner.getState().undo() },
        duration: 9000,
      });
    }
  };

  const openForm = (s?: Semester) => {
    setFormError("");
    const last = sorted.at(-1);
    setForm(s ? { id: s.id, term: s.term, year: s.year, institutionId: s.institutionId } : { term: "summer", year: last?.year ?? new Date().getFullYear(), institutionId: profile.currentInstitutionId });
  };
  const submitForm = () => {
    if (!form) return;
    if (!Number.isInteger(form.year) || form.year < 2000 || form.year > 2100) return setFormError("Enter a year between 2000 and 2100.");
    const ok = form.id ? store.editSemester(form.id, form) : store.addSemester(form);
    if (!ok) return setFormError(`${semesterLabel(form)} already exists in your plan.`);
    toast.success(form.id ? "Semester updated" : `${semesterLabel(form)} added`);
    setForm(null);
  };
  const deleteSemester = async (s: Semester) => {
    const n = s.courses.length;
    if (n && !await confirm({ title: `Delete ${semesterLabel(s)}?`, description: `This removes its ${n} courses from your plan. You can undo this on the roadmap.`, action: "Delete semester" })) return;
    store.removeSemester(s.id);
    toast(`${semesterLabel(s)} deleted`, { action: { label: "Undo", onClick: () => usePlanner.getState().undo() } });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="View" className="flex rounded-full border border-border bg-surface p-0.5">
          {([["timeline", "Timeline", ListTree], ["board", "Board", Columns3], ["graph", "Dependencies", Network]] as const).map(([k, label, Icon]) => (
            <button key={k} onClick={() => setLayout(k)} aria-pressed={layout === k}
              className={cn("flex h-8 items-center gap-1.5 rounded-full px-3 text-sm", layout === k ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground")}>
              <Icon size={14} aria-hidden /> {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <button onClick={()=>{const summer=nextSummer(semesters,profile.currentInstitutionId); if(store.addSemester(summer)) toast.success(`${semesterLabel(summer)} added`);}} className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-sm"><Sun size={14}/> Summer semester</button>
          <Link href="/print" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm hover:bg-soft"><Printer size={15} aria-hidden /> Print</Link>
          <button onClick={store.undo} disabled={!store.past.length} aria-label="Undo" title="Undo (Ctrl/Cmd+Z)" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm hover:bg-soft disabled:opacity-40"><Undo2 size={15} /> Undo</button>
          <button onClick={store.redo} disabled={!store.future.length} aria-label="Redo" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm hover:bg-soft disabled:opacity-40"><Redo2 size={15} /> Redo</button>
          <button onClick={() => openForm()} className="flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"><Plus size={15} /> Add semester</button>
        </div>
      </div>

      {(issues.length>0 || warnings.length>0) && <section aria-label="Plan conflicts" className="mb-6 space-y-3 rounded-2xl border border-amber-500/30 bg-surface p-4">
        <h2 className="text-sm font-semibold">A few things to work through</h2><p className="text-xs text-muted">Your choices are kept as-is. These checks use illustrative data.</p>
        {warnings.map(w=><p key={w.semesterId} role="status" className="text-sm text-amber-800 dark:text-amber-300">{semesterLabel(semesters.find(s=>s.id===w.semesterId)!)}: {w.credits} credits exceeds your {w.maximum}-credit maximum by {w.excess}. Move a course or update your limit in Profile.</p>)}
        {issues.map(issue=><div key={issue.plannedId} className="border-t border-border pt-3 text-sm"><p><strong>{catalog.get(issue.courseId)?.code}</strong> needs {issue.missing.map(id=>catalog.get(id)?.code ?? id).join(", ")} in an earlier semester.</p><div className="mt-2 flex flex-wrap gap-2">{issue.missing.map(id=>{const fix=prerequisiteFix(id,issue.semesterId,semesters);return fix ? <button key={id} className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-soft" onClick={()=>{if(fix.plannedId) store.moveCourse(fix.plannedId,fix.targetId,0);else store.addCourse(fix.targetId,id);toast("Prerequisite moved earlier",{description:"Review any remaining prerequisite and credit-load warnings.",action:{label:"Undo",onClick:()=>usePlanner.getState().undo()}});}}>{fix.plannedId?"Move":"Add"} {catalog.get(id)?.code} earlier → {semesterLabel(semesters.find(s=>s.id===fix.targetId)!)}</button> : <span key={id} className="text-xs text-muted">Add an earlier semester to place {catalog.get(id)?.code}.</span>;})}</div></div>)}
      </section>}

      {layout === "graph" ? <DependencyGraph /> : (
      <DndContext accessibility={{screenReaderInstructions:{draggable:"To pick up a course, press Space. Use Left and Right for earlier and later semesters, and Up and Down to reorder courses. Press Space to drop, or Escape to cancel."},announcements:{onDragStart:({active})=>`Picked up ${describeDrag(active.id)}.`,onDragOver:({active,over})=>over?`${describeDrag(active.id)} is over ${describeDrag(over.id)}.`:"Outside a semester.",onDragEnd:({active,over})=>over?`Dropped ${describeDrag(active.id)} at ${describeDrag(over.id)}. Review the plan conflicts for prerequisite or credit warnings.`:"Move cancelled.",onDragCancel:()=>"Move cancelled. Course remains in its original semester."}}} sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
        <div className={cn(layout === "board" ? "grid min-w-0 items-start gap-4 pb-4 sm:grid-cols-2 xl:grid-cols-3" : "mx-auto flex max-w-3xl flex-col gap-6 border-l-2 border-sage/50 pl-4 sm:pl-8")}>
          {sorted.map((s) => (
            <div key={s.id} className="relative min-w-0">
            {layout==="timeline" && <><span className="absolute -left-[23px] top-5 h-3 w-3 rounded-full border-2 border-background bg-primary sm:-left-[39px]"/>{s.id===sorted.find(x=>x.institutionId===profile.destinationInstitutionId)?.id && <p className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><Flag size={14}/> Transfer milestone · planned, eligibility unverified</p>}</>}
            <SemesterColumn key={s.id} semester={s} catalog={catalog} issues={issues} wide={layout === "timeline"}
              tuition={tuitionPerCredit[s.institutionId]}
              onAdd={() => setAddTo(s.id)} onEdit={() => openForm(s)} onDelete={() => deleteSemester(s)} />
            </div>
          ))}
        </div>
        {layout==="timeline"&&sorted.length>0&&<p className="mx-auto mt-5 max-w-3xl rounded-xl border border-dashed border-sage p-4 text-sm"><Flag size={15} className="mr-2 inline text-primary"/> Graduation goal · {profile.desiredDegree ?? "Degree"}<span className="mt-1 block text-xs text-muted">Finish date unknown until official program, transfer and residency requirements are verified.</span></p>}
        <DragOverlay dropAnimation={{duration:180,easing:"ease-out"}}>
          {active && catalog.get(active.courseId) ? <div aria-hidden className="w-72 rotate-2 rounded-xl shadow-xl"><CourseCard overlay planned={active} course={catalog.get(active.courseId)!} onStatus={() => {}} onRemove={() => {}} /></div> : null}
        </DragOverlay>
      </DndContext>
      )}

      <RequirementsPanel />

      {sorted.length === 0 && <p className="py-16 text-center text-muted">No semesters yet. Add one to start planning.</p>}

      <Modal open={!!addTo} onClose={() => setAddTo(null)} title="Add a course">
        <CourseSearch autoFocus onPick={(c) => { store.addCourse(addTo!, c.id); toast.success(`${c.code} added`); setAddTo(null); }} />
        <p className="mt-3 text-xs text-muted">Sample catalog only. Confirm every course with your institution&apos;s official catalog.</p>
      </Modal>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit semester" : "Add a semester"}>
        {form && (
          <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="flex flex-col gap-4 text-sm">
            <label className="flex flex-col gap-1">Term
              <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value as Semester["term"] })} className="h-10 rounded-xl border border-border bg-background px-3">
                <option value="fall">Fall</option><option value="spring">Spring</option><option value="summer">Summer</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">Year
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="h-10 rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="flex flex-col gap-1">Institution
              <select value={form.institutionId} onChange={(e) => setForm({ ...form, institutionId: e.target.value })} className="h-10 rounded-xl border border-border bg-background px-3">
                {institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </label>
            {formError && <p role="alert" className="text-amber-700 dark:text-amber-400">{formError}</p>}
            <button type="submit" className="h-10 rounded-full bg-primary font-medium text-primary-foreground">{form.id ? "Save" : "Add semester"}</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
