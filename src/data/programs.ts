import { sources, VERIFIED_ON } from "./sample";

sources.push(
  { id: "src-cacrep-co", url: "https://www.cacrep.org/directory/", institutionId: null, catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CACREP directory, state = CO, statuses Accredited / 2 Year / 8 Year (22 program rows read on the verification date). Statuses and cycle end dates change, so re-check the directory." },
  { id: "src-cub-grad-deadlines", url: "https://www.colorado.edu/graduateschool/admissions/where-begin/program-information-deadlines", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Graduate School Program Information & Deadlines table." },
);

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
  gre: "GRE not required",
  deadlines: [{ term: "Spring", date: "Oct. 1" }, { term: "Fall", date: "Dec. 1" }],
  contact: "aerograd@colorado.edu",
  sourceId: "src-cub-grad-deadlines",
};
