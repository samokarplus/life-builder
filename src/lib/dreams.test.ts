import { describe, expect, it } from "vitest";
import { pathForDream } from "./dreams";
import { pathways } from "@/data/pathways";

describe("pathForDream", () => {
  it("maps picks and free text to routes", () => {
    expect(pathForDream("Therapist / Counselor")).toBe("lpc-colorado");
    expect(pathForDream("I want to be an astronaut")).toBe("astronaut-bioastronautics");
    expect(pathForDream("Nurse")).toBe("rn-colorado");
    expect(pathForDream("doctor")).toBe("physician-colorado");
    expect(pathForDream("EMT / Paramedic")).toBe("ems-colorado");
    expect(pathForDream("electrician")).toBe("electrician-colorado");
    expect(pathForDream("Teacher")).toBe("teacher-colorado");
  });
  it("returns null when nothing matches", () => {
    expect(pathForDream("Entrepreneur")).toBeNull();
    expect(pathForDream("")).toBeNull();
    expect(pathForDream(undefined)).toBeNull();
  });
  it("every target is a real route", () => {
    for (const d of ["astronaut", "therapist", "nurse", "doctor", "emt", "electrician", "teacher"]) expect(pathways.some((p) => p.id === pathForDream(d))).toBe(true);
  });
});
