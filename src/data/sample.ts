import { parseGt } from "./frcc-gtpathways";
import { GT_SOURCE_ID } from "./frcc-gtpathways-raw";
import type { Course, DegreeRequirement, Institution, Career, TuitionRate, Semester, StudentProfile } from "@/lib/types";

/**
 * Mixed catalog: official FRCC entries override the illustrative base below.
 * Each record identifies its source; a verified catalog record does not verify
 * offering, prerequisite, transfer or student-completion claims.
 */
export { sources, sourceById, VERIFIED_ON } from "./sources";

export const institutions: Institution[] = [
  { id: "frcc", name: "Front Range Community College", shortName: "FRCC", kind: "community-college", state: "CO" },
  { id: "cub", name: "University of Colorado Boulder", shortName: "CU Boulder", kind: "university", state: "CO" },
];

const mk = (code: string, title: string, category: string, prerequisiteIds: string[] = []): Course => ({
  id: `frcc:${code.replace(" ", "-")}`,
  institutionId: "frcc",
  code,
  title,
  credits: 3,
  level: code.split(" ")[1].startsWith("2") ? 2000 : 1000,
  prerequisiteIds,
  category,
  sourceId: "src-sample",
});

const baseCourses: Course[] = [
  mk("HIS 1120", "World History 1500–Present", "Arts & Humanities (sample)"),
  mk("GEY 1108", "Geology of National Parks", "Natural Science (sample)"),
  mk("GEY 1111", "Geology course (title unverified)", "Natural Science (sample)"),
  { ...mk("ENG 1021", "English Composition I", "Written Communication (GT-CO1)"), sourceId: "src-frcc-aa-2627" },
  // Prerequisite below is NOT confirmed by the source above.
  { ...mk("ENG 1022", "English Composition II", "Written Communication (GT-CO2)", ["frcc:ENG-1021"]), prerequisiteSourceId: "src-sample", sourceId: "src-frcc-aa-2627" },
  mk("PHI 1014", "Comparative Religions", "Arts & Humanities (sample)"),
  mk("PHI 1030", "Philosophy of AI", "Major-related (sample)"),
  mk("ENP 1005", "Introduction to Entrepreneurship", "Elective (sample)"),
  mk("AIR 2001", "AIR 2001 (title unverified)", "Elective (sample)"),
  // Oral communication options from the AA page; the degree needs only ONE, so none are auto-placed.
  { ...mk("COM 1150", "Public Speaking", "Oral Communication"), sourceId: "src-frcc-aa-2627", planDefault: false },
  { ...mk("COM 1250", "Interpersonal Communication", "Oral Communication (GT-SS3)"), sourceId: "src-frcc-aa-2627", planDefault: false },
  { ...mk("COM 2300", "Intercultural Communication", "Oral Communication (GT-SS3)"), sourceId: "src-frcc-aa-2627", planDefault: false },
];

/** Official gtPathways entries override sample details; unlisted courses are added as non-default options. */
export const courses: Course[] = (() => {
  const out = [...baseCourses];
  for (const g of parseGt()) {
    const id = `frcc:${g.code.replace(" ", "-")}`;
    const i = out.findIndex((c) => c.id === id);
    const official = { title: g.title, credits: g.credits, gtPathways: g.categories, eligibilityNote: ["SCI 1055", "SCI 1056"].includes(g.code) ? "Only guaranteed under the Early Childhood / Elementary Teacher Education agreements; both SCI 1055 and SCI 1056 need C or better. Confirm with both institutions before enrolling." : undefined, notOffered: g.notOffered || undefined, sourceId: GT_SOURCE_ID, category: g.categories.join(" / ") };
    if (i >= 0) out[i] = { ...out[i], ...official };
    else out.push({ id, institutionId: "frcc", code: g.code, level: Number(g.code.split(" ")[1]) >= 2000 ? 2000 : 1000, prerequisiteIds: [], planDefault: false, ...official });
  }
  return out;
})();


export const tuitionRates: TuitionRate[] = [
  { id: "t-frcc", institutionId: "frcc", academicYear: "2026-2027", perCredit: 299.75, cofStipend: 116, residency: "in-state", sourceId: "src-frcc-tuition-2627", note: "Regular resident, excluding campus fees. $183.75 per credit after the College Opportunity Fund stipend, if eligible." },
  { id: "t-cub", institutionId: "cub", academicYear: "unsourced", perCredit: null, residency: "in-state", sourceId: "src-cub-tuition-unresolved" },
];

export const careers: Career[] = [
  {
    id: "lpc",
    name: "Licensed Professional Counselor",
    status: "detailed",
    jurisdiction: "Colorado (confirm with the state licensing board)",
    sourceId: "src-sample",
    stages: [
      { label: "Undergraduate education", description: "Bachelor's degree; major options vary by graduate program." },
      { label: "Graduate degree", description: "Master's in counseling or a related field, per licensing board rules." },
      { label: "Clinical training", description: "Practicum/internship as part of the graduate program." },
      { label: "Supervised experience", description: "Post-degree supervised hours required by the board." },
      { label: "Licensure", description: "Exam and application through the state board. Illustrative only, not licensing advice." },
    ],
  },
  ...["Engineer", "Physician", "Teacher", "Software Developer"].map(
    (name): Career => ({ id: name.toLowerCase().replace(/ /g, "-"), name, status: "placeholder", sourceId: "src-sample", stages: [] })
  ),
];

let n = 0;
const pc = (code: string, status: "planned" | "in-progress" | "completed" = "planned") => ({
  id: `pc-${++n}`,
  courseId: `frcc:${code.replace(" ", "-")}`,
  status,
});

