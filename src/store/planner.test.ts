import { describe, expect, it } from "vitest";
import { usePlanner } from "./planner";

describe("persistence round-trip", () => {
  it("exports and re-imports the full plan including scenarios", () => {
    const s = usePlanner.getState();
    s.addCourse("s-su27", "frcc:ENP-1005");
    s.saveScenario("Backup");
    const json = usePlanner.getState().exportJson();
    s.resetToSample();
    expect(usePlanner.getState().scenarios).toHaveLength(0);
    expect(usePlanner.getState().importJson(json)).toEqual({ ok: true });
    const after = usePlanner.getState();
    expect(after.scenarios[0].name).toBe("Backup");
    expect(after.semesters.find((x) => x.id === "s-su27")!.courses).toHaveLength(1);
  });
  it("rejects invalid imports", () => {
    expect(usePlanner.getState().importJson("{}").ok).toBe(false);
    expect(usePlanner.getState().importJson("nope").ok).toBe(false);
  });
  it("undo and redo restore moves", () => {
    const s = usePlanner.getState();
    const before = JSON.stringify(s.semesters);
    s.removeSemester("s-f27");
    usePlanner.getState().undo();
    expect(JSON.stringify(usePlanner.getState().semesters)).toBe(before);
    usePlanner.getState().redo();
    expect(usePlanner.getState().semesters.some((x) => x.id === "s-f27")).toBe(false);
  });
});
