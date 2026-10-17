import { civilDay } from "@/lib/calendar";
import type { Stage } from "./pathways";

/** Annual month/day dates from CU Boulder's published pages. Cycles change, so confirm each year. */
export interface FundingDate { id: string; label: string; month: number; day: number; note?: string; sourceId: string }

export const fundingDates: FundingDate[] = [
  { id: "cub-scholarship-open", label: "CU Boulder scholarship application opens", month: 12, day: 1, note: "Some scholarship applications are due as early as Feb. 15.", sourceId: "src-cub-fafsa" },
  { id: "cub-some-due", label: "Earliest CU Boulder scholarship deadlines", month: 2, day: 15, note: "Not every scholarship; check each listing.", sourceId: "src-cub-fafsa" },
  { id: "cub-fafsa-rec", label: "Recommended FAFSA date for CU Boulder scholarships", month: 3, day: 1, note: "Scholarships with March deadlines require aid information, so a later FAFSA excludes you from them. You can still apply for aid after this date.", sourceId: "src-cub-fafsa" },
  { id: "cub-scholarship-general", label: "CU Boulder Scholarship Application (first-year students)", month: 3, day: 15, note: "11:59 p.m. Mountain Time. Transfer students have a later deadline.", sourceId: "src-cub-fafsa" },
  { id: "cub-transfer-scholarship", label: "CU Boulder Scholarship Application and FAFSA (transfer students)", month: 6, day: 15, note: "Also the First Generation Scholarship deadline for transfers.", sourceId: "src-cub-firstgen" },
];

export interface FundingItem {
  id: string;
  title: string;
  kind: "federal" | "state" | "scholarship" | "program" | "fellowship";
  summary: string;
  amount?: string;
  eligibility?: string[];
  howToApply?: string[];
  stages: Stage[];
  paths: ("lpc-colorado" | "astronaut-bioastronautics" | "all")[];
  sourceId: string;
  url: string;
  caveat?: string;
}

