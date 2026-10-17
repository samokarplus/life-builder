export interface PaletteItem { id: string; label: string; hint?: string; group: "Pages" | "Actions" | "Courses"; run: () => void }

/** Case-insensitive subsequence-friendly filter: all words must appear in label or hint. */
export function filterPalette(items: PaletteItem[], query: string): PaletteItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items.filter((i) => i.group !== "Courses").slice(0, 12);
  return items
    .filter((i) => words.every((w) => `${i.label} ${i.hint ?? ""}`.toLowerCase().includes(w)))
    .sort((a, b) => Number(b.label.toLowerCase().startsWith(words[0])) - Number(a.label.toLowerCase().startsWith(words[0])))
    .slice(0, 12);
}
