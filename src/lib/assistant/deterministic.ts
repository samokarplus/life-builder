import { progress, semesterLabel } from "../schedule";
import { creditWarnings } from "../roadmap";
import { cuTransferDeadlines, nextFallEntry } from "../deadlines";
import type { AssistantProvider, AssistantContext } from "./provider";

const OFFICIAL = "I don't have verified data for that. Please check with your institution's advising office or official catalog.";

function graduate(q: string, c: AssistantContext) {
  const m = c.metrics;
  const match = q.match(/(spring|summer|fall)\s*(20\d\d)/i);
  if (!m.lastTerm) return "Your roadmap has no courses yet, so I can't project a finish date.";
  const base = `Your plan's last term with courses is ${m.lastTerm}, with ${m.remainingCredits} credits still planned or in progress.`;
  if (!match) return `${base} That's based only on your roadmap, not a degree audit.`;
  const target = `${match[1][0].toUpperCase()}${match[1].slice(1).toLowerCase()} ${match[2]}`;
  const key = (t: string) => { const [a, b] = t.split(" "); return Number(b) * 3 + ({ spring: 0, summer: 1, fall: 2 } as Record<string, number>)[a.toLowerCase()]; };
  return `${base} ${key(m.lastTerm) <= key(target) ? `That's on or before ${target}` : `That's after ${target}`}. Remember the plan hasn't been verified against official requirements, and major requirements for the destination aren't loaded.`;
}

export const deterministicProvider: AssistantProvider = {
  name: "Built-in (no AI key configured)",
  async answer(question, c) {
    const q = question.toLowerCase();
    if (/deadline|when (do|should|can) i apply|application date|apply (by|to)/.test(q)) {
      const year = nextFallEntry(new Date());
      const list = cuTransferDeadlines("fall", year).map((d) => `${d.label}: ${d.date}`).join("; ");
      return `CU Boulder's transfer timeline page gives these month and day deadlines (applied here to fall ${year} entry): ${list}. The page doesn't print the year, so confirm for your cycle. See Dream Paths for spring and summer entry.`;
    }
    if (/lpc|counselor|therapist|licensed professional/.test(q)) return "For a Licensed Professional Counselor in Colorado, Colorado's rules (4 CCR 737-1, effective 2025-09-14) call for a master's from a CACREP-approved program (60+ semester credits if enrolled after Aug 31, 2014), the NBCC national exam, the Colorado jurisprudence exam, candidate registration before you count hours, then at least 2,000 supervised hours (1,500 with clients) over at least 24 months, then a DORA application. Rules change, so confirm with DORA. See Dream Paths.";
    if (/astronaut|nasa|bioastro/.test(q)) return "NASA's page states: U.S. citizenship, a STEM master's (or listed alternatives), three years of related professional experience (or 1,000 pilot-in-command hours), and the long-duration astronaut physical. Applications open only when NASA needs a class. CU Boulder's Aerospace Engineering Sciences lists Bioastronautics as a research area; its page doesn't give graduate deadlines, so check the Graduate School page. See Dream Paths.";
    if (/priority|priorities|prefer/.test(q)) return `Your selected priorities: ${c.profile.priorities.join(", ") || "none selected"}. Your maximum is ${c.profile.maxCreditsPerSemester} credits per semester. Update these in Profile; existing course choices will be preserved.`;
    if (/overload|too many|load|maximum|lighter/.test(q)) { const warnings=creditWarnings(c.semesters,c.courses,c.profile.maxCreditsPerSemester);return warnings.length ? warnings.map(w=>`${semesterLabel(c.semesters.find(s=>s.id===w.semesterId)!)} has ${w.credits} credits, ${w.excess} over your ${w.maximum}-credit limit.`).join(" ")+" Move courses on the roadmap or change your limit in Profile." : `Every planned semester is within your ${c.profile.maxCreditsPerSemester}-credit limit. Course availability is unknown, check official sources.`; }
    if (/transfer|equivalen|ap.?ib|ap credit|ib credit/.test(q)) return "Transfer equivalencies and AP/IB acceptance are unknown, check official sources. Unverified credit remains uncertain and never confirms eligibility. Your reported external credit is kept separately from specific approved coursework.";
    if (/completed|earned|already done/.test(q)) {const p=progress(c.semesters,c.courses,c.profile.completed,Number.MAX_SAFE_INTEGER);return `${p.completed} illustrative credits are reported completed, ${p.inProgress} in progress, and ${p.planned} planned. Reported completion is distinct from official verification; check requirement drill-downs for grade and credit uncertainty.`;}
    if (/next|upcoming/.test(q)) { const s=c.semesters.find(s=>s.courses.some(p=>p.status==="planned")); return s ? `Your next planned courses in ${semesterLabel(s)}: ${s.courses.filter(p=>p.status==="planned").map(p=>c.courses.find(course=>course.id===p.courseId)?.code??p.courseId).join(", ")}. Availability is unknown, check official sources.`:"No upcoming courses are planned. Add courses to a semester on the roadmap."; }
    if (/graduat|finish|done by|summer 20|fall 20|spring 20/.test(q)) return graduate(question, c);
    if (/requirement|haven.t|not complete|missing|left/.test(q)) {
      const open = c.requirements.filter((r) => r.status === "unsatisfied" || r.status === "uncertain");
      if (!open.length) return "Every sample requirement is complete or on track in your plan. These are illustrative requirements, not an official audit.";
      return `Sample requirements not yet met: ${open.map((r) => `${r.label} (${r.status === "uncertain" ? "needs a check" : "not in plan"})`).join("; ")}. These are illustrative, not official.`;
    }
    if (/in-person|in person|online|campus/.test(q)) return "Course modality and availability by term aren't verified in my data, so I can't say which classes are in-person. " + OFFICIAL;
    if (/sav|cheap|cost|tuition|money/.test(q)) {
      const f = c.tuitionPerCredit.frcc, d = c.tuitionPerCredit.cub;
      if (f == null || d == null) return "I don't include verified tuition figures. Enter your own per-credit rates in Settings and I can compare FRCC vs CU Boulder for the credits in your plan.";
      return `With your entered rates ($${f}/credit at FRCC vs $${d}/credit at CU Boulder), each credit taken at FRCC costs $${Math.abs(d - f)} ${d >= f ? "less" : "more"}. That only counts if the course transfers, and I have no verified transfer equivalencies.`;
    }
    if (/psych|sociolog|switch|major|philosoph/.test(q)) return "Major requirement data for CU Boulder isn't loaded, so I can't tell you what switching majors changes. You can duplicate your plan under Compare Paths with a different major label, but the numbers will only change if the courses change.";
    if (/prereq/.test(q)) return c.prereqIssueCount ? `${c.prereqIssueCount} planned course${c.prereqIssueCount > 1 ? "s have" : " has"} a prerequisite that isn't finished earlier. They're highlighted on your roadmap.` : "No prerequisite conflicts found among the courses in your plan, based on the sample prerequisite data.";
    if (/credit|how many|progress/.test(q)) return `You have ${c.metrics.remainingCredits} credits planned or in progress across ${c.metrics.semesterCount} semesters, averaging ${c.metrics.avgLoad} credits per semester.`;
    return `I can help with: finishing dates, unmet requirements, prerequisites, credit counts, and costs from your own rates. ${OFFICIAL}`;
  },
};
