import { expect, it } from "vitest";
import { describeDatedEvent } from "./dated-event";
it("keeps AMCAS cycle dates fixed before, on and after the deadline", () => {
  expect(describeDatedEvent("2026-10-15", new Date(2026,9,14,23,59))).toMatch(/^In 1 day/);
  expect(describeDatedEvent("2026-10-15", new Date(2026,9,15,23,59))).toMatch(/^Due today/);
  expect(describeDatedEvent("2026-10-15", new Date(2026,9,16))).toMatch(/^Passed \(1 day/);
  expect(describeDatedEvent("2026-10-15", new Date(2027,9,14))).toMatch(/^Passed/);
});
it("uses civil days across DST and rejects impossible dates", () => {
  expect(describeDatedEvent("2026-03-09", new Date(2026,2,7,23))).toMatch(/^In 2 days/);
  expect(() => describeDatedEvent("2026-02-29", new Date())).toThrow();
});
