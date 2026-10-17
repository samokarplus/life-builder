/** Maps what a student typed or picked ("Nurse", "I want to be an astronaut") to a Colorado Dreams route id. */
const RULES: [RegExp, string][] = [
  [/astronaut|space|nasa|bioastro/i, "astronaut-bioastronautics"],
  [/therap|counsel|lpc|psycholog/i, "lpc-colorado"],
  [/nurs|\brn\b|\bcna\b/i, "rn-colorado"],
  [/doctor|physician|surgeon|\bmd\b|medical school/i, "physician-colorado"],
  [/\bemt\b|paramedic|\bems\b|ambulance|first responder/i, "ems-colorado"],
  [/electric/i, "electrician-colorado"],
  [/teach|educator|classroom/i, "teacher-colorado"],
];

export function pathForDream(dream: string | undefined | null): string | null {
  if (!dream) return null;
  for (const [re, id] of RULES) if (re.test(dream)) return id;
  return null;
}
