/** Normalize user text without turning accented letters into word breaks. */
export const normalizeCareerText = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const RULES: [RegExp, string][] = [
  [/\b(astronauts?|nasa|bioastronautics|space exploration)\b/, "astronaut-bioastronautics"],
  [/\b(therapists?|counsell?ors?|counsell?ing|lpc)\b/, "lpc-colorado"],
  [/\b(nurses?|nursing|rn|registered nurse)\b/, "rn-colorado"],
  [/\b(doctors?|physicians?|surgeons?|md|medical school)\b/, "physician-colorado"],
  [/\b(emt|ems|emergency medical technician|ambulance)\b/, "ems-colorado"],
  [/\belectricians?\b/, "electrician-colorado"],
  [/\b(teachers?|teaching|educator)\b/, "teacher-colorado"],
];

/** A suggestion only. Ambiguous or unsupported credentials need an explicit route choice. */
export function pathForDream(dream: string | undefined | null): string | null {
  if (!dream) return null;
  const text = normalizeCareerText(dream);
  // These are distinct professions, not aliases for the routes currently loaded.
  if (/\b(physician assistant|nurse practitioner|physical therapist|occupational therapist|psychologist|psychiatrist|cna|paramedic|electrical engineer)\b/.test(text)) return null;
  if (/\b(not|never|don t|dont|instead of)\b/.test(text)) return null;
  const matches = RULES.filter(([pattern]) => pattern.test(text));
  return matches.length === 1 ? matches[0][1] : null;
}
