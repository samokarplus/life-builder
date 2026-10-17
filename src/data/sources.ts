import type { DataSource } from "@/lib/types";
import { GT_SOURCE_ID } from "./frcc-gtpathways-raw";

const registry: DataSource[] = [
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

/** Official sources checked by hand on the verification date below. Only figures stated on these pages are loaded. */
export const VERIFIED_ON = "2026-10-16";
registry.push(
  {
    id: "src-frcc-aa-2627",
    url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree",
    institutionId: "frcc",
    catalogYear: "2026-2027",
    lastVerified: VERIFIED_ON,
    status: "verified",
    note: "FRCC catalog, Associate of Arts degree page. Titles, credits and requirement structure as listed there.",
  },
  {
    id: "src-frcc-electives-2627",
    url: "https://frontrange.smartcatalogiq.com/en/current/catalog/elective-lists/approved-elective-list",
    institutionId: "frcc",
    catalogYear: "2026-2027",
    lastVerified: VERIFIED_ON,
    status: "verified",
    note: "FRCC catalog, Approved Elective List (category sections expanded and transcribed).",
  },
  {
    id: "src-frcc-tuition-2627",
    url: "https://frontrange.edu/admissions-aid/paying-for-college/tuition-fees/tuition-rates.html",
    institutionId: "frcc",
    catalogYear: "2026-2027",
    lastVerified: VERIFIED_ON,
    status: "verified",
    note: "FRCC published 2026-2027 tuition rates (excludes campus fees).",
  },
  {
    id: "src-cub-tuition-unresolved",
    url: "https://www.colorado.edu/bursar/",
    institutionId: "cub",
    catalogYear: null,
    lastVerified: null,
    status: "unverified",
    note: "Search results for CU Boulder per-credit tuition disagreed with each other, so no figure is loaded. Confirm with the CU Boulder Bursar.",
  },
);

registry.push({
  id: GT_SOURCE_ID,
  url: "https://frontrange.smartcatalogiq.com/current/catalog/elective-lists/gt-pathway-courses/",
  institutionId: "frcc",
  catalogYear: "2026-2027",
  lastVerified: VERIFIED_ON,
  status: "verified",
  note: "FRCC catalog, GT Pathway Courses list. Titles, credits and gtPathways categories as listed there.",
});


registry.push(
  { id: "src-cud-cmhc", url: "https://education.ucdenver.edu/academics/graduate/counseling/detail/ma-counseling-clinical-mental-health", institutionId: "cud", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Denver School of Education & Human Development: MA in Counseling, Clinical Mental Health program page (deadlines, requirements, interview dates). The program's own page says 63 credits." },
  { id: "src-cacrep-co", url: "https://www.cacrep.org/directory/", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CACREP directory, state = CO, statuses Accredited / 2 Year / 8 Year (22 program rows read on the verification date). Statuses and cycle end dates change, so re-check the directory." },
  { id: "src-cub-grad-deadlines", url: "https://www.colorado.edu/graduateschool/admissions/where-begin/program-information-deadlines", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "unverified", note: "Previously transcribed Graduate School table; it did not load in this review. Current Aerospace claims use the department’s own application and deadline pages instead." },
);

registry.push(
  { id: "src-cub-transfer-timeline", url: "https://www.colorado.edu/admissions/process/transfer/timeline", institutionId: "cub", catalogYear: "2027 transfer cycle", lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Transfer Timeline page: month/day deadlines; no year printed per date." },
  { id: "src-cub-aes-grad", url: "https://www.colorado.edu/academics/grad-aerospace-engineering-sciences", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Aerospace Engineering Sciences graduate degrees page. It does not list application deadlines or GRE policy; use the department’s application and deadline pages." },
  { id: "src-nasa-astronaut", url: "https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "NASA 'Become an Astronaut' page (page dated Mar 27, 2026; some wording refers to the 2025 cycle). Applications are accepted as needed." },
  { id: "src-co-lpc-rules", url: "https://www.sos.state.co.us/CCR/DisplayRule.do?action=ruleinfo&ruleId=2318&deptID=18&agencyID=61&deptName=Department%20of%20Regulatory%20Agencies&agencyName=Division%20of%20Professions%20and%20Occupations%20-%20Board%20of%20Licensed%20Professional%20Counselor%20Examiners&seriesNum=4%20CCR%20737-1", institutionId: null, catalogYear: "4 CCR 737-1, effective 2025-09-14", lastVerified: VERIFIED_ON, status: "verified", note: "Colorado Code of Regulations, State Board of Licensed Professional Counselor Examiners, current version effective 09/14/2025 (read from the official PDF)." },
  { id: "src-dora-lpc-apps", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "Colorado DORA Division of Professions and Occupations, Professional Counselor Applications and Forms page." },
  { id: "src-dora-faq", url: "https://dpo.colorado.gov/MentalHealth/FAQ", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "Colorado DORA Mental Health FAQ." },
  { id: "src-cacrep", url: "https://www.cacrep.org/directory/", institutionId: null, catalogYear: null, lastVerified: null, status: "unverified", note: "CACREP is the counseling program accreditor. No program list is loaded; use its directory." },
);

registry.push(
  { id: "src-cub-bio-faculty", url: "https://www.colorado.edu/bioastronautics/faculty", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics: Faculty page, plus each person's own Smead Aerospace Engineering Sciences profile." },
  { id: "src-cub-bio-home", url: "https://www.colorado.edu/bioastronautics/", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics home page." },
  { id: "src-cub-bio-curriculum", url: "https://www.colorado.edu/bioastronautics/curriculum", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics curriculum page." },
);

const v = (id: string, url: string, note: string, institutionId: string | null = null) =>
  registry.push({ id, url, institutionId, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note });

v("src-fafsa-fill", "https://studentaid.gov/apply-for-aid/fafsa/filling-out", "Federal Student Aid: Filling Out the FAFSA form.");
v("src-fafsa-deadlines", "https://studentaid.gov/apply-for-aid/fafsa/fafsa-deadlines", "Federal Student Aid: FAFSA application deadlines (2027-28 listing). Colorado's entry says to contact the financial aid office of the school you plan to attend.");
v("src-cub-fafsa", "https://www.colorado.edu/financialaid/apply-aid/fafsa", "CU Boulder Office of Financial Aid: Completing the FAFSA, with its annual timeline.", "cub");
v("src-cub-firstgen", "https://www.colorado.edu/scholarships/first-generation", "CU Boulder Office of Scholarship Services: First Generation Scholarship.", "cub");
v("src-cosgc", "https://www.colorado.edu/center/spacegrant/student-involvement-opportunities-space-grant", "NASA Colorado Space Grant Consortium: student involvement opportunities.", "cub");
v("src-cub-bio-awards", "https://www.colorado.edu/bioastronautics/student-awards", "CU Boulder Bioastronautics: Student Awards page (2025 and 2026 entries).", "cub");


for (const [id, path] of [["clark", "torin-clark"], ["hayman", "allie-hayman"], ["nabity", "james-nabity"], ["arquilla", "katya-arquilla"], ["klaus", "david-klaus"]]) {
  v(`src-cub-profile-${id}`, `https://www.colorado.edu/aerospace/${path}`, "Official faculty profile: title, education, selected awards and research interests.", "cub");
}
v("src-cub-bio-equipment", "https://www.colorado.edu/bioastronautics/laboratory-equipment", "Bioastronautics laboratory equipment names; access and availability are not confirmed.", "cub");

v("src-cub-aes-apply", "https://www.colorado.edu/aerospace/admissions/graduates/how-apply", "Aerospace department application requirements, including degree-specific GRE policy.", "cub");
v("src-cub-aes-deadlines", "https://www.colorado.edu/aerospace/admissions/graduates/deadlines-fees", "Aerospace department spring and fall application deadlines.", "cub");

/** Complete at module evaluation, independent of route import order. */
export const sources: readonly Readonly<DataSource>[] = Object.freeze(registry.map(s => Object.freeze(s)));
const byId = new Map(sources.map(s => [s.id, s]));
if (byId.size !== sources.length) throw new Error("Duplicate DataSource ID");
export const sourceById = (id: string) => byId.get(id);
