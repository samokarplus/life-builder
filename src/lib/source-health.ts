import type { DataSource } from "./types";
import { civilDay, parseIsoDay } from "./calendar";

export const SOURCE_MAX_AGE_DAYS = 90;
export type SourceHealth = { state: "fresh" | "stale" | "unverified" | "invalid"; age: number | null; label: string };
export function sourceHealth(source: Readonly<DataSource> | undefined, today: Date): SourceHealth {
  if (!source) return { state: "invalid", age: null, label: "Source missing; confirm with the official source" };
  let age: number | null = null;
  if (source.lastVerified) {
    try { age = civilDay(today) - parseIsoDay(source.lastVerified); }
    catch { return { state: "invalid", age: null, label: "Invalid check date; confirm with the official source" }; }
    if (age < 0) return { state: "invalid", age, label: "Check date is in the future; confirm with the official source" };
  }
  const checked = source.lastVerified ? `last checked ${source.lastVerified}` : "never verified";
  if (source.status !== "verified") {
    const stale = age !== null && age > SOURCE_MAX_AGE_DAYS;
    return { state: stale ? "stale" : "unverified", age, label: `${source.status === "illustrative" ? "Illustrative sample" : source.status === "user-entered" ? "User-entered" : "Unverified"}${stale ? ` · Needs recheck (${age} days old)` : ""} · ${checked}; confirm with the official source` };
  }
  if (age === null || !source.url) return { state: "invalid", age, label: "Verification incomplete; confirm with the official source" };
  if (age > SOURCE_MAX_AGE_DAYS) return { state: "stale", age, label: `Needs recheck (${age} days old) · ${checked}; confirm with the official source` };
  return { state: "fresh", age, label: `Official source · ${checked}` };
}

export function checkSourceIds(records: { location: string; record: unknown }[], sources: readonly Readonly<DataSource>[]): string[] {
  const known = new Set(sources.map(s => s.id));
  const errors: string[] = [];
  const check = (id: unknown, location: string) => { if (typeof id !== "string" || !known.has(id)) errors.push(`${location}: missing or unknown sourceId (${String(id)})`); };
  const walk = (value: unknown, path: string) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { value.forEach((child, i) => walk(child, `${path}[${i}]`)); return; }
    const object = value as Record<string, unknown>;
    if (object.type === "residency" || object.type === "transfer") check(object.sourceId, `${path}.sourceId`);
    for (const [key, child] of Object.entries(value)) {
      if ((key === "funding" || key === "datedEvents") && Array.isArray(child)) child.forEach((record, i) => check(record?.sourceId, `${path}.${key}[${i}].sourceId`));
      if (/sourceId$/i.test(key)) check(child, `${path}.${key}`);
      else if (key === "additionalSourceIds" && Array.isArray(child)) child.forEach((id, i) => check(id, `${path}.${key}[${i}]`));
      else walk(child, `${path}.${key}`);
    }
  };
  for (const { location, record } of records) {
    check(record && typeof record === "object" ? (record as { sourceId?: unknown }).sourceId : undefined, location);
    walk(record, location);
  }
  return [...new Set(errors)];
}
