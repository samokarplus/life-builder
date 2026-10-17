import { normalizeCareerText } from "./dreams";
import { pathways, type Pathway } from "@/data/pathways";
import { careerMeta, type Category, type CareerMeta } from "@/data/career-meta";

export interface CareerCard {
  id: string; title: string; career: string; jurisdiction: string; stepCount: number; hasHighSchoolStep: boolean;
  meta: CareerMeta; haystack: string;
}

const norm = normalizeCareerText;

export function buildCards(list: Pathway[] = pathways): CareerCard[] {
  return list.filter((p) => careerMeta[p.id]).map((p) => {
    const meta = careerMeta[p.id];
    const haystack = norm([p.title, p.career, p.jurisdiction, p.summary, meta.category, meta.headline, ...meta.tags, ...p.steps.map((s) => s.title)].join(" "));
    return { id: p.id, title: p.title, career: p.career, jurisdiction: p.jurisdiction, stepCount: p.steps.length, hasHighSchoolStep: p.steps.some((s) => s.stage === "high-school"), meta, haystack };
  });
}

export interface CareerFilters { query?: string; category?: Category | "all"; noDegree?: boolean; highSchool?: boolean }

/** Whole-token prefixes allow partial typing without matching RN inside unrelated words.
 * Exact career/title matches rank first; stable input order breaks ties. */
export function searchCareers(cards: CareerCard[], f: CareerFilters): CareerCard[] {
  const query = norm((f.query ?? "").slice(0, 200));
  const noDegreeQuery = /\b(no degree|without a degree)\b/.test(query);
  const words = query.replace(/\b(no degree|without a degree)\b/g, "").split(" ").filter(Boolean);
  const aliases: Record<string, string[]> = { rn: ["nurse"], nursing: ["nurse"], counselling: ["counseling", "counselor"], counsellor: ["counselor"], educator: ["teacher"], physician: ["doctor"], medic: ["emt"], registered: ["registered", "nurse"] };
  return cards.map((card, index) => {
    const tokens = card.haystack.split(" ");
    const exactAcronyms=new Set(["rn","pa","pe","dh","lsw","lcsw","emt"]);
    const match = words.every(word => [word, ...(aliases[word] ?? [])].some(term => tokens.some(token => exactAcronyms.has(word)&&term===word?token===term:token.startsWith(term))));
    const title = norm(card.career);
    const score = title === query ? 3 : title.startsWith(query) ? 2 : words.every(w => title.includes(w)) ? 1 : 0;
    return { card, index, match, score };
  }).filter(({ card: c, match }) => match &&
    (!f.category || f.category === "all" || c.meta.category === f.category) &&
    (!(f.noDegree || noDegreeQuery) || c.meta.startsWithoutDegree) &&
    (!f.highSchool || c.hasHighSchoolStep))
    .sort((a, b) => b.score - a.score || a.index - b.index).map(({ card }) => card);
}
