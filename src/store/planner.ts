"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { z } from "zod";
import { sampleSemesters } from "@/data/sample";
import type { CourseStatus, PlanningScenario, Semester, StudentProfile } from "@/lib/types";
import { sortSemesters } from "@/lib/schedule";
import type { ActionRecords, ActionStatus, Snapshot } from "@/lib/journey/types";
import { createCustomAction, removeAction, reopenAction, restoreSuggested, setActionStatus, updateActionDetails } from "@/lib/journey/actions";

export const defaultProfile: StudentProfile = {
  dream: "",
  currentInstitutionId: "frcc",
  destinationInstitutionId: "cub",
  major: "Philosophy",
  maxCreditsPerSemester: 15,
  priorities: [],
  completed: [],
};

export interface CostInputs {
  residency: "in-state" | "out-of-state";
  feesPerSemester: number;
  booksPerSemester: number;
  housingPerSemester: number;
  livingPerSemester: number;
  aid: number;
  destSemesters: number;
  destCreditsPerSemester: number;
}
export const defaultCostInputs: CostInputs = { residency: "in-state", feesPerSemester: 0, booksPerSemester: 0, housingPerSemester: 0, livingPerSemester: 0, aid: 0, destSemesters: 4, destCreditsPerSemester: 15 };

import { plannerStorage, hydrationFailed } from "@/lib/persistence";

const HISTORY_LIMIT = 50;

interface PlannerState {
  roadmapView: "board" | "timeline" | "graph";
  setRoadmapView: (view: "board" | "timeline" | "graph") => void;
  onboarded: boolean;
  profile: StudentProfile;
  semesters: Semester[];
  requiredCredits: number; // FRCC AA = 60 per the 2026-27 catalog; user-editable
  tuitionPerCredit: Record<string, number | null>; // user-entered only
  scenarios: PlanningScenario[];
  actions: ActionRecords;
  costInputs: CostInputs;
  past: Semester[][];
  future: Semester[][];

  setActionStatus: (id: string, status: Exclude<ActionStatus, "suggested">, snapshot: Snapshot) => void;
  updateAction: (id: string, patch: Parameters<typeof updateActionDetails>[2], snapshot: Snapshot) => void;
  restoreAction: (id: string) => void;
  reopenAction: (id: string) => void;
  addCustomAction: (input: { title: string; notes?: string; dueDate?: string; goalLabel?: string; goalId?: string }) => void;
  deleteAction: (id: string) => void;
  setCostInputs: (c: Partial<CostInputs>) => void;
  saveScenario: (name: string, semesters?: Semester[], major?: string) => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  setProfile: (p: Partial<StudentProfile>) => void;
  completeOnboarding: (profile: StudentProfile, semesters: Semester[]) => void;
  setTuition: (institutionId: string, v: number | null) => void;
  setRequiredCredits: (n: number) => void;

  moveCourse: (plannedId: string, toSemesterId: string, index: number) => void;
  addCourse: (semesterId: string, courseId: string) => void;
  removeCourse: (plannedId: string) => void;
  setStatus: (plannedId: string, status: CourseStatus) => void;
  addSemester: (s: Pick<Semester, "term" | "year" | "institutionId">) => boolean;
  editSemester: (id: string, s: Pick<Semester, "term" | "year" | "institutionId">) => boolean;
  removeSemester: (id: string) => void;
  undo: () => void;
  redo: () => void;
  resetToSample: () => void;
  exportJson: () => string;
  importJson: (json: string) => { ok: true } | { ok: false; error: string };
}

export { profileSchema, exportSchema } from "@/lib/plan-schema";
import { validatedExportSchema as exportSchema } from "@/lib/plan-schema";

const uid = () => Math.random().toString(36).slice(2, 10);

