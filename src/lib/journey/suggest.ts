import { courses, requirementsForProfile, sourceById } from "@/data/sample";
import { cuDenverCmhc } from "@/data/programs";
import { nextOccurrence, upcomingFundingDates } from "@/data/funding";
import { stageOrder } from "@/data/pathways";
import { civilDay } from "@/lib/calendar";
import { cuTransferDeadlines, nextFallEntry, type EntryTerm } from "@/lib/deadlines";
import { evaluateRequirements } from "@/lib/requirements";
import { planContext } from "@/lib/plan-context";
import { prereqIssues, semesterLabel, sortSemesters } from "@/lib/schedule";
import type { Semester, StudentProfile } from "@/lib/types";
import { resolveGoal, type Goal } from "./goal";
import type { Basis, Suggestion } from "./types";

export interface SuggestContext { profile: StudentProfile; semesters: Semester[]; today: Date }

const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const basisOf = (sourceId: string): Basis => (sourceById(sourceId)?.status === "verified" ? "official" : "unverified");
const inDays = (n: number) => (n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`);

/** A real date within 30 days is the only thing treated as urgent. */
function dated(days: number, base: number): { priority: number; urgent: boolean } {
  return days <= 30 ? { priority: Math.max(1, days / 3), urgent: true } : { priority: base + Math.min(days, 365) / 365, urgent: false };
}

/**
 * Deterministic recommendations from verified data and what the student has told us.
 * Every item carries its reason, the goal it supports and the evidence behind it. No scores, no guesses.
 */
export function buildSuggestions({ profile, semesters, today }: SuggestContext): Suggestion[] {
  const goal = resolveGoal(profile);
  const out: Suggestion[] = [];
  const goalLabel = goal.path ? `${goal.career} route` : undefined;
  const todayDay = civilDay(today);
  const toCub = profile.destinationInstitutionId === "cub";

  if (!goal.path) {
    out.push({
      id: "rule:choose-goal", rule: "choose-goal", priority: 8, urgent: false,
      title: "Choose the dream your plan is working toward",
      why: "Your next steps, funding and route all connect to one goal. Pick a route in Colorado Dreams, or type your dream in your profile, and everything here will line up with it.",
      evidence: [{ label: "No goal selected yet", basis: "user" }],
      next: { label: "Browse dreams", href: "/paths" },
    });
  }

  // R1: the next unfinished step on the route, at or after the student's stage.
  if (goal.path) {
    const done = profile.careerStageProgress?.[`path:${goal.path.id}`] ?? [];
    const idx = stageOrder.indexOf(goal.stage);
    const step = goal.path.steps.find((s) => stageOrder.indexOf(s.stage) >= idx && !done.includes(s.id)) ?? goal.path.steps.find((s) => !done.includes(s.id));
    if (step) out.push({
      id: `rule:route-step:${goal.path.id}:${step.id}`, rule: "route-step", priority: 20, urgent: false, goalLabel,
      title: `Next on your ${goal.career} route: ${step.title}`,
      why: step.detail.length > 260 ? `${step.detail.slice(0, 257)}…` : step.detail,
      evidence: [{ label: `Route step ${goal.path.steps.indexOf(step) + 1} of ${goal.path.steps.length}`, basis: basisOf(step.sourceId), sourceId: step.sourceId }],
      next: { label: "Open this step", href: `/paths?path=${goal.path.id}&stage=${goal.stage}` },
    });
  }

  // R2: CU Boulder transfer application dates for the term the student plans to enter.
  if (toCub && goal.stage !== "high-school") {
    const destSem = sortSemesters(semesters).find((s) => s.institutionId === "cub");
    const term: EntryTerm = destSem?.term ?? "fall";
    const year = destSem?.year ?? nextFallEntry(today);
    const label = destSem ? semesterLabel(destSem) : `Fall ${year}`;
    const upcoming = cuTransferDeadlines(term, year)
      .map((d) => ({ d, days: Math.round(Date.UTC(+d.date.slice(0, 4), +d.date.slice(5, 7) - 1, +d.date.slice(8, 10)) / 86_400_000 - todayDay) }))
      .filter((x) => x.days >= 0)
      .sort((a, b) => a.days - b.days)
      .slice(0, 2);
    for (const { d, days } of upcoming) out.push({
      id: `rule:cub-transfer:${d.id}:${d.date}`, rule: "cub-transfer", ...dated(days, 12), goalLabel,
      title: `${d.label}: ${fmt(new Date(`${d.date}T12:00:00`))}`,
      why: `Your plan has you entering CU Boulder in ${label}. CU Boulder publishes this month and day but not the year, so confirm the date for your cycle. ${d.note ?? ""}`.trim(),
      evidence: [{ label: `CU Boulder Transfer Timeline (${inDays(days)})`, basis: basisOf("src-cub-transfer-timeline"), sourceId: "src-cub-transfer-timeline" }],
      next: { label: "Open the transfer timeline", href: "https://www.colorado.edu/admissions/transfer/timeline", external: true },
      dueDate: d.date,
    });

    // R7: transfer equivalencies are not loaded, so never assume them.
    out.push({
      id: "rule:confirm-equivalencies", rule: "equivalencies", priority: 18, urgent: false, goalLabel,
      title: "Ask CU Boulder which of your FRCC courses will transfer",
      why: "Dream Helper has no verified FRCC to CU Boulder course equivalencies loaded, so it doesn't assume any. FRCC says an associate degree usually leaves about 60 more credits, and your major's own requirements decide what counts.",
      evidence: [{ label: "No verified equivalency data loaded", basis: "unverified" }, { label: "FRCC transfer guides", basis: basisOf("src-frcc-transfer-guides"), sourceId: "src-frcc-transfer-guides" }],
      next: { label: "See FRCC transfer guides", href: "https://www.frontrange.edu/student-experience/transfer-planning/transfer-guides.html", external: true },
    });
  }

  // R3: CU Boulder financial aid and scholarship dates that matter to a transfer student.
  if (toCub && goal.stage !== "high-school") {
    const wanted = new Set(["cub-scholarship-open", "cub-fafsa-rec", "cub-transfer-scholarship"]);
    for (const f of upcomingFundingDates(today).filter((x) => wanted.has(x.id) && x.days <= 200).slice(0, 3)) out.push({
      id: `rule:funding-date:${f.id}:${isoDay(f.date)}`, rule: "funding-date", ...dated(f.days, 25), goalLabel,
      title: `${f.label}: ${fmt(f.date)}`,
      why: `${f.note ?? "A CU Boulder aid date."} This is the annual month and day from CU Boulder's published pages; confirm it for the year you apply.`,
      evidence: [{ label: `CU Boulder financial aid timeline (${inDays(f.days)})`, basis: basisOf(f.sourceId), sourceId: f.sourceId }],
      next: { label: "Open Funding & FAFSA", href: "/funding" },
      dueDate: isoDay(f.date),
    });
    out.push({
      id: "rule:first-gen-check", rule: "first-gen", priority: 45, urgent: false, goalLabel,
      title: "Find out whether you qualify for the CU Boulder First Generation Scholarship",
      why: "It's $4,000 per year for Colorado residents, for students whose parents did not earn a bachelor's degree and who have significant financial need. We don't know your parents' education, so we can't say whether you qualify.",
      evidence: [{ label: "Eligibility unknown: depends on information we don't have", basis: "unverified" }, { label: "CU Boulder scholarship page", basis: basisOf("src-cub-firstgen"), sourceId: "src-cub-firstgen" }],
      next: { label: "Read the requirements", href: "/funding" },
    });
  }

  // R5: Associate of Arts areas the plan doesn't cover yet.
  if (goal.stage !== "high-school") {
    const reqs = requirementsForProfile(profile);
    if (reqs.length) {
      const ctx = planContext(semesters, profile.completed);
      const gaps = evaluateRequirements(reqs, { courses, ...ctx }).filter((r) => r.status === "unsatisfied" || r.status === "uncertain").slice(0, 3);
      for (const g of gaps) out.push({
        id: `rule:requirement:${g.requirementId}`, rule: "requirement", priority: 30, urgent: false, goalLabel,
        title: g.status === "uncertain" ? `Double-check: ${g.label}` : `Plan a course for: ${g.label}`,
        why: g.status === "uncertain"
          ? `This FRCC Associate of Arts area can't be confirmed yet. ${g.notes.join(" ")}`.trim()
          : `Nothing in your roadmap covers this FRCC Associate of Arts area yet. ${g.notes.join(" ")}`.trim(),
        evidence: [{ label: "FRCC Associate of Arts requirements, 2026-27", basis: basisOf("src-frcc-aa-2627"), sourceId: "src-frcc-aa-2627" }],
        next: { label: "Open My Roadmap", href: "/roadmap" },
      });

      // R6: prerequisite order, with an honest note that some prerequisite data is assumed.
      const issues = prereqIssues(semesters, courses, profile.completed);
      if (issues.length) {
        const first = issues[0];
        const code = (id: string) => courses.find((c) => c.id === id)?.code ?? id;
        out.push({
          id: `rule:prereq-order:${first.courseId}`, rule: "prereq-order", priority: 22, urgent: false, goalLabel,
          title: `Check the order of ${code(first.courseId)} and ${first.missing.map(code).join(", ")}`,
          why: `${code(first.courseId)} is planned before ${first.missing.map(code).join(", ")}. Some prerequisite links in this app are assumptions, not catalog facts, so confirm it in the FRCC catalog before moving anything.${issues.length > 1 ? ` ${issues.length - 1} more course${issues.length > 2 ? "s have" : " has"} the same question.` : ""}`,
          evidence: [{ label: "Prerequisite data is partly unverified", basis: "unverified" }],
          next: { label: "Open My Roadmap", href: "/roadmap" },
        });
      }
    }
  }

  // R8: later deadlines for the counseling route, shown as looking ahead (never as urgent).
  if (goal.path?.id === "lpc-colorado") {
    const w = cuDenverCmhc.applicationWindows.find((x) => x.term === "Fall")!;
    const due = nextOccurrence(w.due.month, w.due.day, today);
    const days = civilDay(due) - todayDay;
    out.push({
      id: `rule:counseling-apps:${isoDay(due)}`, rule: "counseling-apps", priority: days <= 30 ? 3 : 50, urgent: days <= 30, goalLabel,
      title: `Looking ahead: CU Denver's counseling master's fall applications are due ${fmt(due)}`,
      why: "A CACREP-approved master's is where Colorado's counselor licensing rules begin. CU Denver's program requires three recommendation letters, transcripts, a written statement and a mandatory group interview in Denver. This is later than your transfer step; it's here so the dates are never a surprise.",
      evidence: [{ label: `CU Denver program page (${inDays(days)})`, basis: basisOf("src-cud-cmhc"), sourceId: "src-cud-cmhc" }, { label: "Colorado LPC rules, 4 CCR 737-1", basis: basisOf("src-co-lpc-rules"), sourceId: "src-co-lpc-rules" }],
      next: { label: "See counseling programs", href: `/paths?path=lpc-colorado&stage=graduate` },
      dueDate: isoDay(due),
    });
  }

  // R9: what we know depends on what the student reports.
  const hasProgress = semesters.some((s) => s.courses.some((c) => c.status !== "planned"));
  if (!profile.completed.length && !hasProgress && goal.stage !== "high-school") out.push({
    id: "rule:report-progress", rule: "report-progress", priority: 55, urgent: false, goalLabel,
    title: "Mark the courses you've already finished or are taking now",
    why: "Your progress, requirement checks and next steps only reflect what you report. Nothing is verified automatically, and nothing counts as completed until you say so.",
    evidence: [{ label: "Based on your own reporting", basis: "user" }],
    next: { label: "Open My Roadmap", href: "/roadmap" },
  });

  return out.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

export type { Goal };
