/** Normalize user text without turning accented letters into word breaks. */
export const normalizeCareerText = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const RULES: [RegExp, string][] = [
  [/\b(physician assistants?|pa school)\b/, "pa-colorado"],
  [/\b(paramedics?)\b/, "paramedic-colorado"],
  [/\b(software developers?|software engineers?|programmers?)\b/, "software-colorado"],
  [/\b(professional engineers?|licensed engineers?|pe licen[cs]e)\b/, "pe-colorado"],
  [/\b(pharmacists?|pharmacy|pharmd)\b/, "pharmacist-colorado"],
  [/\b(plumbers?|plumbing)\b/, "plumber-colorado"],
  [/\b(dental hygienists?|dental hygiene)\b/, "dental-hygienist-colorado"],
  [/\b(licensed clinical social worker|lcsw)\b/, "social-worker-colorado"],
  [/\b(veterinarians?|veterinary medicine|dvm)\b/, "veterinarian-colorado"],
  [/\b(astronauts?|nasa|bioastronautics|space exploration)\b/, "astronaut-bioastronautics"],
  [/\b(therapists?|counsell?ors?|counsell?ing|lpc)\b/, "lpc-colorado"],
  [/\b(nurses?|nursing|rn|registered nurse)\b/, "rn-colorado"],
  [/\b(doctors?(?!\s+of\b)|physicians?(?!\s+assistants?\b)|surgeons?|md|medical school)\b/, "physician-colorado"],
  [/\b(emt|ems|emergency medical technician|ambulance)\b/, "ems-colorado"],
  [/\belectricians?\b/, "electrician-colorado"],
  [/\b(teachers?|teaching|educator)\b/, "teacher-colorado"],
];

/** A suggestion only. Ambiguous or unsupported credentials need an explicit route choice. */
export function pathForDream(dream: string | undefined | null): string | null {
  if (!dream) return null;
  const text = normalizeCareerText(dream).replace(/\b(animal doctors?|vet doctors?|veterinary surgeons?)\b/g,"veterinarian");
  // These are distinct professions, not aliases for the routes currently loaded.
  if (/\b(nurse practitioner|nurse anesthetist|physical therapist|occupational therapist|psychologist|psychiatrist|cna|pharmacy technician|pharmacy tech|veterinary technician|veterinary professional associate|dental assistant|plumbing engineer|critical care paramedic|community paramedic)\b/.test(text)) return null;
  if (/\b(social worker|social work)\b/.test(text) && !/\b(licensed clinical social worker|lcsw)\b/.test(text)) return null;
  if (/\belectrical engineer\b/.test(text) && !/\b(professional engineer|pe licen[cs]e)\b/.test(text)) return null;
  if (/\b(not|never|don t|dont|instead of)\b/.test(text)) return null;
  const matches = RULES.filter(([pattern]) => pattern.test(text));
  return matches.length === 1 ? matches[0][1] : null;
}
