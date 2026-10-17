import { progress, semesterLabel, sortSemesters } from "../schedule";
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
    if (/fafsa|financial aid|scholarship|pay for|afford|funding/.test(q)) return "Start with the FAFSA (free, only at studentaid.gov). The 2027-28 form covers aid from July 1, 2027 to June 30, 2028, and the federal deadline is June 30, 2028, but CU Boulder recommends March 1 so you're considered for scholarships. Its scholarship application opens Dec. 1 and is due March 15 (June 15 for transfers). The First Generation Scholarship is $4,000 a year for Colorado residents. Colorado Space Grant and graduate fellowships like NSF GRFP and NASA NSTGRO are worth a look for the astronaut route; their amounts aren't loaded, so check each sponsor. See Funding & FAFSA.";
    if (/professor|faculty|advisor|who (works|teaches)|lab\b/.test(q)) return "CU Boulder's Bioastronautics faculty page lists Torin Clark, Allie Hayman, James Nabity, Katya Arquilla and others, with official profiles linked on Colorado Dreams. Their work spans astronaut biomedical issues, spacesuits and vision changes, life support and habitat design, and human-system interaction. Listings aren't a promise that someone is taking students; contact the groups through their official pages.";
    if (/deadline|apply/.test(q) && /graduate|master|phd|aerospace|bioastro/.test(q)) return "CU Aerospace graduate deadlines are Spring Oct. 1 and Fall Dec. 1; confirm your cycle on the department's Deadlines & Fees page. These differ from undergraduate transfer dates. See Colorado Dreams.";
    if (/deadline|apply/.test(q) && /lpc|licens|counsel|therap/.test(q)) return "Licensing application deadlines depend on your registration and exam dates: unknown, check official sources. See Colorado DORA and the Colorado Dreams licensing steps.";
    if (/deadline|when (do|should|can) i apply|application date|apply (by|to)/.test(q)) {
      const explicit = q.match(/(spring|summer|fall)\s*(20\d{2})?/);
      const term = (explicit?.[1] ?? "fall") as "spring" | "summer" | "fall";
      if(explicit && !explicit[2]) return "Which entry year? Spring deadlines fall in October of the previous year; summer and fall dates depend on your chosen cycle. See Colorado Dreams.";
      const year = explicit?.[2] ? Number(explicit[2]) : nextFallEntry(new Date());
      const list = cuTransferDeadlines(term, year).map((d) => `${d.label}: ${d.date}`).join("; ");
      return `CU Boulder's transfer timeline page gives these month and day deadlines (applied here to ${term} ${year} entry): ${list}. The year is a planning assumption; confirm against your official application cycle. See Dream Paths for spring and summer entry.`;
    }
    if (/lpc|counselor|therapist|licensed professional/.test(q)) return "For a Licensed Professional Counselor in Colorado, Colorado's rules (4 CCR 737-1, effective 2025-09-14) allow a counseling master's or doctorate through CACREP (60+ semester credits if enrolled after Aug 31, 2014) or a Board-approved equivalency route, the NBCC national exam, the Colorado jurisprudence exam, candidate registration or another permitted status before you count hours, then at least 2,000 supervised hours (1,500 with clients) over at least 24 months, then a DORA application. Rules change, so confirm with DORA. See Dream Paths.";
    if (/astronaut|nasa|bioastro/.test(q)) return "NASA's page states: U.S. citizenship, a STEM master's (or listed alternatives), three years of related professional experience (or 1,000 pilot-in-command hours, at least 850 in high-performance jets), and the long-duration astronaut physical. Applications open only when NASA needs a class. CU Boulder's Aerospace Engineering Sciences lists Bioastronautics as a research area; its page doesn't give graduate deadlines, so check the Graduate School page. See Dream Paths.";
    if (/priority|priorities|prefer/.test(q)) return `Your selected priorities: ${c.profile.priorities.join(", ") || "none selected"}. Your maximum is ${c.profile.maxCreditsPerSemester} credits per semester. Update these in Profile; existing course choices will be preserved.`;
    if (/overload|too many|load|maximum|lighter/.test(q)) { const warnings=creditWarnings(c.semesters,c.courses,c.profile.maxCreditsPerSemester);return warnings.length ? warnings.map(w=>`${semesterLabel(c.semesters.find(s=>s.id===w.semesterId)!)} has ${w.credits} credits, ${w.excess} over your ${w.maximum}-credit limit.`).join(" ")+" Move courses on the roadmap or change your limit in Profile." : `Every planned semester is within your ${c.profile.maxCreditsPerSemester}-credit limit. Course availability is unknown, check official sources.`; }
    if (/transfer|equivalen|ap.?ib|ap credit|ib credit/.test(q)) return "Transfer equivalencies and AP/IB acceptance are unknown, check official sources. Unverified credit remains uncertain and never confirms eligibility. Your reported external credit is kept separately from specific approved coursework.";
    if (/completed|earned|already done/.test(q) && !/requirement/.test(q)) {const p=progress(c.semesters,c.courses,c.profile.completed,Number.MAX_SAFE_INTEGER);return `${p.completed} illustrative credits are reported completed, ${p.inProgress} in progress, and ${p.planned} planned. Reported completion is distinct from official verification; check requirement drill-downs for grade and credit uncertainty.`;}
    if (/next|upcoming/.test(q)) { const s=sortSemesters(c.semesters).find(s=>s.courses.some(p=>p.status==="planned")); return s ? `Your next planned courses in ${semesterLabel(s)}: ${s.courses.filter(p=>p.status==="planned").map(p=>c.courses.find(course=>course.id===p.courseId)?.code??p.courseId).join(", ")}. Availability is unknown, check official sources.`:"No upcoming courses are planned. Add courses to a semester on the roadmap."; }
    if (/graduat|finish|done by|summer 20|fall 20|spring 20/.test(q)) return graduate(question, c);
    if (/requirement|haven.t|not complete|missing|left/.test(q)) {
      if(!c.requirements.length) return "Requirements for this selected program are unknown, check official sources. No requirement results are loaded; this does not mean your degree is complete.";
      const open = c.requirements.filter((r) => r.status === "unsatisfied" || r.status === "uncertain");
      if (!open.length) return "Every loaded requirement is complete or on track in your plan. Unloaded electives, GPA, residency and destination requirements still need an official degree audit.";
      return `Loaded requirements not yet met: ${open.map((r) => `${r.label} (${r.status === "uncertain" ? "needs a check" : "not in plan"})`).join("; ")}. These include sourced AA areas and unresolved conditions; this is not an official degree audit.`;
    }
    if (/in-person|in person|online|campus/.test(q)) return "Course modality and availability by term aren't verified in my data, so I can't say which classes are in-person. " + OFFICIAL;
    if (/sav|cheap|cost|tuition|money/.test(q)) {
      const f = c.tuitionPerCredit.frcc, d = c.tuitionPerCredit.cub;
      if (f == null || d == null) return "Choose or enter per-credit rates for both institutions in Settings or Costs. Published FRCC resident rates are available as a reference; CU Boulder tuition is still unknown.";
      return `With your entered rates ($${f}/credit at FRCC vs $${d}/credit at CU Boulder), each credit taken at FRCC costs $${Math.abs(d - f)} ${d >= f ? "less" : "more"}. That only counts if the course transfers, and I have no verified transfer equivalencies.`;
    }
    if (/psych|sociolog|switch|major|philosoph/.test(q)) return "Major requirement data for CU Boulder isn't loaded, so I can't tell you what switching majors changes. You can duplicate your plan under Compare Paths with a different major label, but the numbers will only change if the courses change.";
    if (/prereq/.test(q)) return c.prereqIssueCount ? `${c.prereqIssueCount} planned course${c.prereqIssueCount > 1 ? "s have" : " has"} a prerequisite that isn't finished earlier. They're highlighted on your roadmap.` : "No prerequisite conflicts found among the courses in your plan, based on the sample prerequisite data.";
    if (/credit|how many|progress/.test(q)) return `You have ${c.metrics.remainingCredits} credits planned or in progress across ${c.metrics.semesterCount} semesters, averaging ${c.metrics.avgLoad} credits per semester.`;
    return `I can help with: finishing dates, unmet requirements, prerequisites, credit counts, and costs from your own rates. ${OFFICIAL}`;
  },
};
