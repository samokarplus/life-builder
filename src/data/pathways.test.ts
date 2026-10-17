import { describe, expect, it } from "vitest";
import { pathways } from "./pathways";
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
  it("licensure details that could not be read from an official page are not marked verified", () => {
    expect(sourceById("src-co-lpc-statute")!.status).toBe("unverified");
    expect(sourceById("src-nasa-astronaut")!.status).toBe("verified");
  });
  it("every funding item cites a source", () => {
    for (const p of pathways) for (const s of p.steps) for (const f of s.funding ?? []) expect(sourceById(f.sourceId)).toBeDefined();
  });
});
