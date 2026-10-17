/**
 * FRCC "Approved Elective List", 2026-2027 catalog, transcribed from
 * https://frontrange.smartcatalogiq.com/en/current/catalog/elective-lists/approved-elective-list
 * (read 2026-10-16, with the collapsed category sections expanded).
 *
 * Per the page, approved electives for all degrees are: every gtPathways course, plus the entries
 * below. "1105+" means "or higher". The page says "or higher" does not include specialized courses
 * or courses at the 3000 or 4000 level. A "!" marks an excluded number.
 * Caveats from the page: at most 3 credits of PED, OUT and DAN count (GT courses such as DAN 1050 are
 * exempt); AAS and AA/AS degrees with a designation define their own electives.
 */
export const APPROVED_ELECTIVE_ENTRIES = [
  // Mathematics & Science
  "AQT 2008", "ANT 1005", "ANT 2315", "AST 1110+", "BIO 1004+", "CHE 1005+", "CSC 1001+", "DAT 1001", "EGG 1000+",
  "ENV 1111", "ENV 1010", "FER 1001", "FER 1002", "FER 2001", "FER 2003", "GEO 1011", "GEO 1012", "GEO 1060", "GEO 2010",
  "GEY 1108+", "GIS 1001+", "HLT 1101+!2008", "MAT 1220+", "MET 1050",
  "NRE 1100", "NRE 1110", "NRE 1021", "NRE 2000", "NRE 2204", "NRE 2205", "NRE 2025", "PHY 1105+", "SCI 1055+",
  // Liberal Arts, Communication & Design
  "COM 1150+", "ENG 1021+", "HIS 2765", "ART 1001+", "COM 1300", "COM 2400", "DAN 1005+", "MUS 1000+", "THE 1005+",
  "HUM 1003+", "LIT 1015+", "PHI 1011+", "ARA 1001+", "ASL 1101+", "CHI 1001+", "FRE 1001+", "GER 1001+", "ITA 1001+",
  "JPN 1001+", "RUS 1001+", "SPA 1001+", "IPP 1021", "IPP 1047",
  "AEC 1250", "AEC 1520", "AEC 1600", "CAD 1100", "CAD 1101", "CAD 1102", "CAD 1110", "EGT 1101", "EGT 2300", "FLD 2000",
  "IND 1101", "IND 2201", "MAC 1000", "MAC 1001", "MAC 1002", "MAC 1010", "MAC 1020",
  "MGD 1011", "MGD 1012", "MGD 1017", "MGD 1033", "MGD 1043", "MGD 1064",
  // Social Sciences, Education and Public Service
  "HIS 1110+!2765", "ECO 1001+", "PSC 1011+", "GEO 1005", "GEO 1006", "GEO 2009", "ANT 1001+!1005!2315",
  "COM 1250", "COM 2220", "COM 2300", "CRJ 1010+", "ETH 2000+", "JOU 1005+", "PSY 1001+", "SOC 1001+", "WST 2000+",
  "ECE 1011+", "EDU 1011+",
  // Business & Information Technology
  "ACC 1001+", "BUS 1002+", "CIS 1015+", "FIN 2010", "HOS 1010", "HOS 1041", "MAN 1005+", "MAR 1011+",
  // Military Leadership, First-Year Experience, Outdoor Studies / PE / Wellness
  "AIR 1001+", "ARM 1011+", "AAA 1001", "AAA 1009", "DEH 1005",
  "IHP 2001", "IHP 2004", "IHP 2040", "IHP 2060", "IHP 2061", "IHP 2062", "IHP 2063",
  "HPR 1010", "HPR 1017", "HPR 1045", "HWE 1001+", "OUT 1020+", "PED 1002+",
] as const;

const MAX_LEVEL = 2999;

interface Parsed { prefix: string; min: number; open: boolean; excluded: number[] }

const parsed: Parsed[] = APPROVED_ELECTIVE_ENTRIES.map((e) => {
  const m = e.match(/^([A-Z]{3}) (\d{4})(\+?)((?:![0-9]{4})*)$/);
  if (!m) throw new Error(`Bad elective entry: ${e}`);
  return { prefix: m[1], min: Number(m[2]), open: m[3] === "+", excluded: [...m[4].matchAll(/!(\d{4})/g)].map((x) => Number(x[1])) };
});

export type ElectiveBasis = "gtPathways" | "listed" | "or-higher";

/** Why a course counts as an approved elective, or null if the loaded list doesn't approve it. */
export function approvedElectiveBasis(code: string, gtPathways?: string[]): ElectiveBasis | null {
  if (gtPathways?.length) return "gtPathways";
  const m = code.match(/^([A-Z]{3}) (\d{4})$/);
  if (!m) return null;
  const n = Number(m[2]);
  let basis: ElectiveBasis | null = null;
  for (const p of parsed) {
    if (p.prefix !== m[1] || p.excluded.includes(n)) continue;
    if (!p.open && p.min === n) return "listed";
    if (p.open && n >= p.min && n <= MAX_LEVEL) basis = "or-higher";
  }
  return basis;
}

export const electiveBasisLabel: Record<ElectiveBasis, string> = {
  gtPathways: "Approved elective (gtPathways course)",
  listed: "Approved elective (named on the list)",
  "or-higher": "Approved elective by an \"or higher\" entry (specialized courses are excluded; confirm with an advisor)",
};
