"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Course, Semester } from "@/lib/types";
import { semesterCredits } from "@/lib/credits";
import { semesterLabel, type PrereqIssue } from "@/lib/schedule";
import { institutions } from "@/data/sample";
import { CourseCard } from "./course-card";
import { usePlanner } from "@/store/planner";
import { cn } from "@/lib/utils";

function SortableCard({ planned, course, issue }: { planned: Semester["courses"][number]; course: Course; issue?: PrereqIssue }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: planned.id });
  const { setStatus, removeCourse } = usePlanner();
  const byId = (id: string) => id.split(":")[1].replace("-", " ");
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <CourseCard
        planned={planned}
        course={course}
        missing={issue?.missing.map(byId)}
        dragging={isDragging}
        dragHandle={{ ...attributes, ...listeners }}
        onStatus={(s) => setStatus(planned.id, s)}
        onRemove={() => {
          removeCourse(planned.id);
        }}
      />
    </div>
  );
}

export function SemesterColumn({
  semester, catalog, issues, tuition, wide, onAdd, onEdit, onDelete,
}: {
  semester: Semester; catalog: Map<string, Course>; issues: PrereqIssue[]; tuition: number | null | undefined; wide?: boolean;
  onAdd: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: semester.id });
  const credits = semesterCredits(semester, [...catalog.values()]);
  const max = usePlanner(s=>s.profile.maxCreditsPerSemester);
  const inst = institutions.find((i) => i.id === semester.institutionId);
  return (
    <section aria-label={semesterLabel(semester)} className={cn("rounded-[14px] bg-soft/60 p-3", wide ? "w-full" : "w-full min-w-0")}>
      <header className="mb-3 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">{semesterLabel(semester)}</h3>
          <p className="text-xs text-muted">{inst?.shortName}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="tabular mr-1 text-right text-xs text-muted">
            <span className="block font-medium text-foreground">{credits} cr</span>
            {tuition != null ? <span>~${(credits * tuition).toLocaleString()}</span> : <span title="Add a tuition rate in Settings">cost: n/a</span>}
          </span>
          <button onClick={onEdit} aria-label={`Edit ${semesterLabel(semester)}`} className="rounded p-1 text-muted hover:bg-surface"><Pencil size={14} /></button>
          <button onClick={onDelete} aria-label={`Delete ${semesterLabel(semester)}`} className="rounded p-1 text-muted hover:bg-surface"><Trash2 size={14} /></button>
        </div>
      </header>
      {credits>max&&<p role="status" className="mb-2 rounded-lg border border-amber-500/40 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">{credits} credits · {credits-max} over your limit</p>}
      <div ref={setNodeRef} data-testid={`drop-${semester.id}`} className={cn("flex min-h-16 flex-col gap-2 rounded-xl p-1 transition", isOver && "bg-sage/30")}>
        <SortableContext items={semester.courses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {semester.courses.map((p) => {
            const c = catalog.get(p.courseId);
            return c ? <SortableCard key={p.id} planned={p} course={c} issue={issues.find((i) => i.plannedId === p.id)} /> : null;
          })}
        </SortableContext>
        {semester.courses.length === 0 && <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">Drop a course here or add one.</p>}
      </div>
      <button onClick={onAdd} className="mt-2 flex h-9 w-full items-center justify-center gap-1 rounded-lg text-sm text-muted hover:bg-surface hover:text-foreground">
        <Plus size={15} aria-hidden /> Add course
      </button>
    </section>
  );
}
