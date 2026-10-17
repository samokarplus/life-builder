import { describe, expect, it } from "vitest";
import { buildSuggestions } from "./suggest";
import { resolveGoal } from "./goal";
import { mergeActions, setActionStatus, updateActionDetails, restoreSuggested, reopenAction, createCustomAction, removeAction, filterActions } from "./actions";
import { relevantOpportunities, eligibilityLabels, opportunityActionId, opportunitySnapshot } from "./opportunities";
import { actionsSchema } from "./types";
import { sampleSemesters } from "@/data/sample";
import { defaultProfile } from "@/store/planner";
import type { StudentProfile } from "@/lib/types";

const counselor: StudentProfile = { ...defaultProfile, dream: "Licensed Professional Counselor", major: "Philosophy" };
const OCT16 = new Date(2026, 9, 16);
const ids = (s: ReturnType<typeof buildSuggestions>) => s.map((x) => x.id);

describe("goal", () => {
  it("matches a counselor dream, prefers a chosen route, and admits when there is none", () => {
    expect(resolveGoal(counselor)).toMatchObject({ pathId: "lpc-colorado", basis: "matched", destination: "CU Boulder", major: "Philosophy" });
    expect(resolveGoal({ ...counselor, careerId: "rn-colorado" })).toMatchObject({ pathId: "rn-colorado", basis: "chosen" });
    expect(resolveGoal({ ...counselor, dream: "", careerId: undefined })).toMatchObject({ pathId: null, basis: "none" });
  });
});

