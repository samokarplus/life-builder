import { civilDay, parseIsoDay } from "./calendar";
/** Fixed-cycle dates never recur implicitly. On the due date, no closing time is assumed. */
export function describeDatedEvent(iso: string, today: Date): string {
  const days = parseIsoDay(iso) - civilDay(today);
  if (days < 0) return `Passed (${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago); check the next published cycle`;
  if (days === 0) return "Due today; confirm the official closing time";
  return `In ${days} day${days === 1 ? "" : "s"}; this published cycle only`;
}