export const usePlanner = create<PlannerState>()(
  persist(
    (set, get) => {
      /** Apply a semesters change and record undo history. */
      const commit = (next: Semester[]) =>
        set((s) => ({ semesters: next, past: [...s.past, s.semesters].slice(-HISTORY_LIMIT), future: [] }));
      const map = (fn: (s: Semester) => Semester) => commit(get().semesters.map(fn));

      return {
        roadmapView: "board",
        setRoadmapView: (roadmapView) => set({ roadmapView }),
        onboarded: false,
        profile: defaultProfile,
        semesters: sampleSemesters,
        requiredCredits: 60,
        tuitionPerCredit: { frcc: null, cub: null },
        scenarios: [],
        actions: {},
        costInputs: defaultCostInputs,
        past: [],
        future: [],

        setActionStatus: (id, status, snapshot) => set((s) => ({ actions: setActionStatus(s.actions, id, status, snapshot, new Date()) })),
        updateAction: (id, patch, snapshot) => set((s) => ({ actions: updateActionDetails(s.actions, id, patch, snapshot, new Date()) })),
        restoreAction: (id) => set((s) => ({ actions: restoreSuggested(s.actions, id, new Date()) })),
        reopenAction: (id) => set((s) => ({ actions: reopenAction(s.actions, id, new Date()) })),
        addCustomAction: (input) => set((s) => ({ actions: createCustomAction(s.actions, input, uid(), new Date()) })),
        deleteAction: (id) => set((s) => ({ actions: removeAction(s.actions, id) })),
        setCostInputs: (c) => set((s) => ({ costInputs: { ...s.costInputs, ...c } })),
        saveScenario: (name, semesters, major) =>
          set((s) => ({
            scenarios: [...s.scenarios, {
              id: `sc-${uid()}`, name, createdAt: new Date().toISOString(),
              pathway: { id: `pw-${uid()}`, name, semesters: structuredClone(semesters ?? s.semesters), major: major ?? s.profile.major },
            }],
          })),
        loadScenario: (id) => {
          const sc = get().scenarios.find((x) => x.id === id);
          if (!sc) return;
          commit(structuredClone(sc.pathway.semesters));
          set((s) => ({ profile: { ...s.profile, major: sc.pathway.major ?? s.profile.major } }));
        },
        deleteScenario: (id) => set((s) => ({ scenarios: s.scenarios.filter((x) => x.id !== id) })),
        setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
        completeOnboarding: (profile, semesters) => set({ onboarded: true, profile, semesters, past: [], future: [] }),
        setTuition: (id, v) => set((s) => ({ tuitionPerCredit: { ...s.tuitionPerCredit, [id]: v } })),
        setRequiredCredits: (n) => set({ requiredCredits: n }),

        moveCourse: (plannedId, toId, index) => {
          const cur = get().semesters;
          const from = cur.find((s) => s.courses.some((c) => c.id === plannedId));
          const item = from?.courses.find((c) => c.id === plannedId);
          if (!from || !item || !cur.some(s=>s.id===toId)) return;
          const without = cur.map((s) => (s.id === from.id ? { ...s, courses: s.courses.filter((c) => c.id !== plannedId) } : s));
          const next = without.map((s) => {
            if (s.id !== toId) return s;
            const list = [...s.courses];
            list.splice(Math.min(index, list.length), 0, item);
            return { ...s, courses: list };
          });
          commit(next);
        },
        addCourse: (semesterId, courseId) =>
          map((s) => (s.id === semesterId ? { ...s, courses: [...s.courses, { id: `pc-${uid()}`, courseId, status: "planned" }] } : s)),
        removeCourse: (plannedId) => map((s) => ({ ...s, courses: s.courses.filter((c) => c.id !== plannedId) })),
        setStatus: (plannedId, status) =>
          map((s) => ({ ...s, courses: s.courses.map((c) => (c.id === plannedId ? { ...c, status } : c)) })),
        addSemester: (x) => {
          if (get().semesters.some((s) => s.term === x.term && s.year === x.year)) return false;
          commit(sortSemesters([...get().semesters, { ...x, id: `s-${uid()}`, courses: [] }]));
          return true;
        },
        editSemester: (id, x) => {
          if (get().semesters.some((s) => s.id !== id && s.term === x.term && s.year === x.year)) return false;
          commit(sortSemesters(get().semesters.map((s) => (s.id === id ? { ...s, ...x } : s))));
          return true;
        },
        removeSemester: (id) => commit(get().semesters.filter((s) => s.id !== id)),
        undo: () =>
          set((s) => {
            const prev = s.past.at(-1);
            return prev ? { semesters: prev, past: s.past.slice(0, -1), future: [s.semesters, ...s.future] } : s;
          }),
        redo: () =>
          set((s) => {
            const nxt = s.future[0];
            return nxt ? { semesters: nxt, past: [...s.past, s.semesters], future: s.future.slice(1) } : s;
          }),
        resetToSample: () =>
          set({ onboarded: false, profile: defaultProfile, semesters: sampleSemesters, requiredCredits: 60, tuitionPerCredit: { frcc: null, cub: null }, scenarios: [], actions: {}, costInputs: defaultCostInputs, past: [], future: [] }),
        exportJson: () => {
          const { onboarded, profile, semesters, requiredCredits, tuitionPerCredit, scenarios, actions, costInputs, roadmapView } = get();
          return JSON.stringify({ app: "dream-helper", version: 2, onboarded, profile, semesters, requiredCredits, tuitionPerCredit, scenarios, actions, costInputs, roadmapView }, null, 2);
        },
        importJson: (json) => {
          try {
            const d = exportSchema.parse(JSON.parse(json));
            set({ roadmapView: d.roadmapView ?? "board", onboarded: d.onboarded, profile: d.profile, semesters: d.semesters, requiredCredits: d.requiredCredits, tuitionPerCredit: d.tuitionPerCredit, scenarios: d.scenarios ?? [], actions: d.actions ?? {}, costInputs: d.costInputs ?? defaultCostInputs, past: [], future: [] });
            return { ok: true };
          } catch (e) {
            return { ok: false, error: e instanceof z.ZodError ? "This file isn't a valid Dream Helper export." : "Couldn't read that file as JSON." };
          }
        },
      };
    },
    {
      name: "dream-helper:v1",
      version: 2,
      storage: createJSONStorage(() => plannerStorage),
      migrate: (state, version) => {
        if (![0, 1, 2].includes(version)) throw new Error("Unsupported saved-plan version; preserve the original backup.");
        return migratePlan(state);
      },
      merge: (persisted, current) => ({ ...current, ...migratePlan(persisted) }),
      skipHydration: true,
      onRehydrateStorage: () => (_, error) => { if (error) hydrationFailed(); },
      partialize: (s) => ({ roadmapView: s.roadmapView, onboarded: s.onboarded, profile: s.profile, semesters: s.semesters, requiredCredits: s.requiredCredits, tuitionPerCredit: s.tuitionPerCredit, scenarios: s.scenarios, actions: s.actions, costInputs: s.costInputs }),
    }
  )
);

/** Validates v1/v2 persisted state and fills only new fields, preserving all user choices. */
export function migratePlan(state: unknown): Partial<z.infer<typeof exportSchema>> {
  if (state == null) return {};
  z.object({ app: z.literal("dream-helper").optional(), version: z.union([z.literal(1), z.literal(2)]).optional() }).parse(state);
  const d = exportSchema.parse({ ...(state as object), app: "dream-helper", version: 2 });
  return { ...d, roadmapView: d.roadmapView ?? "board", scenarios: d.scenarios ?? [], actions: d.actions ?? {}, costInputs: d.costInputs ?? defaultCostInputs };
}

/** Rehydrates from IndexedDB on the client; false during SSR/first paint to avoid mismatches. */
let hydrated = false;
let hydration: Promise<void> | undefined;
export function useHydrated() {
  const [ready, setReady] = useState(hydrated);
  useEffect(() => {
    if (hydrated) return;
    (hydration ??= Promise.resolve(usePlanner.persist.rehydrate())).then(() => {
      hydrated = true;
      setReady(true);
    });
  }, []);
  return ready;
}
