"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { z } from "zod";
import { sampleSemesters } from "@/data/sample";
import type { CourseStatus, PlanningScenario, Semester, StudentProfile } from "@/lib/types";
import { sortSemesters } from "@/lib/schedule";

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

const HISTORY_LIMIT = 50;

interface PlannerState {
  onboarded: boolean;
  profile: StudentProfile;
  semesters: Semester[];
  requiredCredits: number; // sample assumption until program data is imported
  tuitionPerCredit: Record<string, number | null>; // user-entered only
  scenarios: PlanningScenario[];
  costInputs: CostInputs;
  past: Semester[][];
  future: Semester[][];

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

const semesterSchema = z.object({
  id: z.string(),
  term: z.enum(["fall", "spring", "summer"]),
  year: z.number().int().min(2000).max(2100),
  institutionId: z.string(),
  courses: z.array(z.object({ id: z.string(), courseId: z.string(), status: z.enum(["planned", "in-progress", "completed"]) })),
});
const profileSchema = z.object({
  dream: z.string(),
  currentInstitutionId: z.string(),
  destinationInstitutionId: z.string(),
  major: z.string(),
  maxCreditsPerSemester: z.number().min(1).max(30),
  priorities: z.array(z.string()),
  completed: z.array(z.object({ courseId: z.string(), grade: z.string().optional(), kind: z.enum(["regular", "transfer", "ap-ib"]), verified: z.boolean() })),
});
export const exportSchema = z.object({
  app: z.literal("dream-helper"),
  version: z.literal(1),
  onboarded: z.boolean(),
  profile: profileSchema,
  semesters: z.array(semesterSchema),
  requiredCredits: z.number().positive(),
  tuitionPerCredit: z.record(z.string(), z.number().nullable()),
  scenarios: z.array(z.object({
    id: z.string(), name: z.string(), createdAt: z.string(),
    pathway: z.object({ id: z.string(), name: z.string(), major: z.string().optional(), semesters: z.array(semesterSchema) }),
  })).optional(),
  costInputs: z.object({
    residency: z.enum(["in-state", "out-of-state"]), feesPerSemester: z.number().min(0), booksPerSemester: z.number().min(0),
    housingPerSemester: z.number().min(0), livingPerSemester: z.number().min(0), aid: z.number().min(0),
    destSemesters: z.number().min(0), destCreditsPerSemester: z.number().min(0),
  }).optional(),
});

const uid = () => Math.random().toString(36).slice(2, 10);

export const usePlanner = create<PlannerState>()(
  persist(
    (set, get) => {
      /** Apply a semesters change and record undo history. */
      const commit = (next: Semester[]) =>
        set((s) => ({ semesters: next, past: [...s.past, s.semesters].slice(-HISTORY_LIMIT), future: [] }));
      const map = (fn: (s: Semester) => Semester) => commit(get().semesters.map(fn));

      return {
        onboarded: false,
        profile: defaultProfile,
        semesters: sampleSemesters,
        requiredCredits: 60,
        tuitionPerCredit: { frcc: null, cub: null },
        scenarios: [],
        costInputs: defaultCostInputs,
        past: [],
        future: [],

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
          if (!from || !item) return;
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
          set({ onboarded: false, profile: defaultProfile, semesters: sampleSemesters, requiredCredits: 60, tuitionPerCredit: { frcc: null, cub: null }, scenarios: [], costInputs: defaultCostInputs, past: [], future: [] }),
        exportJson: () => {
          const { onboarded, profile, semesters, requiredCredits, tuitionPerCredit, scenarios, costInputs } = get();
          return JSON.stringify({ app: "dream-helper", version: 1, onboarded, profile, semesters, requiredCredits, tuitionPerCredit, scenarios, costInputs }, null, 2);
        },
        importJson: (json) => {
          try {
            const d = exportSchema.parse(JSON.parse(json));
            set({ onboarded: d.onboarded, profile: d.profile, semesters: d.semesters, requiredCredits: d.requiredCredits, tuitionPerCredit: d.tuitionPerCredit, scenarios: d.scenarios ?? [], costInputs: d.costInputs ?? defaultCostInputs, past: [], future: [] });
            return { ok: true };
          } catch (e) {
            return { ok: false, error: e instanceof z.ZodError ? "This file isn't a valid Dream Helper export." : "Couldn't read that file as JSON." };
          }
        },
      };
    },
    {
      name: "dream-helper:v1",
      skipHydration: true,
      partialize: (s) => ({ onboarded: s.onboarded, profile: s.profile, semesters: s.semesters, requiredCredits: s.requiredCredits, tuitionPerCredit: s.tuitionPerCredit, scenarios: s.scenarios, costInputs: s.costInputs }),
    }
  )
);

/** Rehydrates from localStorage on the client; false during SSR/first paint to avoid mismatches. */
let hydrated = false;
export function useHydrated() {
  const [ready, setReady] = useState(hydrated);
  useEffect(() => {
    if (hydrated) return;
    Promise.resolve(usePlanner.persist.rehydrate()).then(() => {
      hydrated = true;
      setReady(true);
    });
  }, []);
  return ready;
}
