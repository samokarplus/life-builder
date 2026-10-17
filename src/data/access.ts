/**
 * Ways in for people at different starting points: high school students, people coming from out of
 * state, and people starting without a college degree. Each item cites the official page it came from.
 */
export type Audience = "high-school" | "out-of-state" | "no-degree";

export interface AccessOption {
  id: string;
  audience: Audience;
  title: string;
  summary: string;
  facts: string[];
  sourceId: string;
  url: string;
  caveat?: string;
}

export const audienceLabels: Record<Audience, string> = {
  "high-school": "I'm in high school",
  "out-of-state": "I'm from out of state",
  "no-degree": "I'm starting without a degree",
};

export const accessOptions: AccessOption[] = [
  {
    id: "concurrent-enrollment", audience: "high-school", title: "Take FRCC classes while in high school (concurrent enrollment)",
    summary: "Public high school students in grades 9-12 can take college classes for high school and college credit. Tuition is paid by the school district or charter school and the College Opportunity Fund.",
    facts: ["Programs listed: ASCENT, High School Select, Campus Select, P-TECH and TREP.", "Programs vary by campus: Boulder County, Larimer and Westminster each list their own.", "Contacts on the page: Boulder County Campus 303-678-3820, Larimer Campus 970-204-8370, Westminster Campus 303-404-5089."],
    sourceId: "src-frcc-hs", url: "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html",
    caveat: "Which program fits you depends on your school district. Start with your high school counselor.",
  },
  {
    id: "b2b-from-hs", audience: "high-school", title: "Bridge to Bachelor's: a guaranteed seat at a four-year school",
    summary: "If you start at a Colorado Community College System college (FRCC is one) and finish an associate degree, you're guaranteed admission to a participating four-year college or university.",
    facts: ["Opt in when you apply, or within your first semester.", "Keep a 2.0 minimum GPA.", "Finish an Associate of Arts or Associate of Science degree.", "CCCS colleges accept anyone who applies; entrance exams like the ACT or SAT aren't required for admission or for this program."],
    sourceId: "src-frcc-b2b", url: "https://www.frontrange.edu/student-experience/transfer-planning/bridge-to-bachelor.html",
  },
  {
    id: "wue", audience: "out-of-state", title: "Western Undergraduate Exchange (WUE) at FRCC",
    summary: "A \"guest pass\" for students who keep residency in another Western state. You pay less than regular non-resident tuition, but you're declaring that you are not a Colorado resident.",
    facts: ["FRCC's 2026-27 listed rate: Western Undergraduate Exchange $275.60 per credit, versus regular non-resident $754.25 per credit (tuition only, excluding fees).", "The WUE page says eligible students pay 50 percent more than in-state tuition.", "Apply to the Registrar's Office no later than 30 days after your earliest course starts, and apply again every semester.", "If you're under 23, include your parent's documentation.", "If you plan to become a Colorado resident and petition for in-state rates, the page recommends not claiming another state as your residence."],
    sourceId: "src-frcc-wue", url: "https://www.frontrange.edu/admissions-aid/paying-for-college/tuition-discount-programs/wue.html",
    caveat: "Which states qualify comes from the WUE program's own list, which we didn't load. Check it before planning around WUE.",
  },
  {
    id: "b2b-partners", audience: "out-of-state", title: "Bridge to Bachelor's partner schools, including out of state",
    summary: "The partner list shows Colorado four-year schools and some schools outside Colorado or online.",
    facts: ["Colorado: Colorado State University, CU Denver, UCCS, CU Boulder, Metropolitan State University, Fort Lewis College, Colorado Mesa University, Regis University, CSU Pueblo, Western Colorado University, University of Northern Colorado, Adams State University.", "Also listed: Western Governors University, Texas Southern University and Saint Augustine's University.", "The page says more partners are coming."],
    sourceId: "src-frcc-b2b", url: "https://www.frontrange.edu/student-experience/transfer-planning/bridge-to-bachelor.html",
    caveat: "Partner names were read from the logo labels on the page. Each school sets its own program rules, so confirm with that school.",
  },
  {
    id: "transfer-agreements", audience: "out-of-state", title: "FRCC transfer agreements, in and out of state",
    summary: "FRCC's statewide agreements get you to a public Colorado university as a junior with no more than 60 additional credits. For other schools, the page points to a list of four-year colleges, both in Colorado and out of state.",
    facts: ["Institution-specific agreements listed include American Sign Language to UNC, Architectural Studies and Recording Arts to the University of Colorado, Health Promotion, Hospitality and Nutrition to CSU, Integrated Health Professionals to Metropolitan State, and Pharmaceutical Science to Regis (Pharm.D.).", "Because colleges set their own degree requirements, agreements vary by school and program."],
    sourceId: "src-frcc-transfer-guides", url: "https://www.frontrange.edu/student-experience/transfer-planning/transfer-guides.html",
  },
  {
    id: "moving-licenses", audience: "out-of-state", title: "Moving to Colorado with a license or certification",
    summary: "Colorado handles out-of-state credentials differently by profession.",
    facts: ["Electricians: journeyman reciprocity with Alaska, Arkansas, Idaho, Iowa, Minnesota, Montana, Nebraska, New Hampshire, New Mexico, North Dakota, Oklahoma, South Dakota, Utah and Wyoming, if you held the license at least 1 year and passed a state exam. Endorsement is available for other active licenses earned on the current NEC.", "Counselors (LPC): Colorado has no reciprocity; licensed counselors from elsewhere apply by endorsement.", "Physicians: no automatic reciprocity; the Board licenses on the basis of examination.", "EMS providers: Colorado does not have a reciprocity process."],
    sourceId: "src-dora-electrical", url: "https://dpo.colorado.gov/Electrical/Applications",
    caveat: "Counselor, physician and EMS statements come from DORA, DORA and CDPHE pages cited on those career routes.",
  },
  {
    id: "open-admission", audience: "no-degree", title: "FRCC accepts anyone who applies",
    summary: "The Colorado Community College System says its colleges accept anyone who applies, with no entrance exams like the ACT or SAT required for admission.",
    facts: ["Some programs, like nursing, are selective and have their own application windows."],
    sourceId: "src-frcc-b2b", url: "https://www.frontrange.edu/student-experience/transfer-planning/bridge-to-bachelor.html",
  },
  {
    id: "care-forward", audience: "no-degree", title: "Care Forward Colorado: zero-cost entry-level health care training",
    summary: "A state program that provides zero-cost pathways for entry-level health care jobs. One FRCC student's tuition, fees and materials for the EMS program were covered, saving about $3,000.",
    facts: ["FRCC's story says more than 1,000 Colorado Community College System students have graduated with this support.", "The student went from the EMS program to a job offer at an ambulance company before finishing."],
    sourceId: "src-frcc-story-guida", url: "https://blog.frontrange.edu/2023/09/06/graduate-starts-paramedic-career-with-care-forward-colorado/",
    caveat: "This comes from a 2023 college story. Eligibility and covered programs change, so ask FRCC or CCCS what applies now.",
  },
  {
    id: "cna", audience: "no-degree", title: "Certified Nurse Aide: a first step into nursing",
    summary: "Colorado's Board of Nursing has authorized an outside testing company to process the nurse aide exam, and it keeps a list of approved nurse aide training programs.",
    facts: ["The certification exam is the NNAAP Nurse Aide Exam.", "Training programs give graduates a certificate; keep your original, because programs only keep records for two years."],
    sourceId: "src-dora-nursing-apps", url: "https://dpo.colorado.gov/Nursing/Applications",
  },
  {
    id: "electrician-apprentice", audience: "no-degree", title: "Electrician: start as a registered apprentice",
    summary: "You can start working toward an electrician license without a college degree by registering as an electrical apprentice and logging supervised hours.",
    facts: ["Apply for Electrical Apprentice initial registration through DORA's online system.", "All practical experience must be documented on an Affidavit of Experience completed by the supervising electrical contractor.", "Journeyman needs 288 hours of classroom education plus 8,000 hours of experience over at least 4 years."],
    sourceId: "src-dora-electrical", url: "https://dpo.colorado.gov/Electrical/Applications",
  },
  {
    id: "ems-cert", audience: "no-degree", title: "EMT: take an EMS course, pass NREMT, get certified",
    summary: "The state route is a full EMS provider course at your target level, the NREMT written and psychomotor exams, then Colorado certification.",
    facts: ["No college degree is listed as a requirement on the certification page.", "You need a fingerprint-based background check and a current CPR card."],
    sourceId: "src-cdphe-ems", url: "https://cdphe.colorado.gov/emergency-care/emergency-medical-services/ems-providers/ems-provider-certification",
  },
];