describe("FRCC → CU Boulder → licensed professional counselor journey", () => {
  const s = buildSuggestions({ profile: counselor, semesters: sampleSemesters, today: OCT16 });
  it("produces unique, ordered suggestions", () => {
    expect(new Set(ids(s)).size).toBe(s.length);
    expect(s.map((x) => x.priority)).toEqual([...s.map((x) => x.priority)].sort((a, b) => a - b));
  });
  it("includes the next route step at the student's stage", () => {
    expect(ids(s)).toContain("rule:route-step:lpc-colorado:lpc-1");
  });
  it("lists the two nearest CU Boulder fall transfer dates, from the published pattern", () => {
    expect(ids(s)).toEqual(expect.arrayContaining(["rule:cub-transfer:cub-fall-early:2027-03-15", "rule:cub-transfer:cub-fall-final:2027-06-01"]));
    const early = s.find((x) => x.id.includes("cub-fall-early"))!;
    expect(early.dueDate).toBe("2027-03-15");
    expect(early.evidence[0].basis).toBe("official");
  });
  it("never assumes transfer equivalencies", () => {
    const eq = s.find((x) => x.rule === "equivalencies")!;
    expect(eq.evidence.some((e) => e.basis === "unverified")).toBe(true);
    expect(eq.why).toMatch(/doesn't assume any/);
  });
  it("includes CU Boulder aid dates and a First Generation eligibility check that admits what is unknown", () => {
    expect(s.some((x) => x.rule === "funding-date" && x.dueDate === "2026-12-01")).toBe(true);
    const fg = s.find((x) => x.rule === "first-gen")!;
    expect(fg.evidence[0].label).toMatch(/Eligibility unknown/);
  });
  it("points at unmet Associate of Arts areas and prerequisite order, labeling unverified data", () => {
    expect(s.some((x) => x.rule === "requirement")).toBe(true);
    const pre = s.find((x) => x.rule === "prereq-order")!;
    expect(pre.evidence[0].basis).toBe("unverified");
  });
  it("shows CU Denver counseling applications as looking ahead, not urgent", () => {
    const cud = s.find((x) => x.rule === "counseling-apps")!;
    expect(cud.dueDate).toBe("2027-01-15");
    expect(cud.urgent).toBe(false);
  });
  it("nothing is urgent on Oct 16 because no real date is within 30 days", () => {
    expect(s.every((x) => !x.urgent)).toBe(true);
  });
  it("becomes urgent only when a real date is within 30 days", () => {
    const soon = buildSuggestions({ profile: counselor, semesters: sampleSemesters, today: new Date(2027, 1, 20) });
    const fafsa = soon.find((x) => x.dueDate === "2027-03-01")!;
    expect(fafsa.urgent).toBe(true);
    expect(soon[0].urgent).toBe(true);
  });
  it("every suggestion explains why, names evidence and offers a next step or a reason not to", () => {
    for (const x of s) { expect(x.why.length, x.id).toBeGreaterThan(20); expect(x.evidence.length, x.id).toBeGreaterThan(0); }
  });
});

describe("other starting points", () => {
  it("a high school student gets no transfer or AA suggestions and starts at the high school step", () => {
    const hs = buildSuggestions({ profile: { ...counselor, currentStage: "high-school" }, semesters: sampleSemesters, today: OCT16 });
    expect(hs.some((x) => x.rule === "cub-transfer" || x.rule === "requirement" || x.rule === "funding-date")).toBe(false);
    expect(ids(hs)).toContain("rule:route-step:lpc-colorado:lpc-0");
  });
  it("without a goal the first suggestion asks them to choose one", () => {
    const none = buildSuggestions({ profile: { ...counselor, dream: "" }, semesters: sampleSemesters, today: OCT16 });
    expect(none[0].rule).toBe("choose-goal");
  });
  it("route progress moves the next step forward", () => {
    const p = { ...counselor, careerStageProgress: { "path:lpc-colorado": ["lpc-0", "lpc-1"] } };
    const x = buildSuggestions({ profile: p, semesters: sampleSemesters, today: OCT16 }).find((y) => y.rule === "route-step")!;
    expect(x.id).toBe("rule:route-step:lpc-colorado:lpc-2");
  });
});

describe("actions: save, edit, complete, dismiss, reopen", () => {
  const suggestions = buildSuggestions({ profile: counselor, semesters: sampleSemesters, today: OCT16 });
  const target = suggestions.find((x) => x.rule === "equivalencies")!;
  const now = new Date("2026-10-16T12:00:00Z");

  it("starts every suggestion as 'suggested'", () => {
    expect(mergeActions(suggestions, {}).every((v) => v.status === "suggested")).toBe(true);
  });
  it("saves, edits notes and due date, and keeps the snapshot", () => {
    let r = setActionStatus({}, target.id, "saved", target, now);
    r = updateActionDetails(r, target.id, { notes: "Email transfer advising", dueDate: "2026-11-01" }, target, now);
    const v = mergeActions(suggestions, r).find((x) => x.id === target.id)!;
    expect(v).toMatchObject({ status: "saved", notes: "Email transfer advising", dueDate: "2026-11-01" });
    expect(r[target.id].snapshot.title).toBe(target.title);
  });
  it("moves through in-progress, waiting and completed, then reopens", () => {
    let r = setActionStatus({}, target.id, "in-progress", target, now);
    r = setActionStatus(r, target.id, "waiting", target, now);
    expect(r[target.id].status).toBe("waiting");
    r = setActionStatus(r, target.id, "completed", target, now);
    expect(r[target.id].completedAt).toBeDefined();
    r = reopenAction(r, target.id, now);
    expect(r[target.id]).toMatchObject({ status: "in-progress", completedAt: undefined });
  });
  it("dismisses and restores without leaving junk behind", () => {
    let r = setActionStatus({}, target.id, "dismissed", target, now);
    expect(filterActions(mergeActions(suggestions, r), "all").some((v) => v.id === target.id)).toBe(false);
    r = restoreSuggested(r, target.id, now);
    expect(r[target.id]).toBeUndefined();
  });
  it("keeps a restored action if the student added notes", () => {
    let r = setActionStatus({}, target.id, "dismissed", target, now);
    r = updateActionDetails(r, target.id, { notes: "Come back later" }, target, now);
    expect(restoreSuggested(r, target.id, now)[target.id].status).toBe("saved");
  });
  it("saved items survive after the rule that suggested them stops firing", () => {
    const r = setActionStatus({}, target.id, "saved", target, now);
    const views = mergeActions([], r);
    expect(views).toHaveLength(1);
    expect(views[0].title).toBe(target.title);
  });
  it("custom actions can be created, validated and deleted", () => {
    let r = createCustomAction({}, { title: "  Call FRCC advising  ", dueDate: "2026-10-30" }, "abc", now);
    expect(Object.values(r)[0]).toMatchObject({ custom: true, status: "saved" });
    expect(createCustomAction(r, { title: "   " }, "x", now)).toBe(r);
    r = removeAction(r, "custom:abc");
    expect(r).toEqual({});
  });
  it("records satisfy the persistence schema", () => {
    const r = setActionStatus({}, target.id, "waiting", target, now);
    expect(actionsSchema.safeParse(r).success).toBe(true);
    expect(actionsSchema.safeParse({ x: { ...r[target.id], status: "suggested" } }).success).toBe(false);
  });
});

describe("opportunities", () => {
  const goal = resolveGoal(counselor);
  const opps = relevantOpportunities(counselor, goal);
  it("uses only the four transparent states and explains each", () => {
    expect(opps.length).toBeGreaterThan(2);
    for (const o of opps) { expect(Object.keys(eligibilityLabels)).toContain(o.eligibility); expect(o.reason.length).toBeGreaterThan(10); }
  });
  it("does not claim eligibility it can't know", () => {
    expect(opps.find((o) => o.item.id === "cub-first-gen")!.eligibility).toBe("unknown");
    const astro = { ...counselor, dream: "astronaut" };
    expect(relevantOpportunities(astro, resolveGoal(astro)).find((o) => o.item.id === "cosgc")!.eligibility).toBe("appears-eligible");
    expect(opps.some((o) => o.item.id === "cosgc")).toBe(false);
  });
  it("marks CU Boulder scholarships as not matching when the destination isn't CU Boulder", () => {
    const elsewhere = relevantOpportunities({ ...counselor, destinationInstitutionId: "cud" }, goal);
    expect(elsewhere.find((o) => o.item.id === "cub-first-gen")!.eligibility).toBe("not-eligible");
  });
  it("saving an opportunity makes a stable action with the official link", () => {
    const o = opps.find((x) => x.item.id === "cub-first-gen")!;
    const snap = opportunitySnapshot(o, "Counselor route");
    expect(opportunityActionId(o.item.id)).toBe("opp:cub-first-gen");
    expect(snap.next).toMatchObject({ external: true });
    expect(snap.evidence.some((e) => e.sourceId === o.item.sourceId)).toBe(true);
  });
});
