import { describe, expect, it } from "vitest";
import { fundingItems, nextOccurrence, upcomingFundingDates } from "./funding";
import { bioastronauticsCourses, bioastronauticsFaculty } from "./people";
import { sourceById } from "./sample";

describe("funding data", () => {
  it("every item cites a verified source and an https official page", () => {
    for (const f of fundingItems) {
      expect(sourceById(f.sourceId)?.status, f.id).toBe("verified");
      expect(f.url, f.id).toMatch(/^https:\/\//);
    }
  });
  it("fellowships carry a caveat instead of invented amounts", () => {
    for (const f of fundingItems.filter((x) => x.kind === "fellowship")) {
      expect(f.amount).toBeUndefined();
      expect(f.caveat).toMatch(/not loaded/);
    }
  });
  it("First Generation Scholarship amounts match the official page", () => {
    const fg = fundingItems.find((f) => f.id === "cub-first-gen")!;
    expect(fg.amount).toContain("$4,000");
    expect(fg.amount).toContain("$8,000");
  });
});

describe("funding dates", () => {
  it("rolls a passed month/day to next year", () => {
    expect(nextOccurrence(3, 1, new Date(2026, 9, 16)).getFullYear()).toBe(2027);
    expect(nextOccurrence(12, 1, new Date(2026, 9, 16)).getFullYear()).toBe(2026);
    expect(nextOccurrence(10, 16, new Date(2026, 9, 16)).getDate()).toBe(16); // today counts
  });
  it("returns dates in order with correct day counts", () => {
    const list = upcomingFundingDates(new Date(2026, 9, 16));
    expect(list[0].id).toBe("cub-scholarship-open");
    expect(list[0].days).toBe(46);
    for (let i = 1; i < list.length; i++) expect(list[i].days).toBeGreaterThanOrEqual(list[i - 1].days);
  });
});

describe("bioastronautics people and courses", () => {
  it("lists faculty with official profile links and sources", () => {
    expect(bioastronauticsFaculty.filter((p) => p.status === "active").length).toBe(7);
    for (const p of bioastronauticsFaculty) { expect(p.url).toMatch(/^https:\/\//); expect(sourceById(p.sourceId)?.status).toBe("verified"); }
  });
  it("includes the core bioastronautics courses", () => {
    const codes = bioastronauticsCourses.map((c) => c.code);
    expect(codes).toEqual(expect.arrayContaining(["ASEN 5158", "ASEN 5016", "ASEN 5226"]));
  });
});
