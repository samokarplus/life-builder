import { civilDay, parseIsoDay } from "./calendar";
export type EntryTerm = "spring" | "summer" | "fall";

export interface Deadline {
  id: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
  note?: string;
}

const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * CU Boulder transfer application dates, from the pattern published on its Transfer Timeline page
 * (spring Oct 1; summer final/fall early notification Mar 15; fall final Jun 1; scholarship + FAFSA Jun 15).
 * The dates are month/day entries; the page separately announces the open application cycle. Confirm each cycle.
 */
export function cuTransferDeadlines(term: EntryTerm, year: number): Deadline[] {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new RangeError("Invalid entry year");
  if (term === "spring") return [{ id: "cub-spring", label: "Spring application deadline", date: iso(year - 1, 10, 1) }];
  if (term === "summer") return [{ id: "cub-summer-final", label: "Summer application deadline", date: iso(year, 3, 15), note: "The official timeline lists March 15 for summer applications; confirm the entry cycle." }];
  return [
    { id: "cub-fall-early", label: "Fall early-notification deadline", date: iso(year, 3, 15), note: "Decisions mostly in March and April; final decision or request for more information by end of May." },
    { id: "cub-fall-final", label: "Fall final application deadline", date: iso(year, 6, 1), note: "Decision or request for more information by end of June." },
    { id: "cub-scholarship", label: "Transfer scholarship application and need-based FAFSA", date: iso(year, 6, 15), note: "Submit your admission application several days earlier to unlock the scholarship application. You don't need to be admitted first." },
  ];
}

export type DeadlineState = "passed" | "today" | "soon" | "upcoming";

export function describeDeadline(d: Deadline, today: Date): { days: number; state: DeadlineState } {
  const days = parseIsoDay(d.date) - civilDay(today);
  return { days, state: days < 0 ? "passed" : days === 0 ? "today" : days <= 30 ? "soon" : "upcoming" };
}

/** The next entry term a student could realistically still apply for, from a given date. */
export function nextFallEntry(today: Date): number {
  // Fall final deadline is Jun 1; after it, aim for the following fall.
  civilDay(today);
  const pastJune = today.getMonth() > 5 || (today.getMonth() === 5 && today.getDate() > 1);
  return today.getFullYear() + (pastJune ? 1 : 0);
}
