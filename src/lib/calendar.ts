/** Civil-day arithmetic: no UTC parsing of local date-only strings, no DST fractions. */
export function civilDay(date: Date): number {
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid date');
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}
export function parseIsoDay(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('Expected YYYY-MM-DD');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError('Invalid calendar date');
  return date.getTime() / 86_400_000;
}