export const fundingItems: FundingItem[] = [
  {
    id: "fafsa", title: "FAFSA (Free Application for Federal Student Aid)", kind: "federal",
    summary: "The one form that opens federal grants, work-study and loans, and that many states and colleges use for their own aid. It is free and only on a .gov website.",
    eligibility: ["Dependent students need a parent's information on the form; independent students may need spouse information if married and filing separately.", "Everyone who adds information needs their own StudentAid.gov account."],
    howToApply: ["Make a StudentAid.gov account (name as on your Social Security card, date of birth, email).", "Pick the 2027-28 form for aid from July 1, 2027 to June 30, 2028 (it asks for 2025 tax information). The 2026-27 form covers July 1, 2026 to June 30, 2027.", "Most people can transfer their tax information from the IRS instead of finding documents.", "If your finances changed a lot, submit anyway and then explain to the school's financial aid office."],
    stages: ["high-school", "community-college", "university", "graduate"], paths: ["all"], sourceId: "src-fafsa-fill", url: "https://studentaid.gov/apply-for-aid/fafsa/filling-out",
    caveat: "Never pay to file a FAFSA. If a site asks for payment, it is the wrong site.",
  },
  {
    id: "fafsa-deadlines", title: "FAFSA deadlines: federal, state and school", kind: "federal",
    summary: "The 2027-28 federal deadline is June 30, 2028 (11:59 p.m. Central), with corrections allowed until Sept. 12, 2028. States and schools set their own earlier dates, and some aid runs out.",
    amount: "Colorado: the federal page lists no state deadline and says to contact the financial aid office of the school you plan to attend.",
    stages: ["high-school", "community-college", "university", "graduate"], paths: ["all"], sourceId: "src-fafsa-deadlines", url: "https://studentaid.gov/apply-for-aid/fafsa/fafsa-deadlines",
    caveat: "Don't wait for the federal deadline. Use each school's date instead (CU Boulder recommends March 1).",
  },
  {
    id: "cub-aid-timeline", title: "CU Boulder financial aid and scholarship timeline", kind: "program",
    summary: "CU Boulder recommends filing the FAFSA by March 1 so you're considered for scholarships that require aid information. Its general scholarship application opens Dec. 1 and is due March 15; transfer students' deadline is June 15. Aid offers begin in March.",
    stages: ["community-college", "university"], paths: ["all"], sourceId: "src-cub-fafsa", url: "https://www.colorado.edu/financialaid/apply-aid/fafsa",
    caveat: "The page describes the 2026-27 cycle. Dates are shown here as the annual pattern; confirm each year.",
  },
  {
    id: "cub-first-gen", title: "CU Boulder First Generation Scholarship", kind: "scholarship",
    summary: "For first-generation incoming and transfer students with significant financial need.",
    amount: "Colorado residents: $4,000 per year for up to 10 semesters or 150 credit hours, whichever comes first. Nonresidents: $8,000 per year for up to 4 years.",
    eligibility: ["Neither parent has a bachelor's degree (the page explains the definition and how to describe unusual situations).", "Incoming first-year (resident or nonresident) or resident transfer student.", "Significant financial need as determined by the financial aid application.", "Recipients take part in the First Generation Scholarship Program.", "Nonresidents must also be offered the Presidential or Chancellor’s Achievement Scholarship.", "Transfer credits count toward the 150-credit limit; the award cannot fund summer courses."],
    howToApply: ["File the FAFSA (or apply as an undocumented student).", "Complete the CU Boulder Scholarship Application by June 15 if you're a transfer student (March 15 for first-year students).", "You'll be prompted to complete the First Generation application if eligible."],
    stages: ["community-college", "university"], paths: ["all"], sourceId: "src-cub-firstgen", url: "https://www.colorado.edu/scholarships/first-generation",
    caveat: "Not every eligible student is awarded it; applications are reviewed comprehensively.",
  },
  {
    id: "cub-transfer-scholarship", title: "CU Boulder Transfer Scholarship Application", kind: "scholarship",
    summary: "One scholarship application for transfer students. Submit your admission application a few days before the deadline to unlock it; you don't need to be admitted first.",
    amount: "Amounts weren't listed on the transfer timeline page.",
    howToApply: ["Submit your CU Boulder admission application.", "Complete the scholarship application and need-based FAFSA by June 15 for fall entry."],
    stages: ["community-college"], paths: ["all"], sourceId: "src-cub-transfer-timeline", url: "https://www.colorado.edu/admissions/transfer/timeline",
  },
  {
    id: "cosgc", title: "Colorado Space Grant Consortium (NASA)", kind: "program",
    summary: "Statewide Space Grant student opportunities. Open to high school, undergraduate and graduate students, from community colleges or four-year schools, STEM majors or not. Includes hands-on projects, competitions and student positions that open every semester.",
    eligibility: ["Statewide design challenges: Robotics Challenge, DemoSat High-Altitude Balloon Program, Wearables Quest, EONS Challenge, Rocketry Challenge.", "Some open student positions are for current CU Boulder students only."],
    stages: ["high-school", "community-college", "university", "graduate"], paths: ["astronaut-bioastronautics"], sourceId: "src-cosgc", url: "https://www.colorado.edu/center/spacegrant/student-involvement-opportunities-space-grant",
    caveat: "The page doesn't list award amounts or deadlines. Check the open positions listing each semester.",
  },
  ...[
    ["NSF Graduate Research Fellowship Program (GRFP)", "A 2026 bioastronautics PhD student received this to support doctoral studies."],
    ["NASA Space Technology Graduate Research Opportunities (NSTGRO)", "A 2025 bioastronautics PhD student received this fellowship."],
    ["Charles Stark Draper Laboratory fellowships (MS and PhD)", "Draper fellowships supported a 2026 MS student and a 2025 PhD student in the group."],
    ["Zonta International Amelia Earhart Fellowship", "Two bioastronautics PhD students received it in 2026."],
    ["NASA Pathways internships (Johnson Space Center)", "Three students received Pathways Intern Employment Program awards in 2026 for summer internship performance."],
  ].map(([title, summary], i): FundingItem => ({
    id: `bio-award-${i}`, title, kind: "fellowship", summary,
    stages: ["graduate"], paths: ["astronaut-bioastronautics"], sourceId: "src-cub-bio-awards", url: "https://www.colorado.edu/bioastronautics/student-awards",
    caveat: "Listed because students in this group have won it. Eligibility, amounts and deadlines belong to each sponsor and are not loaded here; check the sponsor's own page.",
  })),
];

/** Next occurrence of a month/day on or after `from`. */
export function nextOccurrence(month: number, day: number, from: Date): Date {
  const today = civilDay(from);
  if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || day > new Date(2000, month, 0).getDate()) throw new RangeError("Invalid month/day");
  for (let year = from.getFullYear(); year <= from.getFullYear() + 8; year++) {
    const date = new Date(year, month - 1, day);
    if (date.getMonth() === month - 1 && date.getDate() === day && civilDay(date) >= today) return date;
  }
  throw new RangeError("No valid occurrence");
}

export function upcomingFundingDates(from: Date) {
  return fundingDates
    .map((d) => ({ ...d, date: nextOccurrence(d.month, d.day, from) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((d) => ({ ...d, days: civilDay(d.date) - civilDay(from) }));
}
