import { describe, expect, it } from "vitest";
import { buildCards, searchCareers } from "./career-search";
import { pathways } from "@/data/pathways";
import { careerMeta } from "@/data/career-meta";
import { sourceById } from "@/data/sample";

const cards = buildCards();
const ids = (r: ReturnType<typeof searchCareers>) => r.map((c) => c.id).sort();

describe("career search", () => {
  it("every pathway has metadata and a card", () => {
    expect(cards.map((c) => c.id).sort()).toEqual(pathways.map((p) => p.id).sort());
    for (const p of pathways) expect(careerMeta[p.id], p.id).toBeDefined();
  });
  it("finds by plain words and synonyms", () => {
    expect(searchCareers(cards, { query: "doctor" })[0].id).toBe("physician-colorado");
    expect(ids(searchCareers(cards, { query: "therapist" }))).toEqual(["lpc-colorado"]);
    expect(ids(searchCareers(cards, { query: "space" }))).toContain("astronaut-bioastronautics");
    expect(ids(searchCareers(cards, { query: "ambulance" }))).toEqual(["ems-colorado","paramedic-colorado"]);
  });
  it("requires every typed word to match", () => {
    expect(searchCareers(cards, { query: "nurse astronaut" })).toEqual([]);
  });
  it("handles abbreviations, accents, partial typing and the advertised no-degree query", () => {
    expect(searchCareers(cards, { query: "RN" }).map(c => c.id)).toEqual(["rn-colorado"]);
    expect(searchCareers(cards, { query: "électric" })[0].id).toBe("electrician-colorado");
    expect(searchCareers(cards, { query: "counsellor" })[0].id).toBe("lpc-colorado");
    expect(searchCareers(cards, { query: "no degree" }).map(c => c.id).sort()).toEqual(searchCareers(cards, { noDegree: true }).map(c => c.id).sort());
    expect(searchCareers(cards, { query: "nurse" })[0].id).toBe("rn-colorado");
  });
  it("filters by category, no-degree start and high-school step", () => {
    expect(ids(searchCareers(cards, { category: "Skilled trades" }))).toEqual(["electrician-colorado","plumber-colorado"]);
    for (const c of searchCareers(cards, { noDegree: true })) expect(c.meta.startsWithoutDegree).toBe(true);
    expect(ids(searchCareers(cards, { noDegree: true }))).toEqual(expect.arrayContaining(["rn-colorado", "ems-colorado", "electrician-colorado"]));
    expect(ids(searchCareers(cards, { highSchool: true })).length).toBe(cards.length);
  });
});

describe("career data provenance", () => {
  it("every challenge and person cites a verified source", () => {
    for (const [id, m] of Object.entries(careerMeta)) {
      for (const c of m.challenges) expect(sourceById(c.sourceId)?.status, `${id}: ${c.title}`).toBe("verified");
      for (const p of m.people) { expect(sourceById(p.sourceId)?.status, `${id}: ${p.name}`).toBe("verified"); expect(p.url).toMatch(/^https:\/\//); }
    }
  });
  it("official durations carry a source-backed note or fact", () => {
    for (const m of Object.values(careerMeta)) for (const s of m.ideal) {
      expect(["official", "estimate"]).toContain(s.basis);
      if (s.basis === "official") expect(sourceById(s.sourceId)?.url, s.label).toMatch(/^https:\/\//);
      if (/about.*years|right away/.test(s.duration)) expect(s.basis).toBe("estimate");
    }
  });
});


it('keeps short credential searches exact and new careers discoverable',()=>{
 expect(searchCareers(cards,{query:'PA'}).map(c=>c.id)).toEqual(['pa-colorado']);
 expect(searchCareers(cards,{query:'PE'})[0].id).toBe('pe-colorado');
 for(const query of ['software developer','plumber','dental hygienist','social worker','paramedic','veterinarian','pharmacist'])expect(searchCareers(cards,{query}).length,query).toBeGreaterThan(0);
});
