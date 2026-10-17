import { sources, VERIFIED_ON } from "./sample";

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
  { id: "src-co-lpc-statute", url: "https://dpo.colorado.gov/ProfessionalCounselor", institutionId: null, catalogYear: null, lastVerified: null, status: "unverified", note: "Colorado DORA's page and the statute mirror both blocked automated reading. Figures come from search excerpts of C.R.S. 12-245-604 (2024 text) and may predate SB24-115 changes. Confirm with DORA before relying on them." },
  { id: "src-cacrep", url: "https://www.cacrep.org/directory/", institutionId: null, catalogYear: null, lastVerified: null, status: "unverified", note: "CACREP is the counseling program accreditor. No program list is loaded; use its directory." },
);

export type StepKind = "degree" | "transfer" | "application" | "exam" | "experience" | "license" | "selection" | "requirement";

export interface PathwayStep {
  id: string;
  kind: StepKind;
  title: string;
  detail: string;
  facts?: string[]; // specific stated requirements
  sourceId: string;
  /** Marks a step whose dates are computed from the student's chosen CU Boulder transfer entry term. */
  deadlines?: "cu-transfer";
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
    caution: "Licensure rules are set by the state and changed recently (SB24-115). Treat everything marked 'confirm' as a lead, not advice, and verify with DORA.",
    steps: [
      { id: "lpc-1", kind: "degree", title: "Associate of Arts at FRCC", detail: "Finish the 60-credit AA (see My Roadmap). A Colorado AA is built from gtPathways courses so they transfer to Colorado public universities.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "lpc-2", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student. Dates below follow your chosen entry term.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA are due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "lpc-3", kind: "degree", title: "Bachelor's degree (psychology, sociology, philosophy and similar)", detail: "Counseling master's programs set their own prerequisites. Check each program's admissions page; none are loaded here.", sourceId: "src-cacrep" },
      { id: "lpc-4", kind: "degree", title: "Master's in counseling (from an accredited program)", detail: "Colorado requires a qualifying master's or doctoral degree in counseling. Many programs are CACREP-accredited; DORA reviews degrees that are not.", facts: ["Confirm with DORA which programs and accreditations qualify."], sourceId: "src-co-lpc-statute", links: [{ label: "CACREP program directory", url: "https://www.cacrep.org/directory/" }] },
      { id: "lpc-5", kind: "requirement", title: "Register with DORA before accruing hours", detail: "A recent Colorado law (SB24-115) reportedly added a registration step before post-degree hours; the jurisprudence exam is tied to it. Confirm the current process.", sourceId: "src-co-lpc-statute", links: [{ label: "DORA professional counselor page", url: "https://dpo.colorado.gov/ProfessionalCounselor" }] },
      { id: "lpc-6", kind: "experience", title: "Supervised counseling practice", detail: "Statute excerpt (2024 text): at least 2,000 hours of supervised practice including 1,500 hours of face-to-face client contact, with at least 50 hours of supervision per 1,000 hours (at least 25 of them individual).", facts: ["At least 2,000 supervised hours", "At least 1,500 hours direct client contact", "At least 50 supervision hours per 1,000 practice hours, 25 individual", "DPO states exam-route applicants cannot finish the 2,000 hours in under 24 months"], sourceId: "src-co-lpc-statute" },
      { id: "lpc-7", kind: "exam", title: "Licensing exams", detail: "A national counseling exam plus Colorado's jurisprudence exam. Which national exam and when are set by the board.", sourceId: "src-co-lpc-statute" },
      { id: "lpc-8", kind: "license", title: "Apply for LPC licensure", detail: "Submit the application, fee and verification of degree, hours and exams to DORA.", sourceId: "src-co-lpc-statute", links: [{ label: "DORA applications and forms", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications" }] },
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
      { id: "ast-1", kind: "degree", title: "Associate of Arts or STEM-focused transfer prep at FRCC", detail: "Build math and lab-science foundations early. Your AA tracker shows which gtPathways areas are done.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "ast-2", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student; dates follow your entry term. Engineering and science majors may have their own prerequisites; check the program pages.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "ast-3", kind: "degree", title: "Bachelor's degree in a STEM field", detail: "NASA's master's requirement must be in engineering, biological science, physical science, computer science or mathematics.", sourceId: "src-nasa-astronaut", links: [{ label: "NASA: Become an Astronaut", url: "https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/" }] },
      { id: "ast-4", kind: "degree", title: "Master's in a STEM field at CU Boulder", detail: "Aerospace Engineering Sciences offers an MS (thesis or non-thesis), an online Professional MS, and a PhD, and lists Bioastronautics among its research areas. The page does not state graduate application deadlines or GRE policy; use the Graduate School deadlines page.", facts: ["MS in Aerospace Engineering (thesis or non-thesis, with a focus area)", "Professional MS, can be completed fully online", "PhD", "Bioastronautics is listed as a research area; the page does not say it is a selectable MS focus area"], sourceId: "src-cub-aes-grad", links: [{ label: "CU Boulder Aerospace Engineering Sciences, graduate", url: "https://www.colorado.edu/academics/grad-aerospace-engineering-sciences" }, { label: "Graduate School program deadlines", url: "https://www.colorado.edu/graduateschool/admissions/where-begin/program-information-deadlines" }] },
      { id: "ast-5", kind: "experience", title: "Professional experience", detail: "NASA's page states a minimum of three years of related professional experience after your degree, or 1,000 pilot-in-command hours (at least 850 in high-performance jet aircraft).", facts: ["Three years related professional experience after degree", "or 1,000 pilot-in-command hours, 850 in high-performance jets"], sourceId: "src-nasa-astronaut" },
      { id: "ast-6", kind: "requirement", title: "U.S. citizenship and the long-duration astronaut physical", detail: "Both are stated basic qualifications.", facts: ["U.S. citizen", "Pass the NASA long-duration flight astronaut physical"], sourceId: "src-nasa-astronaut" },
      { id: "ast-7", kind: "application", title: "Apply when NASA opens a selection", detail: "NASA accepts applications as needed, with new classes recently chosen about every four years. The page notes a 2020 window of March 2 to 31 and a 2025 candidate class announced September 22, 2025.", sourceId: "src-nasa-astronaut" },
      { id: "ast-8", kind: "selection", title: "Selection and candidate training", detail: "Details of selection stages were not on the page that was read. Check NASA's astronaut selection program pages.", sourceId: "src-nasa-astronaut" },
    ],
  },
];

export const pathwayById = (id: string) => pathways.find((p) => p.id === id);
