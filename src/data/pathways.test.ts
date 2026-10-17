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
