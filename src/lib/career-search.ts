import { pathways, type Pathway } from "@/data/pathways";
import { careerMeta, type Category, type CareerMeta } from "@/data/career-meta";

export interface CareerCard {
  id: string; title: string; career: string; jurisdiction: string; stepCount: number; hasHighSchoolStep: boolean;
  meta: CareerMeta; haystack: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

export function buildCards(list: Pathway[] = pathways): CareerCard[] {
  return list.filter((p) => careerMeta[p.id]).map((p) => {
    const meta = careerMeta[p.id];
    const haystack = norm([p.title, p.career, p.jurisdiction, p.summary, meta.category, meta.headline, ...meta.tags, ...p.steps.map((s) => s.title)].join(" "));
    return { id: p.id, title: p.title, career: p.career, jurisdiction: p.jurisdiction, stepCount: p.steps.length, hasHighSchoolStep: p.steps.some((s) => s.stage === "high-school"), meta, haystack };
  });
}

export interface CareerFilters { query?: string; category?: Category | "all"; noDegree?: boolean; highSchool?: boolean }

/** Every word typed must appear somewhere in the career's title, tags, summary or step titles. */
export function searchCareers(cards: CareerCard[], f: CareerFilters): CareerCard[] {
  const words = norm(f.query ?? "").split(" ").filter(Boolean);
  return cards.filter((c) =>
    words.every((w) => c.haystack.includes(w)) &&
    (!f.category || f.category === "all" || c.meta.category === f.category) &&
    (!f.noDegree || c.meta.startsWithoutDegree) &&
    (!f.highSchool || c.hasHighSchoolStep));
}
