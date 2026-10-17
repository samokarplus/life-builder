import { describe, expect, it } from "vitest";
import { pathways, stageOrder } from "./pathways";
import { sourceById } from "./sample";

describe("pathway data provenance", () => {
  it("every step points at a real source", () => {
    for (const p of pathways) for (const s of p.steps) expect(sourceById(s.sourceId), `${p.id}/${s.id}`).toBeDefined();
  });
  it("step ids are unique and ordered within each pathway", () => {
    for (const p of pathways) {
      const ids = p.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(p.steps.length).toBeGreaterThan(4);
    }
  });
  it("Colorado licensing steps cite the official rules and DORA pages, all verified", () => {
    for (const id of ["src-co-lpc-rules", "src-dora-lpc-apps", "src-dora-faq", "src-nasa-astronaut"]) expect(sourceById(id)!.status, id).toBe("verified");
    const lpc = pathways.find((p) => p.id === "lpc-colorado")!;
    expect(lpc.steps.every((s) => sourceById(s.sourceId)!.status === "verified" || s.sourceId === "src-cacrep")).toBe(true);
  });
  it("every step has a stage in journey order", () => {
    for (const p of pathways) {
      let last = -1;
      for (const s of p.steps) { const i = stageOrder.indexOf(s.stage); expect(i, `${p.id}/${s.id}`).toBeGreaterThanOrEqual(last); last = i; }
    }
  });
  it("every funding item cites a source", () => {
    for (const p of pathways) for (const s of p.steps) for (const f of s.funding ?? []) expect(sourceById(f.sourceId)).toBeDefined();
  });
});

import { coloradoCounselingPrograms } from "./programs";
describe("Colorado counseling program list", () => {
  it("only lists Colorado CACREP rows with a source", () => {
    expect(coloradoCounselingPrograms.length).toBe(22);
    for (const p of coloradoCounselingPrograms) { expect(p.sourceId).toBe("src-cacrep-co"); expect(p.status).toMatch(/Accredited/); }
  });
  it("includes the programs that lead toward LPC licensure (clinical mental health counseling)", () => {
    const names = coloradoCounselingPrograms.filter((p) => p.specialty === "Clinical Mental Health Counseling").map((p) => p.institution);
    expect(names).toEqual(expect.arrayContaining(["Regis University", "University of Colorado at Denver", "Colorado State University"]));
  });
});

import { accessOptions } from "./access";
import { careerMeta } from "./career-meta";
it("resolves additional sources on mixed-authority steps and access cards", () => {
 for (const entry of [...accessOptions, ...pathways.flatMap(p => p.steps)]) {
  expect(sourceById(entry.sourceId), entry.id).toBeDefined();
  for (const id of entry.additionalSourceIds ?? []) expect(sourceById(id), id).toBeDefined();
 }
});
it("does not advertise sunset ASCENT or historical Care Forward as current funding", () => {
 const hs=JSON.stringify(pathways.flatMap(p=>p.steps).filter(s=>s.stage==='high-school'));
 expect(hs).not.toContain('Programs listed: ASCENT');
 expect(accessOptions.find(o=>o.id==='concurrent-enrollment')?.facts.join(' ')).toContain('ended June 30, 2026');
 expect(accessOptions.find(o=>o.id==='care-forward')?.summary).toContain('does not establish current funding');
});
it("scopes nursing admissions to Larimer and preserves source-backed fixed-cycle dates",()=>{
 const rn=pathways.find(p=>p.id==='rn-colorado')!;
 expect(rn.steps.find(s=>s.id==='rn-3')?.detail).toContain('At Larimer');
 expect(careerMeta['rn-colorado'].challenges[0].detail).toContain('Larimer');
 const md=pathways.find(p=>p.id==='physician-colorado')!.steps.find(s=>s.id==='md-3')!;
 expect(md.datedEvents?.map(d=>d.date)).toEqual(['2026-10-15','2026-11-30']);
 expect(md.facts?.join(' ')).not.toContain('(passed)');
});

import { glossary } from "./glossary";
it("explains requested jargon with linked provenance", () => {
 expect(glossary.map(g=>g.term)).toEqual(['gtPathways','CACREP','NCLEX','NREMT','AMCAS','MCAT','WUE','COF']);
 for (const item of glossary) expect(sourceById(item.sourceId)?.url).toMatch(/^https:\/\//);
});
