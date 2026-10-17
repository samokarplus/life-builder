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

// Careers, access routes and real people (read 2026-10-16)
v("src-frcc-hs", "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html", "FRCC Concurrent Enrollment: college classes for public high school students in grades 9-12.", "frcc");
v("src-frcc-wue", "https://www.frontrange.edu/admissions-aid/paying-for-college/tuition-discount-programs/wue.html", "FRCC Western Undergraduate Exchange page: eligibility, price rule and how to apply. Dollar figures belong to src-frcc-tuition-2627, with separate rates for online/nursing.", "frcc");
v("src-frcc-b2b", "https://www.frontrange.edu/student-experience/transfer-planning/bridge-to-bachelor.html", "FRCC Bridge to Bachelor's page: guaranteed admission to participating four-year schools. Partner schools appear as logos; names were read from the image labels.", "frcc");
v("src-frcc-transfer-guides", "https://www.frontrange.edu/student-experience/transfer-planning/transfer-guides.html", "FRCC transfer guides and agreements, including statewide and institution-specific agreements.", "frcc");
v("src-dora-nursing-apps", "https://dpo.colorado.gov/Nursing/Applications", "Colorado DORA nursing applications and forms: RN by exam (two-part process), endorsement, certified nurse aide.");
v("src-dora-nursing-faq", "https://dpo.colorado.gov/Nursing/FAQ", "Colorado DORA nursing FAQ: working before licensure, NCLEX attempts, approved programs.");
v("src-frcc-adn", "https://www.frontrange.edu/programs-courses/program-list/nursing-program/larimer-campus-nursing/associate-degree-admissions.html", "FRCC Larimer Campus Associate Degree Nursing admissions page. Other campuses may differ.", "frcc");
v("src-dora-electrical", "https://dpo.colorado.gov/Electrical/Applications", "Colorado DORA electrical applications and licensure requirements (residential wireman, journeyman, master, reciprocity).");
v("src-cde-teacher", "https://ed.cde.state.co.us/cdeprof/teacherreqs", "Colorado Department of Education: teacher license requirements and routes.");
v("src-dora-medical", "https://dpo.colorado.gov/Medical/DRLicenseRequirements", "Colorado Medical Board: physician licensing requirements.");
v("src-cu-som-timeline", "https://medschool.cuanschutz.edu/education/md-admissions/requirements/timeline-dates-to-remember", "CU School of Medicine MD admissions timeline (2026-2027 cycle).");
v("src-cu-som-req", "https://medschool.cuanschutz.edu/education/md-admissions/requirements", "CU School of Medicine MD admission requirements (MCAT, letters, degree).");
v("src-cdphe-ems", "https://cdphe.colorado.gov/emergency-care/emergency-medical-services/ems-providers/ems-provider-certification", "Colorado CDPHE: EMS provider certification steps and requirements.");
v("src-nasa-2025-class", "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/", "NASA release (Sept. 22, 2025): the 2025 astronaut candidate class and its backgrounds.");
v("src-cu-aero-astronauts", "https://www.colorado.edu/aerospace/about-us/astronauts-affiliated-cu", "CU Boulder Aerospace: astronauts affiliated with CU, with degrees and flights (undated list).", "cub");
v("src-frcc-story-bitler", "https://blog.frontrange.edu/2020/12/02/during-covid-alumnus-gets-creative-with-care-at-local-nursing-homes/", "FRCC blog (Dec. 2020): alumnus Joel Bitler. A college-published story; outcomes are as reported there.", "frcc");
v("src-frcc-story-guida", "https://blog.frontrange.edu/2023/09/06/graduate-starts-paramedic-career-with-care-forward-colorado/", "FRCC blog (Sept. 2023): graduate Tom Guida and Care Forward Colorado. A college-published story.", "frcc");
v("src-frcc-story-andrade", "https://blog.frontrange.edu/2026/05/12/first-generation-graduate-pursues-dream-of-becoming-a-flight-nurse/", "FRCC news (May 2026): graduate Alyssa Andrade's commencement story. A college-published story.", "frcc");

v("src-cdphe-ems-reciprocity", "https://cdphe.colorado.gov/emergency-care/emergency-medical-services/ems-providers/ems-provider-reciprocity", "CDPHE reciprocity page, read live 2026-10-16: no automatic practice from another state’s credential. ACLS wording differs from the initial-certification page; confirm level-specific rules.");
v("src-frcc-general-admission", "https://www.frontrange.edu/", "FRCC homepage advertises automatic admission for applicants over 17; selective programs and younger applicants have separate conditions.", "frcc");

v("src-cccs-b2b", "https://cccs.edu/our-colleges/colleges/transfer-programs/bridge-to-bachelors/", "Read 2026-10-16: 13 partner destination URLs in University Partners (12 Colorado plus WGU); Special Programs text names Texas Southern and Coppin State. Does not corroborate FRCC’s Saint Augustine’s logo.");

v("src-frcc-nursing-overview", "https://frontrange.edu/programs-courses/program-list/nursing-program/index.html", "Live browser read 2026-10-16: AAS nursing offered at Larimer and Westminster; Boulder County is not listed.", "frcc");
v("src-frcc-west-adn", "https://www.frontrange.edu/programs-courses/program-list/nursing-program/westminster-campus-nursing/associate-degree-admissions.html", "Read 2026-10-16: top-40 ranking, five HESI subjects and campus-specific in-progress transcript instructions and 30-business-day notification wording.", "frcc");

/** Complete at module evaluation, independent of route import order. */
export const sources: readonly Readonly<DataSource>[] = Object.freeze(registry.map(s => Object.freeze(s)));
const byId = new Map(sources.map(s => [s.id, s]));
if (byId.size !== sources.length) throw new Error("Duplicate DataSource ID");
export const sourceById = (id: string) => byId.get(id);
