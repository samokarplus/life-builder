import { describe, expect, it } from "vitest";
import { routeStops } from "./route";
import { courses, sampleSemesters } from "@/data/sample";

describe("routeStops", () => {
  it("marks the first unfinished semester as current", () => {
    const stops = routeStops(sampleSemesters, courses);
    expect(stops.map((s) => s.state)).toEqual(["current", "ahead", "ahead", "ahead"]);
  });
  it("marks fully completed semesters done and advances current", () => {
    const done = sampleSemesters.map((s, i) => (i === 0 ? { ...s, courses: s.courses.map((c) => ({ ...c, status: "completed" as const })) } : s));
    expect(routeStops(done, courses).map((s) => s.state)).toEqual(["done", "current", "ahead", "ahead"]);
  });
  it("does not call an empty semester done", () => {
    expect(routeStops(sampleSemesters, courses)[2].state).not.toBe("done");
  });
});
