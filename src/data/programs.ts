


export interface CounselingProgram {
  institution: string;
  city: string;
  specialty: string;
  degree: string;
  status: string;
  cycleEnd: string; // accreditation cycle end date as listed
  sourceId: string;
}

const r = (institution: string, city: string, specialty: string, degree: string, status: string, cycleEnd: string): CounselingProgram => ({ institution, city, specialty, degree, status, cycleEnd, sourceId: "src-cacrep-co" });

/** Colorado programs listed in the CACREP directory. A listing is not an endorsement or an admission guarantee. */
export const coloradoCounselingPrograms: CounselingProgram[] = [
  r("Adams State University", "Alamosa", "Clinical Mental Health Counseling", "M.A.", "Accredited", "Mar 31, 2028"),
  r("Adams State University", "Alamosa", "School Counseling", "M.A.", "Accredited", "Mar 31, 2028"),
  r("Adams State University", "Alamosa", "Counselor Education and Supervision", "Ph.D.", "Accredited", "Mar 31, 2028"),
  r("Colorado Christian University", "Lakewood", "Clinical Mental Health Counseling", "M.A.", "Accredited (Reaffirmation in Process)", "Oct 31, 2027"),
  r("Colorado Christian University", "Lakewood", "School Counseling", "M.A.", "Accredited (Reaffirmation in Process)", "Oct 31, 2027"),
  r("Colorado State University", "Fort Collins", "Career Counseling", "M.A.", "Accredited (Reaffirmation in Process)", "Mar 31, 2028"),
  r("Colorado State University", "Fort Collins", "School Counseling", "M.A.", "Accredited (Reaffirmation in Process)", "Mar 31, 2028"),
  r("Colorado State University", "Fort Collins", "Clinical Mental Health Counseling", "M.A.", "Accredited (Reaffirmation in Process)", "Mar 31, 2028"),
  r("Denver Seminary", "Littleton", "Clinical Mental Health Counseling", "M.A.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("Denver Seminary", "Littleton", "School Counseling", "M.A.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("Denver Seminary", "Littleton", "Counselor Education and Supervision", "Ph.D.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("Regis University", "Denver", "Clinical Mental Health Counseling", "M.A.", "Accredited", "Oct 31, 2031"),
  r("University of Colorado at Colorado Springs", "Colorado Springs", "School Counseling", "M.A.", "Accredited", "Mar 31, 2033"),
  r("University of Colorado at Colorado Springs", "Colorado Springs", "Clinical Mental Health Counseling", "M.A.", "Accredited", "Mar 31, 2033"),
  r("University of Colorado at Denver", "Denver", "School Counseling", "M.A.", "Accredited", "Mar 31, 2030"),
  r("University of Colorado at Denver", "Denver", "Clinical Mental Health Counseling", "M.A.", "Accredited", "Oct 31, 2030"),
  r("University of Denver", "Denver", "School Counseling", "M.A.", "Accredited", "Oct 31, 2030"),
  r("University of Northern Colorado, College of Education and Behavioral Sciences", "Greeley", "Marriage, Couple and Family Counseling", "M.A.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("University of Northern Colorado, College of Education and Behavioral Sciences", "Greeley", "Clinical Mental Health Counseling", "M.A.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("University of Northern Colorado, College of Education and Behavioral Sciences", "Greeley", "Counselor Education and Supervision", "Ph.D.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("University of Northern Colorado, College of Education and Behavioral Sciences", "Greeley", "School Counseling", "M.S.", "Accredited (Progress Report Required)", "Oct 31, 2029"),
  r("University of Northern Colorado, College of Natural and Health Sciences", "Greeley", "Rehabilitation Counseling", "M.A.", "Accredited", "Oct 31, 2029"),
];

export const specialties = [...new Set(coloradoCounselingPrograms.map((p) => p.specialty))].sort();

/** CU Boulder Aerospace Engineering Sciences row, from the Graduate School deadlines table. */
export const cuAesGrad = {
  degrees: "MS, PhD, Professional MS",
  gre: "GRE optional for PhD; not accepted for MS or Professional MS",
  deadlines: [{ term: "Spring", date: "Oct. 1" }, { term: "Fall", date: "Dec. 1" }],
  sourceId: "src-cub-aes-apply",
  deadlineSourceId: "src-cub-aes-deadlines",
};

/**
 * CU Denver MA in Counseling, Clinical Mental Health, from the program's own page (read 2026-10-16).
 * The interview dates are only the two the page lists; later cycles must be re-read.
 */
export const cuDenverCmhc = {
  institution: "University of Colorado at Denver",
  program: "MA in Counseling, Clinical Mental Health",
  format: "On campus (very few classes fully online)",
  credits: 63,
  recommendedTime: "3 to 4 years",
  accreditation: "CACREP",
  applicationWindows: [
    { term: "Fall" as const, opens: { month: 11, day: 1 }, due: { month: 1, day: 15 } },
    { term: "Spring" as const, opens: { month: 7, day: 1 }, due: { month: 9, day: 15 } },
  ],
  requirements: ["3 recommendation letters", "Official transcripts from all institutions attended", "Resume or CV", "Written statement", "$50 application fee"],
  interviews: [
    { cycle: "Spring 2027", date: "2026-10-23" },
    { cycle: "Fall 2027", date: "2027-03-12" },
  ],
  interviewNote: "A half-day group interview on the Denver campus is required, there are no individual or alternate interviews, and you won't be accepted without attending.",
  advice: "Only complete applications are reviewed; the program recommends submitting one to two months before the deadline.",
  contact: { office: "Office of Recruitment & Outreach", phone: "303.315.6300", email: "education@ucdenver.edu" },
  url: "https://education.ucdenver.edu/academics/graduate/counseling/detail/ma-counseling-clinical-mental-health",
  sourceId: "src-cud-cmhc",
};
