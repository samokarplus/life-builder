import { GT_RAW } from "./frcc-gtpathways-raw";

export interface GtEntry { code: string; title: string; credits: number; notOffered: boolean; categories: string[] }

/** Parses the transcribed FRCC gtPathways table. A course listed under several categories is merged. */
export function parseGt(raw: Record<string, string> = GT_RAW): GtEntry[] {
  const byCode = new Map<string, GtEntry>();
  for (const [category, block] of Object.entries(raw)) {
    for (const line of block.split("\n")) {
      const m = line.match(/^([A-Z]{3}) (\d{4})(\*?) \| (.+) \| (\d+)$/);
      if (!m) throw new Error(`Unparseable gtPathways line in ${category}: "${line}"`);
      const code = `${m[1]} ${m[2]}`;
      const prev = byCode.get(code);
      if (prev) prev.categories.push(category);
      else byCode.set(code, { code, title: m[4].trim(), credits: Number(m[5]), notOffered: m[3] === "*", categories: [category] });
    }
  }
  return [...byCode.values()];
}
