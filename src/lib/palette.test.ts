import { describe, expect, it } from "vitest";
import { filterPalette, type PaletteItem } from "./palette";

const mk = (label: string, group: PaletteItem["group"], hint?: string): PaletteItem => ({ id: label, label, group, hint, run: () => {} });
const items = [mk("My Roadmap", "Pages"), mk("Compare Paths", "Pages"), mk("Undo", "Actions"), mk("PHI 1014", "Courses", "Comparative Religions")];

describe("filterPalette", () => {
  it("hides courses until the user types", () => {
    expect(filterPalette(items, "").some((i) => i.group === "Courses")).toBe(false);
  });
  it("matches all words across label and hint", () => {
    expect(filterPalette(items, "comparative relig").map((i) => i.label)).toEqual(["PHI 1014"]);
    expect(filterPalette(items, "zzz")).toEqual([]);
  });
  it("prefers prefix matches", () => {
    expect(filterPalette(items, "comp")[0].label).toBe("Compare Paths");
  });
});
