import { describe, expect, it } from "vitest";
import { costBreakdown } from "./costs";
import { courses, sampleSemesters } from "@/data/sample";

const inst = { current: "frcc", dest: "cub" };
const x = { feesPerSemester: 100, booksPerSemester: 50, housingPerSemester: 0, livingPerSemester: 0, aid: 500, destSemesters: 2, destCreditsPerSemester: 10 };

describe("costBreakdown", () => {
  it("totals tuition, fees, books and subtracts aid", () => {
    const r = costBreakdown(sampleSemesters, courses, { frcc: 100, cub: 400 }, inst, x);
    // 24 frcc credits * 100 + 20 dest credits * 400 + fees/books for 2+2 semesters − aid
    expect(r.frcc.tuition).toBe(2400);
    expect(r.dest.tuition).toBe(8000);
    expect(r.total).toBe(2400 + 8000 + 4 * 100 + 4 * 50 - 500);
  });
  it("never invents tuition: null when a rate is missing", () => {
    const r = costBreakdown(sampleSemesters, courses, { frcc: null, cub: 400 }, inst, x);
    expect(r.total).toBeNull();
    expect(r.transferSavings).toBeNull();
  });
  it("computes transfer savings only from entered rates", () => {
    expect(costBreakdown(sampleSemesters, courses, { frcc: 100, cub: 400 }, inst, x).transferSavings).toBe(24 * 300);
  });
});