export const sampleSemesters: Semester[] = [
  { id: "s-f26", term: "fall", year: 2026, institutionId: "frcc", courses: [pc("HIS 1120", "in-progress"), pc("GEY 1108", "in-progress"), pc("ENG 1022", "in-progress")] },
  { id: "s-sp27", term: "spring", year: 2027, institutionId: "frcc", courses: [pc("GEY 1111"), pc("PHI 1014"), pc("ENP 1005"), pc("PHI 1030"), pc("AIR 2001")] },
  { id: "s-su27", term: "summer", year: 2027, institutionId: "frcc", courses: [] },
  { id: "s-f27", term: "fall", year: 2027, institutionId: "cub", courses: [] },
];

/**
 * ILLUSTRATIVE requirement structure to exercise the engine. These are NOT the
 * official FRCC AA requirements; replace with imported catalog data.
 */
export const illustrativeRequirements: DegreeRequirement[] = [
  { id: "req-written", programId: "frcc-aa-sample", label: "Written communication", sourceId: "src-sample",
    rule: { type: "all", rules: [{ type: "course", courseId: "frcc:ENG-1021", minGrade: "C" }, { type: "course", courseId: "frcc:ENG-1022", minGrade: "C" }] } },
  { id: "req-science", programId: "frcc-aa-sample", label: "Natural science (one course)", sourceId: "src-sample",
    rule: { type: "any", rules: [{ type: "course", courseId: "frcc:GEY-1108" }, { type: "course", courseId: "frcc:GEY-1111" }] } },
  { id: "req-humanities", programId: "frcc-aa-sample", label: "Arts & humanities (6 credits)", sourceId: "src-sample",
    rule: { type: "credits", min: 6, from: { type: "group", courseIds: ["frcc:HIS-1120", "frcc:PHI-1014", "frcc:PHI-1030"] } } },
  { id: "req-electives", programId: "frcc-aa-sample", label: "Electives (6 credits)", sourceId: "src-sample",
    rule: { type: "credits", min: 6, from: { type: "group", courseIds: ["frcc:ENP-1005", "frcc:AIR-2001"] } } },
];

/**
 * FRCC Associate of Arts, 2026-2027 catalog (60 credits). Written and oral
 * communication and general education areas use the reviewed gtPathways list.
 * Approved electives remain unmapped; GPA and residency need an official audit.
 */
const aa = (id: string, label: string, rule: DegreeRequirement["rule"]): DegreeRequirement => ({ id, programId: "frcc-aa", institutionId: "frcc", label, rule, sourceId: "src-frcc-aa-2627" });
const gtIds = (...cats: string[]) => courses.filter((c) => c.gtPathways?.some((g) => cats.includes(g))).map((c) => c.id);
const fromGt = (min: number, ...cats: string[]) => ({ type: "credits" as const, min, from: { type: "group" as const, courseIds: gtIds(...cats), minGrade: "C" } });
const pair = (a: string, b: string) => ({ type: "all" as const, distinctCourses: true, rules: [fromGt(3, a), fromGt(3, b)] });
const AH = ["GT-AH1", "GT-AH2", "GT-AH3", "GT-AH4"];
const gt = (credits: number, what: string) => ({ type: "unmapped" as const, credits, note: `${what}. Needs the approved electives list, not loaded yet; check eWOLF DegreeCheck.` });

export const requirements: DegreeRequirement[] = [
  aa("aa-written", "Written communication (6 cr, ENG 1021 + 1022 or ENG 1022 + GT-CO3)", { type: "all", rules: [{ type: "course", courseId: "frcc:ENG-1022", minGrade: "C" }, { type: "any", rules: [{ type: "course", courseId: "frcc:ENG-1021", minGrade: "C" }, fromGt(3, "GT-CO3")] }] }),
  aa("aa-oral", "Oral communication (3 cr, one of COM 1150 / 1250 / 2300)", { type: "any", rules: [{ type: "course", courseId: "frcc:COM-1150", minGrade: "C" }, { type: "course", courseId: "frcc:COM-1250", minGrade: "C" }, { type: "course", courseId: "frcc:COM-2300", minGrade: "C" }] }),
  aa("aa-math", "Mathematics (3-5 cr, one GT-MA1 course)", fromGt(3, "GT-MA1")),
  // Two GT-AH courses from two different areas: any of the six area pairings.
  aa("aa-arts-hum", "Arts & humanities (6 cr, two GT-AH courses from different areas)", { type: "any", rules: AH.flatMap((a, i) => AH.slice(i + 1).map((b) => pair(a, b))) }),
  aa("aa-history", "History (3 cr, one GT-HI1 course)", fromGt(3, "GT-HI1")),
  aa("aa-social", "Social & behavioral sciences (6 cr, two GT-SS courses)", fromGt(6, "GT-SS1", "GT-SS2", "GT-SS3")),
  aa("aa-science", "Natural & physical sciences (7-10 cr, two courses, one with a lab)", { type: "all", distinctCourses: true, rules: [fromGt(4, "GT-SC1"), fromGt(3, "GT-SC1", "GT-SC2")] }),
  aa("aa-choice", "Student choice (3 cr, one more GT-AH, GT-HI or GT-SS course)", fromGt(3, ...AH, "GT-HI1", "GT-SS1", "GT-SS2", "GT-SS3")),
  aa("aa-electives", "Electives (18-23 cr from the approved electives list)", gt(18, "Approved electives list")),
];

/** Total credits for the FRCC AA degree per the 2026-2027 catalog. */
export const FRCC_AA_CREDITS = 60;

/** Loaded AA rules must never be presented as the rules for another selected program. */
export function requirementsForProfile(profile: Pick<StudentProfile, "currentInstitutionId" | "program">): DegreeRequirement[] {
  return profile.currentInstitutionId === "frcc" && (!profile.program || profile.program === "Associate of Arts") ? requirements : [];
}
