import { sources, VERIFIED_ON } from "./sample";
import "./programs";

/**
 * Dream Paths: multi-step routes from where you are to a specific career. Each step carries the
 * source it came from. Steps from an official page we could read are "verified"; steps whose
 * only support is a search excerpt (official sites blocked automated reading) are "unverified"
 * and shown as "confirm with the official source".
 */
sources.push(
  { id: "src-cub-transfer-timeline", url: "https://www.colorado.edu/admissions/transfer/timeline", institutionId: "cub", catalogYear: "2027 transfer cycle", lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Transfer Timeline page: month/day deadlines; no year printed per date." },
  { id: "src-cub-aes-grad", url: "https://www.colorado.edu/academics/grad-aerospace-engineering-sciences", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Aerospace Engineering Sciences graduate degrees page. It does not list application deadlines or GRE policy; use the Graduate School deadlines page." },
  { id: "src-nasa-astronaut", url: "https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "NASA 'Become an Astronaut' page (page dated Mar 27, 2026; some wording refers to the 2025 cycle). Applications are accepted as needed." },
  { id: "src-co-lpc-rules", url: "https://www.sos.state.co.us/CCR/DisplayRule.do?action=ruleinfo&ruleId=2318&deptID=18&agencyID=61&deptName=Department%20of%20Regulatory%20Agencies&agencyName=Division%20of%20Professions%20and%20Occupations%20-%20Board%20of%20Licensed%20Professional%20Counselor%20Examiners&seriesNum=4%20CCR%20737-1", institutionId: null, catalogYear: "4 CCR 737-1, effective 2025-09-14", lastVerified: VERIFIED_ON, status: "verified", note: "Colorado Code of Regulations, State Board of Licensed Professional Counselor Examiners, current version effective 09/14/2025 (read from the official PDF)." },
  { id: "src-dora-lpc-apps", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "Colorado DORA Division of Professions and Occupations, Professional Counselor Applications and Forms page." },
  { id: "src-dora-faq", url: "https://dpo.colorado.gov/MentalHealth/FAQ", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "Colorado DORA Mental Health FAQ." },
  { id: "src-cacrep", url: "https://www.cacrep.org/directory/", institutionId: null, catalogYear: null, lastVerified: null, status: "unverified", note: "CACREP is the counseling program accreditor. No program list is loaded; use its directory." },
);

export type StepKind = "degree" | "transfer" | "application" | "exam" | "experience" | "license" | "selection" | "requirement";

export type Stage = "high-school" | "community-college" | "university" | "graduate" | "career";
export const stageLabels: Record<Stage, string> = { "high-school": "High school", "community-college": "Community college", university: "University", graduate: "Graduate school", career: "Working toward licensure or a job" };
export const stageOrder: Stage[] = ["high-school", "community-college", "university", "graduate", "career"];

export interface PathwayStep {
  id: string;
  stage: Stage;
  kind: StepKind;
  title: string;
  detail: string;
  facts?: string[]; // specific stated requirements
  sourceId: string;
  /** Marks a step whose dates are computed from the student's chosen CU Boulder transfer entry term. */
  deadlines?: "cu-transfer";
  /** Show the Colorado CACREP counseling program finder under this step. */
  programFinder?: "co-counseling" | "cu-bioastronautics";
  funding?: { label: string; note: string; sourceId: string }[];
  links?: { label: string; url: string }[];
}

export interface Pathway {
  id: string;
  title: string;
  career: string;
  jurisdiction: string;
  summary: string;
  steps: PathwayStep[];
  caution: string;
}

export const pathways: Pathway[] = [
  {
    id: "lpc-colorado",
    title: "Licensed Professional Counselor in Colorado",
    career: "Therapist / Counselor",
    jurisdiction: "Colorado",
    summary: "Community college, bachelor's, a counseling master's, supervised clinical hours, then licensure through Colorado DORA.",
    caution: "Read from Colorado's official rules (4 CCR 737-1, effective 2025-09-14) and DORA pages on 2026-10-16. Rules change, so confirm with DORA before you act. This is a planning guide, not licensing advice.",
    steps: [
      { id: "lpc-1", stage: "community-college", kind: "degree", title: "Associate of Arts at FRCC", detail: "Finish the 60-credit AA (see My Roadmap). A Colorado AA is built from gtPathways courses so they transfer to Colorado public universities.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "lpc-2", stage: "community-college", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student. Dates below follow your chosen entry term.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA are due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "lpc-3", stage: "university", kind: "degree", title: "Bachelor's degree (psychology, sociology, philosophy and similar)", detail: "Colorado's licensing rules start at the master's level, so the bachelor's major is up to you and to each counseling program's admission requirements. Check those program pages; none are loaded here.", sourceId: "src-co-lpc-rules" },
      { id: "lpc-4", stage: "graduate", kind: "degree", title: "Master's in counseling from a CACREP-approved program", detail: "The Board requires a master's or doctoral degree from a CACREP-approved program. If you enroll after August 31, 2014 the program must be at least 60 semester credit hours. Graduates of non-CACREP programs must show equivalence, through a program the Board has deemed equivalent or a review by a Board-approved credentialing agency (DORA contracts with the Center for Credentialing & Education).", facts: ["CACREP-approved master's or doctorate", "At least 60 semester credit hours if enrolled after Aug 31, 2014", "Non-CACREP degrees need an equivalency review (CCE)"], sourceId: "src-co-lpc-rules", programFinder: "co-counseling", links: [{ label: "CACREP program directory", url: "https://www.cacrep.org/directory/" }, { label: "Center for Credentialing & Education", url: "https://www.cce-global.org" }] },
      { id: "lpc-5", stage: "graduate", kind: "exam", title: "Take the national counseling exam", detail: "The national exam is the NBCC counselor certification examination. You may apply to take it in your last semester or quarter of graduate school. Results stay valid for up to five years.", facts: ["Administered through the National Board for Certified Counselors (NBCC)", "Results valid up to five years"], sourceId: "src-co-lpc-rules" },
      { id: "lpc-6", stage: "graduate", kind: "requirement", title: "Pass the Colorado jurisprudence exam and register as a candidate", detail: "Post-degree work experience and supervision hours count toward licensure only if you are registered as a candidate (LPCC) before you start accumulating them. The jurisprudence exam is required for both candidate registration and licensure, and it is only valid for one year from when it was issued.", facts: ["Register as a candidate BEFORE counting post-degree hours", "Jurisprudence exam required for candidate registration and licensure", "Jurisprudence results valid one year", "Candidate registration expires December 31 every 3 years"], sourceId: "src-dora-lpc-apps", links: [{ label: "DORA applications and forms", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications" }] },
      { id: "lpc-7", stage: "career", kind: "experience", title: "Supervised post-master's practice", detail: "At least two years of post-master's practice under clinical supervision, with at least 2,000 hours including at least 1,500 hours of face-to-face client contact. It cannot be completed in fewer than 24 months, even with more than one supervisor.", facts: ["At least 2,000 hours of practice, 1,500 of them face-to-face with clients", "Cannot be completed in under 24 months", "At least 50 supervision hours per 1,000 practice hours, at least 25 individual; the rest triadic or group (at most 10 supervisees per supervisor)", "Hours older than 5 years are not accepted", "Hours from another state count only if they meet Colorado's requirements"], sourceId: "src-co-lpc-rules" },
      { id: "lpc-8", stage: "career", kind: "license", title: "Apply for LPC licensure online", detail: "Apply through DORA's online services system, with fingerprinting and a background check. Colorado has no reciprocity with other states; licensed counselors from elsewhere apply by endorsement. LPC licenses expire August 31 of odd-numbered years.", facts: ["Applicant must be at least 21", "Colorado does not have reciprocity; apply by endorsement if licensed elsewhere", "LPC licenses expire August 31 of odd-numbered years"], sourceId: "src-dora-lpc-apps", links: [{ label: "DORA applications and forms", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications" }, { label: "Mental health FAQ", url: "https://dpo.colorado.gov/MentalHealth/FAQ" }] },
    ],
  },
  {
    id: "astronaut-bioastronautics",
    title: "NASA astronaut, bioastronautics route at CU Boulder",
    career: "Astronaut",
    jurisdiction: "United States (NASA)",
    summary: "A STEM bachelor's, a STEM master's (CU Boulder Aerospace Engineering Sciences lists Bioastronautics as a research area), years of professional experience, then NASA's as-needed selection.",
    caution: "Astronaut selection is extremely competitive and NASA opens applications only when it needs a new class. This route is one way to meet the stated minimums, not a prediction of selection.",
    steps: [
      { id: "ast-1", stage: "community-college", kind: "degree", title: "Associate of Arts or STEM-focused transfer prep at FRCC", detail: "Build math and lab-science foundations early. Your AA tracker shows which gtPathways areas are done.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "ast-2", stage: "community-college", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student; dates follow your entry term. Engineering and science majors may have their own prerequisites; check the program pages.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "ast-3", stage: "university", kind: "degree", title: "Bachelor's degree in a STEM field", detail: "NASA's master's requirement must be in engineering, biological science, physical science, computer science or mathematics.", sourceId: "src-nasa-astronaut", links: [{ label: "NASA: Become an Astronaut", url: "https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/" }] },
      { id: "ast-4", stage: "graduate", kind: "degree", title: "Master's in a STEM field at CU Boulder", detail: "Aerospace Engineering Sciences offers an MS (thesis or non-thesis), an online Professional MS, and a PhD, and lists Bioastronautics among its research areas. The Graduate School's table gives its deadlines and test policy.", facts: ["MS, PhD and Professional MS", "GRE not required", "Application deadlines: Spring Oct. 1, Fall Dec. 1", "Contact the department: aerograd@colorado.edu", "Bioastronautics is listed as a research area; the page does not say it is a selectable MS focus area"], sourceId: "src-cub-grad-deadlines", programFinder: "cu-bioastronautics", links: [{ label: "CU Boulder Graduate School deadlines table", url: "https://www.colorado.edu/graduateschool/admissions/where-begin/program-information-deadlines" }, { label: "CU Boulder Aerospace Engineering Sciences, graduate", url: "https://www.colorado.edu/academics/grad-aerospace-engineering-sciences" }] },
      { id: "ast-5", stage: "career", kind: "experience", title: "Professional experience", detail: "NASA's page states a minimum of three years of related professional experience after your degree, or 1,000 pilot-in-command hours (at least 850 in high-performance jet aircraft).", facts: ["Three years related professional experience after degree", "or 1,000 pilot-in-command hours, 850 in high-performance jets"], sourceId: "src-nasa-astronaut" },
      { id: "ast-6", stage: "career", kind: "requirement", title: "U.S. citizenship and the long-duration astronaut physical", detail: "Both are stated basic qualifications.", facts: ["U.S. citizen", "Pass the NASA long-duration flight astronaut physical"], sourceId: "src-nasa-astronaut" },
      { id: "ast-7", stage: "career", kind: "application", title: "Apply when NASA opens a selection", detail: "NASA accepts applications as needed, with new classes recently chosen about every four years. The page notes a 2020 window of March 2 to 31 and a 2025 candidate class announced September 22, 2025.", sourceId: "src-nasa-astronaut" },
      { id: "ast-8", stage: "career", kind: "selection", title: "Selection and candidate training", detail: "Details of selection stages were not on the page that was read. Check NASA's astronaut selection program pages.", sourceId: "src-nasa-astronaut" },
    ],
  },
];

export const pathwayById = (id: string) => pathways.find((p) => p.id === id);
