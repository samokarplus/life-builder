import type { Course, DataSource, DegreeRequirement, Institution, Career, TuitionRate, Semester } from "@/lib/types";

/**
 * SAMPLE DATA ONLY. Course codes/titles come from the product brief as
 * illustrations. Credits are assumed (3) and nothing here is verified against
 * an official catalog. Replace via future importers.
 */
export const sources: DataSource[] = [
  {
    id: "src-sample",
    url: null,
    institutionId: null,
    catalogYear: null,
    lastVerified: null,
    status: "illustrative",
    note: "Illustrative sample entry; not verified against an official catalog.",
  },
];

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

export const courses: Course[] = [
  mk("HIS 1120", "World History 1500–Present", "Arts & Humanities (sample)"),
  mk("GEY 1108", "Geology of National Parks", "Natural Science (sample)"),
  mk("GEY 1111", "Geology course (title unverified)", "Natural Science (sample)"),
  mk("ENG 1021", "English Composition I", "Written Communication (sample)"),
  mk("ENG 1022", "English Composition II", "Written Communication (sample)", ["frcc:ENG-1021"]),
  mk("PHI 1014", "Comparative Religions", "Arts & Humanities (sample)"),
  mk("PHI 1030", "Philosophy of AI", "Major-related (sample)"),
  mk("ENP 1005", "Introduction to Entrepreneurship", "Elective (sample)"),
  mk("AIR 2001", "AIR 2001 (title unverified)", "Elective (sample)"),
];

export const tuitionRates: TuitionRate[] = [
  { id: "t-frcc", institutionId: "frcc", academicYear: "unsourced", perCredit: null, residency: "in-state", sourceId: "src-sample" },
  { id: "t-cub", institutionId: "cub", academicYear: "unsourced", perCredit: null, residency: "in-state", sourceId: "src-sample" },
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
export const requirements: DegreeRequirement[] = [
  { id: "req-written", programId: "frcc-aa-sample", label: "Written communication", sourceId: "src-sample",
    rule: { type: "all", rules: [{ type: "course", courseId: "frcc:ENG-1021", minGrade: "C" }, { type: "course", courseId: "frcc:ENG-1022", minGrade: "C" }] } },
  { id: "req-science", programId: "frcc-aa-sample", label: "Natural science (one course)", sourceId: "src-sample",
    rule: { type: "any", rules: [{ type: "course", courseId: "frcc:GEY-1108" }, { type: "course", courseId: "frcc:GEY-1111" }] } },
  { id: "req-humanities", programId: "frcc-aa-sample", label: "Arts & humanities (6 credits)", sourceId: "src-sample",
    rule: { type: "credits", min: 6, from: { type: "group", courseIds: ["frcc:HIS-1120", "frcc:PHI-1014", "frcc:PHI-1030"] } } },
  { id: "req-electives", programId: "frcc-aa-sample", label: "Electives (6 credits)", sourceId: "src-sample",
    rule: { type: "credits", min: 6, from: { type: "group", courseIds: ["frcc:ENP-1005", "frcc:AIR-2001"] } } },
];
