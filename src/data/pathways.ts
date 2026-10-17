import { coloradoCareerRoutes } from "./career-expansion";

/**
 * Dream Paths: multi-step routes from where you are to a specific career. Each step carries the
 * source it came from. Steps from an official page we could read are "verified"; steps whose
 * only support is a search excerpt (official sites blocked automated reading) are "unverified"
 * and shown as "confirm with the official source".
 */


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
  additionalSourceIds?: string[];
  datedEvents?: { label: string; date: string; sourceId: string }[];
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
      { id: "lpc-0", stage: "high-school", kind: "requirement", title: "While you're still in high school: take college classes", detail: "Public high school students in grades 9-12 can take FRCC classes for high school and college credit through concurrent enrollment, with tuition paid by the school district or charter school and the College Opportunity Fund. Programs vary by campus, so start with your counselor.", facts: ["Current options: High School Select, Campus Select, P-TECH, TREP. FRCC says ASCENT ended June 30, 2026."], sourceId: "src-frcc-hs", links: [{ label: "FRCC concurrent enrollment", url: "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html" }] },
      { id: "lpc-1", stage: "community-college", kind: "degree", title: "Associate of Arts at FRCC", detail: "Finish the 60-credit AA (see My Roadmap). A Colorado AA is built from gtPathways courses so they transfer to Colorado public universities.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "lpc-2", stage: "community-college", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student. Dates below follow your chosen entry term.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA are due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "lpc-3", stage: "university", kind: "degree", title: "Bachelor's degree (psychology, sociology, philosophy and similar)", detail: "Colorado's licensing rules start at the master's level, so the bachelor's major is up to you and to each counseling program's admission requirements. Check those program pages; none are loaded here.", sourceId: "src-co-lpc-rules" },
      { id: "lpc-4", stage: "graduate", kind: "degree", title: "Counseling graduate degree: CACREP or approved equivalency", detail: "The Board accepts a counseling master's or doctoral degree through a CACREP-approved or Board-approved equivalent program. If you enroll after August 31, 2014 the program must be at least 60 semester credit hours. Graduates of non-CACREP programs must show equivalence, through a program the Board has deemed equivalent or a review by a Board-approved credentialing agency (DORA contracts with the Center for Credentialing & Education).", facts: ["CACREP-approved or Board-approved equivalent master's or doctorate", "At least 60 semester credit hours if enrolled after Aug 31, 2014", "Non-CACREP degrees need an equivalency review (CCE)"], sourceId: "src-co-lpc-rules", programFinder: "co-counseling", links: [{ label: "CACREP program directory", url: "https://www.cacrep.org/directory/" }, { label: "Center for Credentialing & Education", url: "https://www.cce-global.org" }] },
      { id: "lpc-5", stage: "graduate", kind: "exam", title: "Take the national counseling exam", detail: "The national exam is the NBCC counselor certification examination. You may apply to take it in your last semester or quarter of graduate school. Results stay valid for up to five years.", facts: ["Administered through the National Board for Certified Counselors (NBCC)", "Results valid up to five years"], sourceId: "src-co-lpc-rules" },
      { id: "lpc-6", stage: "graduate", kind: "requirement", title: "Pass the Colorado jurisprudence exam and register as a candidate", detail: "Post-degree work experience and supervision hours count toward licensure only if you hold candidate registration or another status permitted by DORA (including eligible exempt-facility practice) before accumulating them. The jurisprudence exam is required for both candidate registration and licensure, and it is only valid for one year from when it was issued.", facts: ["Establish candidate registration or another permitted status BEFORE counting hours", "Jurisprudence exam required for candidate registration and licensure", "Jurisprudence results valid one year", "Candidate registration expires December 31 every 3 years"], sourceId: "src-dora-lpc-apps", links: [{ label: "DORA applications and forms", url: "https://dpo.colorado.gov/ProfessionalCounselor/Applications" }] },
      { id: "lpc-7", stage: "career", kind: "experience", title: "Supervised post-master's practice", detail: "At least two years of post-master's practice under clinical supervision, with at least 2,000 hours including at least 1,500 hours of face-to-face client contact. It cannot be completed in fewer than 24 months, even with more than one supervisor.", facts: ["At least 2,000 hours of practice, 1,500 of them face-to-face with clients", "Cannot be completed in under 24 months", "At least 50 supervision hours per 1,000 practice hours, at least 25 individual; the rest triadic or group (at most 10 supervisees per supervisor)", "Hours older than 5 years generally are not accepted; Board good-cause and statutory exceptions may apply", "Hours from another state count only if they meet Colorado's requirements"], sourceId: "src-co-lpc-rules" },
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
      { id: "ast-0", stage: "high-school", kind: "requirement", title: "While you're still in high school: take college classes", detail: "Public high school students in grades 9-12 can take FRCC classes for high school and college credit through concurrent enrollment, with tuition paid by the school district or charter school and the College Opportunity Fund. Programs vary by campus, so start with your counselor.", facts: ["Current options: High School Select, Campus Select, P-TECH, TREP. FRCC says ASCENT ended June 30, 2026."], sourceId: "src-frcc-hs", links: [{ label: "FRCC concurrent enrollment", url: "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html" }] },
      { id: "ast-1", stage: "community-college", kind: "degree", title: "Associate of Arts or STEM-focused transfer prep at FRCC", detail: "Build math and lab-science foundations early. Your AA tracker shows which gtPathways areas are done.", sourceId: "src-frcc-aa-2627", links: [{ label: "FRCC AA catalog page", url: "https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree" }] },
      { id: "ast-2", stage: "community-college", kind: "transfer", title: "Transfer to CU Boulder", detail: "Apply as a transfer student; dates follow your entry term. Engineering and science majors may have their own prerequisites; check the program pages.", deadlines: "cu-transfer", sourceId: "src-cub-transfer-timeline", funding: [{ label: "CU Boulder Transfer Scholarship", note: "Application and need-based FAFSA due June 15 for fall entry. Award amounts were not on the page.", sourceId: "src-cub-transfer-timeline" }], links: [{ label: "CU Boulder transfer timeline", url: "https://www.colorado.edu/admissions/transfer/timeline" }] },
      { id: "ast-3", stage: "university", kind: "degree", title: "Bachelor's degree in a STEM field", detail: "NASA's master's requirement must be in engineering, biological science, physical science, computer science or mathematics.", sourceId: "src-nasa-astronaut", links: [{ label: "NASA: Become an Astronaut", url: "https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/" }] },
      { id: "ast-4", stage: "graduate", kind: "degree", title: "Master's in a STEM field at CU Boulder", detail: "Aerospace Engineering Sciences offers an MS (thesis or non-thesis), an online Professional MS, and a PhD, and lists Bioastronautics among its research areas. The department publishes its application deadlines and degree-specific GRE policy.", facts: ["MS, PhD and Professional MS", "GRE optional for PhD; not accepted for MS or Professional MS", "Application deadlines: Spring Oct. 1, Fall Dec. 1", "Check the Bioastronautics curriculum and your chosen degree’s current focus-area requirements"], sourceId: "src-cub-aes-apply", programFinder: "cu-bioastronautics", links: [{ label: "Aerospace application requirements", url: "https://www.colorado.edu/aerospace/admissions/graduates/how-apply" }, { label: "Aerospace deadlines", url: "https://www.colorado.edu/aerospace/admissions/graduates/deadlines-fees" }, { label: "CU Boulder Aerospace Engineering Sciences, graduate", url: "https://www.colorado.edu/academics/grad-aerospace-engineering-sciences" }] },
      { id: "ast-5", stage: "career", kind: "experience", title: "Professional experience", detail: "NASA's page states a minimum of three years of related professional experience after your degree, or 1,000 pilot-in-command hours (at least 850 in high-performance jet aircraft).", facts: ["Three years related professional experience after degree", "or 1,000 pilot-in-command hours, 850 in high-performance jets"], sourceId: "src-nasa-astronaut" },
      { id: "ast-6", stage: "career", kind: "requirement", title: "U.S. citizenship and the long-duration astronaut physical", detail: "Both are stated basic qualifications.", facts: ["U.S. citizen", "Pass the NASA long-duration flight astronaut physical"], sourceId: "src-nasa-astronaut" },
      { id: "ast-7", stage: "career", kind: "application", title: "Apply when NASA opens a selection", detail: "NASA accepts applications as needed, with new classes recently chosen about every four years. The page notes a 2020 window of March 2 to 31 and a 2025 candidate class announced September 22, 2025.", sourceId: "src-nasa-astronaut" },
      { id: "ast-8", stage: "career", kind: "selection", title: "Selection and candidate training", detail: "NASA describes application review, interviews and second interviews, followed by selection and two years of candidate training at Johnson Space Center. Leadership, teamwork and communication skills are also required. Confirm the next selection cycle; older June 2025 alternatives on the page are cycle-specific.", sourceId: "src-nasa-astronaut" },
    ],
  },
];

