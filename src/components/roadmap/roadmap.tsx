"use client";

import { useMemo, useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Columns3, ListTree, Plus, Redo2, Undo2 } from "lucide-react";
import { courses } from "@/data/sample";
import { prereqIssues, semesterLabel, sortSemesters } from "@/lib/schedule";
import type { Semester } from "@/lib/types";
import { usePlanner } from "@/store/planner";
import { Modal } from "@/components/ui/modal";
import { CourseSearch } from "@/components/ui/course-search";
import { CourseCard } from "./course-card";
import { SemesterColumn } from "./semester-column";
import { institutions } from "@/data/sample";
import { cn } from "@/lib/utils";

type Layout = "timeline" | "board";
type SemForm = { id?: string; term: Semester["term"]; year: number; institutionId: string };

export function Roadmap() {
  const store = usePlanner();
  const { semesters, profile, tuitionPerCredit } = store;
  const [layout, setLayout] = useState<Layout>("board");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addTo, setAddTo] = useState<string | null>(null);
  const [form, setForm] = useState<SemForm | null>(null);
  const [formError, setFormError] = useState("");

  const catalog = useMemo(() => new Map(courses.map((c) => [c.id, c])), []);
  const sorted = sortSemesters(semesters);
  const issues = prereqIssues(semesters, courses, profile.completed);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
  const deleteSemester = (s: Semester) => {
    const n = s.courses.length;
    if (n && !window.confirm(`Delete ${semesterLabel(s)} and remove its ${n} course${n > 1 ? "s" : ""} from your plan? You can undo this.`)) return;
    store.removeSemester(s.id);
    toast(`${semesterLabel(s)} deleted`, { action: { label: "Undo", onClick: () => usePlanner.getState().undo() } });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="View" className="flex rounded-full border border-border bg-surface p-0.5">
          {([["timeline", "Timeline", ListTree], ["board", "Board", Columns3]] as const).map(([k, label, Icon]) => (
            <button key={k} onClick={() => setLayout(k)} aria-pressed={layout === k}
              className={cn("flex h-8 items-center gap-1.5 rounded-full px-3 text-sm", layout === k ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground")}>
              <Icon size={14} aria-hidden /> {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={store.undo} disabled={!store.past.length} aria-label="Undo" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm hover:bg-soft disabled:opacity-40"><Undo2 size={15} /> Undo</button>
          <button onClick={store.redo} disabled={!store.future.length} aria-label="Redo" className="flex h-9 items-center gap-1 rounded-full px-3 text-sm hover:bg-soft disabled:opacity-40"><Redo2 size={15} /> Redo</button>
          <button onClick={() => openForm()} className="flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"><Plus size={15} /> Add semester</button>
        </div>
      </div>

      {issues.length > 0 && (
        <p className="mb-4 rounded-xl bg-soft px-4 py-3 text-sm" role="status">
          {issues.length} course{issues.length > 1 ? "s have" : " has"} a prerequisite that isn&apos;t finished earlier. They&apos;re highlighted below — nothing was changed for you.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
        <div className={cn(layout === "board" ? "flex items-start gap-4 overflow-x-auto pb-4" : "mx-auto flex max-w-2xl flex-col gap-4 border-l-2 border-sage/50 pl-4")}>
          {sorted.map((s) => (
            <SemesterColumn key={s.id} semester={s} catalog={catalog} issues={issues} wide={layout === "timeline"}
              tuition={tuitionPerCredit[s.institutionId]}
              onAdd={() => setAddTo(s.id)} onEdit={() => openForm(s)} onDelete={() => deleteSemester(s)} />
          ))}
        </div>
        <DragOverlay>
          {active && catalog.get(active.courseId) ? <CourseCard planned={active} course={catalog.get(active.courseId)!} onStatus={() => {}} onRemove={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

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