export const newPathways: Pathway[] = [
  {
    id: "rn-colorado",
    title: "Registered Nurse in Colorado",
    career: "Nurse",
    jurisdiction: "Colorado",
    summary: "Nursing prerequisites, a Board-approved nursing program (FRCC's Associate Degree in Nursing is one), the NCLEX exam, then a Colorado RN license from DORA.",
    caution: "Nursing programs are competitive and application windows are short. Read from DORA and FRCC pages on 2026-10-16; confirm current dates with the program.",
    steps: [
      { id: "rn-1", additionalSourceIds: ["src-dora-nursing-faq", "src-frcc-story-bitler"], stage: "high-school", kind: "requirement", title: "Optional first step: become a Certified Nurse Aide (CNA)", detail: "Colorado's Board of Nursing authorizes an outside testing company to process the nurse aide exam and keeps a list of approved training programs. An FRCC December 2020 story describes an alumnus who began as a CNA out of high school; this is not an age-eligibility determination.", facts: ["Exam: NNAAP Nurse Aide Exam", "Training programs give you a certificate; keep your original because programs keep records only two years"], sourceId: "src-dora-nursing-apps", links: [{ label: "DORA nursing applications and forms", url: "https://dpo.colorado.gov/Nursing/Applications" }] },
      { id: "rn-2", additionalSourceIds: ["src-frcc-nursing-overview", "src-frcc-west-adn"], stage: "community-college", kind: "requirement", title: "Apply to FRCC Larimer, meet advisors and finish prerequisites", detail: "These are Larimer campus admissions steps. FRCC lists the AAS nursing program at Larimer and Westminster, not Boulder County. Westminster also currently lists HESI A-2 and top-40 ranking, but has its own application and transcript instructions. Check the campus you intend to attend.", facts: ["Step 1: Apply to become a student at FRCC", "Step 2: Meet with advisors", "Step 3: Complete prerequisites", "Step 4: Transfer credit to FRCC, if applicable", "Step 5: Take the HESI A-2 exam", "Step 6: Apply to the Associate Degree Nursing program (the application is open only during its application period)"], sourceId: "src-frcc-adn", links: [{ label: "FRCC Associate Degree Nursing admissions (Larimer Campus)", url: "https://www.frontrange.edu/programs-courses/program-list/nursing-program/larimer-campus-nursing/associate-degree-admissions.html" }] },
      { id: "rn-3", stage: "community-college", kind: "application", title: "Get into the nursing program: it is competitive", detail: "At Larimer campus, each application is ranked, and the top 40 students are admitted each fall and spring semester. The number admitted may be reduced because of limits on clinical placements. The application period for Fall 2027 admission hadn't been announced on the page.", facts: ["New: the HESI A-2 now covers five subjects: Reading Comprehension, Math, Biology, Anatomy & Physiology, and Critical Thinking", "After admission you need immunizations, an AHA BLS Provider card, a drug screen and a background check"], sourceId: "src-frcc-adn" },
      { id: "rn-4", stage: "community-college", kind: "degree", title: "Complete a Board-approved nursing program", detail: "A nursing graduate may not work as a nurse until a Colorado license is issued, and nursing students may not practice outside their clinical education in a Board-approved program. ", facts: ["A traditional program includes faculty-supervised clinical practice taught alongside theory"], sourceId: "src-dora-nursing-faq", links: [{ label: "DORA nursing FAQ", url: "https://dpo.colorado.gov/Nursing/FAQ" }] },
      { id: "rn-5", stage: "career", kind: "exam", title: "Apply for exam approval, then take the NCLEX", detail: "Applying by exam is a two-part process: first the RN Exam Approval application (for authorization to test), then the license application only after you pass.", facts: ["Colorado test centers are in Greenwood Village, Colorado Springs and Westminster", "You get 3 opportunities to pass within 3 years of your first attempt", "You can retake after 45 days", "After 3 failures you can petition the Board for a fourth try within the 3 years"], sourceId: "src-dora-nursing-apps", additionalSourceIds: ["src-dora-nursing-faq"] },
      { id: "rn-6", stage: "career", kind: "license", title: "Apply for your RN license", detail: "Apply through DORA's online system, with fingerprinting and a background check. You may not work as a nurse while your application is pending.", sourceId: "src-dora-nursing-apps", links: [{ label: "DORA nursing applications and forms", url: "https://dpo.colorado.gov/Nursing/Applications" }] },
    ],
  },
  {
    id: "ems-colorado",
    title: "EMT in Colorado",
    career: "EMT",
    jurisdiction: "Colorado",
    summary: "A short route into emergency medical services: an EMS course, the NREMT exams, a background check and Colorado certification, with paramedic as a next level.",
    caution: "Colorado doesn't accept other states' EMS certifications automatically. Read from CDPHE pages on 2026-10-16.",
    steps: [
      { id: "ems-1", additionalSourceIds: ["src-frcc-story-guida"], stage: "high-school", kind: "degree", title: "Take a full EMS provider course at the level you want", detail: "Colorado's list of approved initial EMS education programs is on CDPHE's site. FRCC runs an EMS program, and a state program called Care Forward Colorado has covered tuition, fees and materials for entry-level health care training.", facts: ["Care Forward Colorado: zero-cost pathways for entry-level health care jobs (per a 2023 FRCC story; confirm current eligibility)"], sourceId: "src-cdphe-ems", links: [{ label: "CDPHE EMS provider certification", url: "https://cdphe.colorado.gov/emergency-care/emergency-medical-services/ems-providers/ems-provider-certification" }] },
      { id: "ems-2", stage: "community-college", kind: "exam", title: "Meet the current NREMT requirements for EMT", detail: "You must hold current National Registry of Emergency Medical Technicians (NREMT) registration at the level you intend to practice. Confirm the current level-specific examination and skills process with NREMT; the state page uses generic older exam-format wording.", sourceId: "src-cdphe-ems" },
      { id: "ems-3", stage: "community-college", kind: "requirement", title: "Background check and CPR card", detail: "Fingerprints must go to the Colorado Bureau of Investigation within 60 days before or after you submit your application, and both CBI and FBI results must be requested. If you wait longer than 60 days you may have to be fingerprinted again.", facts: ["Valid professional BLS/CPR card", "The certification page lists ACLS for paramedic applicants; the reciprocity page also names intermediate applicants. Confirm your level with CDPHE."], sourceId: "src-cdphe-ems" },
      { id: "ems-4", additionalSourceIds: ["src-cdphe-ems-reciprocity"], stage: "career", kind: "license", title: "Apply for Colorado EMS certification", detail: "Create an account on the Online Application Tracking Hub (OATH) and submit the initial application. Colorado issues a 3-year certificate to first-time providers who meet all requirements.", facts: ["Renew every three years; applying opens within 6 months of expiration", "Colorado does not have a reciprocity process for EMS providers"], sourceId: "src-cdphe-ems" },
      { id: "ems-5", additionalSourceIds: ["src-frcc-story-guida"], stage: "career", kind: "experience", title: "Next levels", detail: "CDPHE lists routes to become a paramedic, a critical care paramedic and a community paramedic. One FRCC graduate started as an EMT with an ambulance company and planned to earn his paramedic degree while working.", sourceId: "src-cdphe-ems" },
    ],
  },
  {
    id: "electrician-colorado",
    title: "Electrician in Colorado",
    career: "Electrician",
    jurisdiction: "Colorado",
    summary: "Earn while you learn: register as an apprentice, log supervised hours and classroom education, then apply for the license level you qualify for through DORA’s Electrical Board. Residential wireman is optional; experience milestones are not consecutive durations to add together.",
    caution: "All experience must be documented by the supervising electrical contractor. Read from DORA's page on 2026-10-16.",
    steps: [
      { id: "el-1", stage: "high-school", kind: "requirement", title: "Register as an electrical apprentice", detail: "Apply for Electrical Apprentice initial registration in DORA's online system. Hours you log must be documented on the Affidavit of Experience form, completed by the electrical contractor who supervised the work.", sourceId: "src-dora-electrical", links: [{ label: "DORA electrical applications and requirements", url: "https://dpo.colorado.gov/Electrical/Applications" }] },
      { id: "el-2", stage: "career", kind: "experience", title: "Residential Wireman (optional first license)", detail: "Experience: 4,000 hours of residential-only work, earned in no less than 2 years.", sourceId: "src-dora-electrical" },
      { id: "el-3", stage: "career", kind: "experience", title: "Journeyman Electrician", detail: "Experience: 8,000 hours earned in no less than 4 years, with 2,000 of them in commercial or industrial work. Education: 288 hours of classroom education for all applicants, documented with a transcript or similar statement. There's no grandfathering of any apprentice registration.", facts: ["8,000 hours in at least 4 years", "2,000 of those in commercial/industrial work", "288 classroom hours"], sourceId: "src-dora-electrical" },
      { id: "el-4", stage: "career", kind: "exam", title: "Apply for the license by examination", detail: "Apply online for the initial license by examination, endorsement or reciprocity. Licenses through endorsement must have been earned by testing on the current National Electrical Code in use in Colorado.", sourceId: "src-dora-electrical" },
      { id: "el-5", stage: "career", kind: "license", title: "Master Electrician", detail: "Meet one of these: 10,000 hours in at least 5 years; a bachelor's in electrical engineering plus 2,000 hours of construction experience in at least a year; a graduate of an electrical trade school or community college plus 8,000 hours in at least 4 years; or journeyman requirements plus 2,000 more hours in at least a year (some in planning and layout, some supervising while holding a journeyman license; DORA does not double-count supervision hours worked alongside supervisees).", sourceId: "src-dora-electrical" },
      { id: "el-6", stage: "career", kind: "requirement", title: "Coming from out of state?", detail: "Journeyman reciprocity exists with Alaska, Arkansas, Idaho, Iowa, Minnesota, Montana, Nebraska, New Hampshire, New Mexico, North Dakota, Oklahoma, South Dakota, Utah and Wyoming, if you held a state-exam license for at least 1 year. Endorsement is available for other active licenses earned on the current NEC.", sourceId: "src-dora-electrical" },
    ],
  },
  {
    id: "teacher-colorado",
    title: "K-12 Teacher in Colorado",
    career: "Teacher",
    jurisdiction: "Colorado",
    summary: "A bachelor's degree, an approved teacher preparation program and proof of content knowledge lead to a Colorado initial license, with alternative routes for career changers.",
    caution: "Colorado lists several routes. Read from the Colorado Department of Education page on 2026-10-16; confirm with CDE and your program.",
    steps: [
      { id: "tc-0", stage: "high-school", kind: "requirement", title: "While you're still in high school: take college classes", detail: "Public high school students in grades 9-12 can take FRCC classes for high school and college credit through concurrent enrollment, with tuition paid by the school district or charter school and the College Opportunity Fund. Programs vary by campus, so start with your counselor.", facts: ["Current options: High School Select, Campus Select, P-TECH, TREP. FRCC says ASCENT ended June 30, 2026."], sourceId: "src-frcc-hs", links: [{ label: "FRCC concurrent enrollment", url: "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html" }] },
      { id: "tc-1", stage: "community-college", kind: "degree", title: "Associate of Arts at FRCC, then transfer", detail: "Follow an applicable statewide agreement for the same major and a participating university; FRCC describes junior standing with no more than 60 additional credits for those agreements. Institution-specific agreements include American Sign Language (to UNC).", sourceId: "src-frcc-transfer-guides", links: [{ label: "FRCC transfer guides and agreements", url: "https://www.frontrange.edu/student-experience/transfer-planning/transfer-guides.html" }] },
      { id: "tc-2", stage: "university", kind: "degree", title: "Bachelor's degree with an approved teacher preparation program", detail: "An initial teacher license requires a bachelor's or higher degree from a regionally accredited college or university, an approved program verification form completed by your teacher preparation program, and demonstration of content knowledge.", sourceId: "src-cde-teacher", links: [{ label: "CDE teacher license requirements", url: "https://ed.cde.state.co.us/cdeprof/teacherreqs" }] },
      { id: "tc-3", stage: "university", kind: "exam", title: "Show content knowledge", detail: "Do it through an approved Praxis exam for your endorsement area, or through an approved Multiple Measures submission.", sourceId: "src-cde-teacher" },
      { id: "tc-4", stage: "career", kind: "license", title: "Initial Teacher License, then Professional", detail: "After your induction program, advance the Initial Teacher License to a Professional License with a copy of your induction certificate.", sourceId: "src-cde-teacher" },
      { id: "tc-5", stage: "career", kind: "requirement", title: "Already have a degree, or want to start teaching sooner?", detail: "CDE lists alternatives: an Alternative Teacher license (1 or 2 years, district-specific; bachelor's degree, content knowledge, a teaching position in the content area, and enrollment in a Colorado-approved alternative program), a Teacher Degree Apprenticeship authorization, and Teacher of Record (district-specific; enrolled in a bachelor's teacher prep program at a Colorado college with 36 or fewer semester hours left, demonstrated content knowledge, a joint district/program TOR plan and a teaching position in the content area).", sourceId: "src-cde-teacher" },
    ],
  },
  {
    id: "physician-colorado",
    title: "Physician in Colorado",
    career: "Doctor",
    jurisdiction: "Colorado",
    summary: "A bachelor's degree, the MCAT, medical school (CU School of Medicine is one in-state option), national licensing exams and postgraduate training lead to a Colorado Medical Board license.",
    caution: "This is one of the longest and most competitive routes. The CU application dates below are for the 2026-27 cycle only; later cycles must be checked on the official page.",
    steps: [
      { id: "md-0", stage: "high-school", kind: "requirement", title: "While you're still in high school: take college classes", detail: "Public high school students in grades 9-12 can take FRCC classes for high school and college credit through concurrent enrollment, with tuition paid by the school district or charter school and the College Opportunity Fund. Programs vary by campus, so start with your counselor.", facts: ["Current options: High School Select, Campus Select, P-TECH, TREP. FRCC says ASCENT ended June 30, 2026."], sourceId: "src-frcc-hs", links: [{ label: "FRCC concurrent enrollment", url: "https://www.frontrange.edu/programs-courses/concurrent-enrollment/index.html" }] },
      { id: "md-1", stage: "community-college", kind: "degree", title: "Start at FRCC: AA with science and math foundations", detail: "CU School of Medicine requires a baccalaureate degree from an accredited school before you start (with an exception for some Pharm.D. holders), and wants evidence of competencies in life sciences, social sciences, physics and mathematics. Your AA tracker shows which gtPathways areas you've covered.", sourceId: "src-cu-som-req", links: [{ label: "CU School of Medicine MD requirements", url: "https://medschool.cuanschutz.edu/education/md-admissions/requirements" }] },
      { id: "md-2", stage: "university", kind: "exam", title: "Take the MCAT", detail: "CU School of Medicine requires the MCAT, with the oldest accepted exam no more than three years before the year you plan to start. If you test more than once, the committee uses the best total score from a single test date. A score of 507 or above is required to receive a secondary application.", facts: ["MCAT 507 or above to receive a secondary application", "Best total score from a single test date is used"], sourceId: "src-cu-som-req" },
      { id: "md-3", stage: "graduate", kind: "application", title: "Apply through AMCAS and the school's secondary", detail: "For the 2026-2027 cycle (Class of 2031): earliest AMCAS filing in May 2026, secondary filing from early July, interviews September 2026 to March 2027, AMCAS deadline October 15, 2026, secondary deadline November 30, 2026, and offers made on a rolling basis from October 15. You need three to five letters of recommendation, or a committee summary letter.", facts: ["2026-27 AMCAS deadline: Oct 15, 2026", "2026-27 secondary deadline: Nov 30, 2026", "3-5 letters or a committee summary letter"], sourceId: "src-cu-som-timeline", additionalSourceIds: ["src-cu-som-req"], datedEvents: [{ label: "2026–27 AMCAS primary deadline", date: "2026-10-15", sourceId: "src-cu-som-timeline" }, { label: "2026–27 secondary deadline", date: "2026-11-30", sourceId: "src-cu-som-timeline" }], links: [{ label: "CU School of Medicine admissions timeline", url: "https://medschool.cuanschutz.edu/education/md-admissions/requirements/timeline-dates-to-remember" }] },
      { id: "md-4", stage: "graduate", kind: "degree", title: "Medical school", detail: "Colorado requires proof of graduation from medical school.", sourceId: "src-dora-medical" },
      { id: "md-5", stage: "career", kind: "exam", title: "Pass the national licensing exams", detail: "Colorado requires passage of nationally recognized exams. DORA's page names the USMLE, and the National Board of Osteopathic Medical Examiners' COMLEX for osteopathic graduates.", sourceId: "src-dora-medical" },
      { id: "md-6", stage: "career", kind: "experience", title: "Postgraduate training (residency)", detail: "Colorado requires satisfactory completion of postgraduate education.", sourceId: "src-dora-medical" },
      { id: "md-7", stage: "career", kind: "license", title: "Apply for your Colorado medical license", detail: "Colorado has no automatic reciprocity with other states; the Board licenses on the basis of examination. The Board says most applicants are licensed within 60 days of receiving application materials, and it licenses 800 to 1,000 new physicians each year.", sourceId: "src-dora-medical", links: [{ label: "Colorado physician licensing requirements", url: "https://dpo.colorado.gov/Medical/DRLicenseRequirements" }] },
    ],
  },
];

pathways.push(...newPathways,...coloradoCareerRoutes);

export const pathwayById = (id: string) => pathways.find((p) => p.id === id);
