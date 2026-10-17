/**
 * Presentation and context for each Colorado Dreams route: category, search tags, color theme, badge art,
 * the realistic "ideal path", what makes it hard, and real people who did it. Everything factual cites a source.
 */
import { coloradoCareerMeta } from "./career-expansion";

export type ThemeKey = "indigo" | "teal" | "rose" | "blue" | "red" | "amber" | "green";
export type IconKey = "astronaut" | "counselor" | "nurse" | "doctor" | "ems" | "electrician" | "teacher" | "software" | "engineer" | "pharmacist" | "plumber" | "dental" | "vet";
export type Category = "Space & science" | "Mental health" | "Health care" | "Skilled trades" | "Education" | "Technology" | "Engineering";

export interface Challenge { title: string; detail: string; sourceId: string }
export interface Person { name: string; role: string; background: string[]; sourceId: string; url: string; lesson?: string }
export type IdealStage = { label: string; duration: string; note?: string } & (
  | { basis: "official"; sourceId: string }
  | { basis: "estimate"; sourceId?: never }
);

export interface CareerMeta {
  category: Category;
  theme: ThemeKey;
  icon: IconKey;
  tags: string[];
  /** Can you begin without a college degree? */
  startsWithoutDegree: boolean | null;
  /** Does a bachelor's degree (or more) sit on the standard route? */
  needsBachelors: boolean | null;
  headline: string;
  ideal: IdealStage[];
  idealNote: string;
  challenges: Challenge[];
  people: Person[];
}

export const careerMeta: Record<string, CareerMeta> = {
  ...coloradoCareerMeta,
  "astronaut-bioastronautics": {
    category: "Space & science", theme: "indigo", icon: "astronaut", startsWithoutDegree: false, needsBachelors: true,
    tags: ["astronaut", "nasa", "space", "bioastronautics", "aerospace", "engineering", "stem", "cu boulder", "pilot"],
    headline: "A STEM master's, years of experience, and a very rare opening.",
    ideal: [
      { label: "Associate degree at FRCC", duration: "about 2 years", basis: "estimate", note: "60 credits at a full-time pace" },
      { label: "Bachelor's in a STEM field", duration: "about 2 more years", basis: "estimate", note: "FRCC says an associate degree usually leaves about 60 more credits" },
      { label: "STEM master's (for example CU Boulder AES)", duration: "about 2 years", basis: "estimate" },
      { label: "Related professional experience", duration: "at least 3 years", basis: "official", sourceId: "src-nasa-astronaut", note: "or 1,000 pilot-in-command hours, at least 850 in high-performance jets; confirm NASA’s cycle-specific alternatives" },
      { label: "Wait for a NASA selection", duration: "windows open as needed", basis: "official", sourceId: "src-nasa-astronaut", note: "classes have recently been picked about every four years" },
    ],
    idealNote: "A planning example, not an earliest eligibility date. NASA has degree alternatives and some experience may overlap education. Selection is not guaranteed.",
    challenges: [
      { title: "Very few seats", detail: "NASA's 2025 class was 10 candidates chosen from more than 8,000 applicants.", sourceId: "src-nasa-2025-class" },
      { title: "NASA decides when to hire", detail: "Applications are accepted as needed, and new classes have recently been chosen about every four years. The 2020 window ran March 2 to 31 and drew more than 12,000 applicants.", sourceId: "src-nasa-astronaut" },
      { title: "Three years of real work first", detail: "The page states a minimum of three years of related professional experience after your degree, or 1,000 pilot-in-command hours (at least 850 in high-performance jets).", sourceId: "src-nasa-astronaut" },
      { title: "Citizenship and the physical", detail: "You must be a U.S. citizen and pass the NASA long-duration flight astronaut physical.", sourceId: "src-nasa-astronaut" },
      { title: "Graduate school is competitive too", detail: "CU Boulder's Aerospace Engineering Sciences lists graduate application deadlines of Oct. 1 for spring and Dec. 1 for fall, and has its own degree-specific test policy.", sourceId: "src-cub-aes-deadlines" },
    ],
    people: [
      { name: "Erin Overcash", role: "NASA astronaut candidate, class of 2025", sourceId: "src-nasa-2025-class", url: "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/",
        background: ["Bachelor's in aerospace engineering and a master's in bioastronautics from the University of Colorado Boulder", "U.S. Navy lieutenant commander and Naval Test Pilot School graduate", "More than 1,300 flight hours in 20 aircraft", "Trained full-time with the USA Rugby Women's National Team through the Navy's World Class Athlete Program"], lesson: "The exact CU Boulder route: aerospace engineering, then bioastronautics." },
      { name: "Anna Menon", role: "NASA astronaut candidate; flew on SpaceX Polaris Dawn in 2024", sourceId: "src-nasa-2025-class", url: "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/",
        background: ["Bachelor's from Texas Christian University, double major in mathematics and Spanish", "Master's in biomedical engineering from Duke University", "Worked in NASA Johnson's Mission Control supporting medical hardware and software on the space station", "Flew as mission specialist and medical officer on Polaris Dawn"], lesson: "NASA describes a math and engineering background followed by mission-control work." },
      { name: "Imelda Muller", role: "NASA astronaut candidate, class of 2025", sourceId: "src-nasa-2025-class", url: "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/",
        background: ["Bachelor's in behavioral neuroscience and a medical degree", "Former Navy lieutenant and undersea medical officer", "Was completing an anesthesia residency at Johns Hopkins when selected"], lesson: "A physician's route." },
      { name: "Yuri Kubo", role: "NASA astronaut candidate, class of 2025", sourceId: "src-nasa-2025-class", url: "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/",
        background: ["Bachelor's in electrical engineering and a master's in electrical and computer engineering from Purdue", "Was a co-op student at NASA Johnson early in his career", "12 years at SpaceX, including as launch director for Falcon 9"], lesson: "Industry experience plus an early co-op." },
      { name: "Kjell Lindgren", role: "CU alumnus; ISS Expedition 44/45 and SpaceX Crew-4", sourceId: "src-cu-aero-astronauts", url: "https://www.colorado.edu/aerospace/about-us/astronauts-affiliated-cu",
        background: ["Medical degree, CU School of Medicine, 2002", "Listed by CU with flights on the space station and a commercial crew mission"], lesson: "Medicine at CU, then spaceflight." },
      { name: "Marsha Ivins", role: "CU alumna; five space shuttle flights", sourceId: "src-cu-aero-astronauts", url: "https://www.colorado.edu/aerospace/about-us/astronauts-affiliated-cu",
        background: ["BS in aerospace engineering, CU Boulder, 1973", "Flew STS-32, -46, -62, -81 and -98"] },
      { name: "Sarah Gillis", role: "CU alumna; Polaris Dawn", sourceId: "src-cu-aero-astronauts", url: "https://www.colorado.edu/aerospace/about-us/astronauts-affiliated-cu",
        background: ["Aerospace engineering degree from CU Boulder, 2017"], lesson: "A commercial spaceflight route." },
    ],
  },
  "lpc-colorado": {
    category: "Mental health", theme: "teal", icon: "counselor", startsWithoutDegree: false, needsBachelors: true,
    tags: ["therapist", "counselor", "lpc", "mental health", "psychology", "licensed professional counselor", "dora", "cacrep"],
    headline: "A master's degree, then at least two years of supervised practice.",
    ideal: [
      { label: "Associate degree at FRCC", duration: "about 2 years", basis: "estimate" },
      { label: "Bachelor's degree", duration: "about 2 more years", basis: "estimate", note: "about 60 more credits after an associate degree" },
      { label: "CACREP-accredited counseling master's", duration: "3 to 4 years at CU Denver's pace", basis: "official", sourceId: "src-cud-cmhc", note: "CU Denver lists 63 credits and a recommended completion time of 3 to 4 years" },
      { label: "Supervised post-master's practice", duration: "at least 24 months", basis: "official", sourceId: "src-co-lpc-rules", note: "2,000 hours, 1,500 with clients" },
    ],
    idealNote: "Built from Colorado's rules and CU Denver's published program length. Part-time study makes it longer.",
    challenges: [
      { title: "Register before you count hours", detail: "Post-degree hours count only if you're registered as a candidate before you start accumulating them.", sourceId: "src-dora-lpc-apps" },
      { title: "The clock can't be rushed", detail: "The 2,000 hours cannot be completed in fewer than 24 months, even if you finish the hours sooner with more than one supervisor.", sourceId: "src-co-lpc-rules" },
      { title: "Exams expire", detail: "The jurisprudence exam is valid for one year, and the national exam results for up to five years. Hours older than 5 years are not accepted.", sourceId: "src-dora-lpc-apps" },
      { title: "Admission includes an interview", detail: "CU Denver requires a half-day group interview in Denver and doesn't offer individual or alternate interviews.", sourceId: "src-cud-cmhc" },
      { title: "Moving doesn't transfer automatically", detail: "Colorado has no reciprocity; a counselor licensed elsewhere applies by endorsement.", sourceId: "src-dora-faq" },
    ],
    people: [],
  },
  "rn-colorado": {
    category: "Health care", theme: "rose", icon: "nurse", startsWithoutDegree: true, needsBachelors: false,
    tags: ["nurse", "nursing", "rn", "registered nurse", "cna", "lpn", "hospital", "nclex", "health", "flight nurse", "adn", "bsn"],
    headline: "Start as a nurse aide, earn an associate degree, pass the NCLEX.",
    ideal: [
      { label: "Optional: Certified Nurse Aide", duration: "a short training program", basis: "estimate", note: "length depends on the program" },
      { label: "Prerequisites, HESI A-2 and the nursing application", duration: "varies; windows are short", basis: "estimate" },
      { label: "Board-approved nursing program (ADN)", duration: "about 2 years", basis: "estimate" },
      { label: "NCLEX and license application", duration: "weeks to a few months", basis: "estimate", note: "three attempts allowed within three years" },
    ],
    idealNote: "FRCC's published steps; durations marked as estimates are common timelines, not promises.",
    challenges: [
      { title: "Getting in is competitive", detail: "FRCC’s Larimer Associate Degree Nursing program ranks every application and admits the top 40 each fall and spring. It may admit fewer because of limits on clinical placements.", sourceId: "src-frcc-adn" },
      { title: "Short application windows", detail: "The application is available only during its application period, and the page said Fall 2027's would be announced later.", sourceId: "src-frcc-adn" },
      { title: "A harder entrance exam", detail: "Applicants must now take five HESI A-2 subjects, including a new Critical Thinking test.", sourceId: "src-frcc-adn" },
      { title: "You can't practice until licensed", detail: "A graduate may not work as a nurse until a Colorado license is issued, and students may not practice outside their approved clinical education.", sourceId: "src-dora-nursing-faq" },
      { title: "The NCLEX has limits", detail: "You get 3 chances within 3 years, with 45 days between attempts.", sourceId: "src-dora-nursing-faq" },
    ],
    people: [
      { name: "Joel Bitler", role: "FRCC alumnus; clinical director in FRCC’s December 2020 account", sourceId: "src-frcc-story-bitler", url: "https://blog.frontrange.edu/2020/12/02/during-covid-alumnus-gets-creative-with-care-at-local-nursing-homes/",
        background: ["Became a certified nursing assistant out of high school after a medical terminology course", "Started an LPN certificate in 2002, then found his options limited: \"As an LPN, I could not work in a hospital in Colorado. I had to go back to school.\"", "Earned an associate degree in nursing at FRCC and later went on to a bachelor's program", "FRCC reported in December 2020 that he managed clinical teams at five nursing homes and three assisted living facilities"], lesson: "Each credential opened the next door." },
      { name: "Alyssa Andrade", role: "FRCC 2026 graduate, aiming to be a flight nurse", sourceId: "src-frcc-story-andrade", url: "https://blog.frontrange.edu/2026/05/12/first-generation-graduate-pursues-dream-of-becoming-a-flight-nurse/",
        background: ["First-generation college student who began FRCC right after high school in August 2021", "Had worked in hospice care", "Earned an Associate of Arts in health sciences", "Says nobody at home could explain FAFSA, majors or credit hours, so she figured it out step by step"], lesson: "Being first in your family is hard and doable." },
    ],
  },
  "ems-colorado": {
    category: "Health care", theme: "red", icon: "ems", startsWithoutDegree: true, needsBachelors: false,
    tags: ["emt", "ems", "paramedic", "ambulance", "emergency", "first responder", "nremt", "health"],
    headline: "EMS training, national registration and state certification before practice.",
    ideal: [
      { label: "EMS course at your level", duration: "a semester-length course is common", basis: "estimate", note: "Colorado lists approved programs" },
      { label: "NREMT written and psychomotor exams", duration: "after the course", basis: "estimate" },
      { label: "Fingerprints and Colorado application", duration: "within 60 days of each other", basis: "official", sourceId: "src-cdphe-ems" },
      { label: "Work, then consider paramedic", duration: "your pace", basis: "estimate" },
    ],
    idealNote: "A planning example, not an eligibility determination. Confirm age, program and exam requirements. Estimates are not promises.",
    challenges: [
      { title: "Two national exams", detail: "You need an NREMT registration, earned by passing both the written and the psychomotor exams.", sourceId: "src-cdphe-ems" },
      { title: "Paperwork has a clock", detail: "Fingerprints must be submitted within 60 days before or after your application, or you may have to repeat the background check.", sourceId: "src-cdphe-ems" },
      { title: "Moving doesn't transfer", detail: "Colorado does not have a reciprocity process, and another state's certification doesn't let you practice here.", sourceId: "src-cdphe-ems-reciprocity" },
      { title: "Certification expires", detail: "Renew every three years.", sourceId: "src-cdphe-ems" },
    ],
    people: [
      { name: "Tom Guida", role: "FRCC EMS graduate in the college’s September 2023 account", sourceId: "src-frcc-story-guida", url: "https://blog.frontrange.edu/2023/09/06/graduate-starts-paramedic-career-with-care-forward-colorado/",
        background: ["Started college for architecture but stopped because of tuition costs", "Served in AmeriCorps disaster relief, then moved to Colorado", "Tuition, fees and materials for FRCC's EMS program were covered by Care Forward Colorado, saving about $3,000", "Was offered a job on the spot at a mock interview event near the end of the program", "In the September 2023 story, planned to earn a paramedic degree"], lesson: "A detour, then a fast, funded start." },
    ],
  },
  "electrician-colorado": {
    category: "Skilled trades", theme: "amber", icon: "electrician", startsWithoutDegree: true, needsBachelors: false,
    tags: ["electrician", "trades", "apprentice", "journeyman", "master electrician", "wireman", "construction", "no degree"],
    headline: "Get paid while you build the hours.",
    ideal: [
      { label: "Register as an apprentice", duration: "processing time varies", basis: "estimate" },
      { label: "Residential wireman (optional)", duration: "at least 2 years", basis: "official", sourceId: "src-dora-electrical", note: "4,000 residential hours" },
      { label: "Journeyman", duration: "at least 4 years", basis: "official", sourceId: "src-dora-electrical", note: "8,000 hours plus 288 classroom hours" },
      { label: "Master electrician", duration: "at least 5 years of experience", basis: "official", sourceId: "src-dora-electrical", note: "or a shorter route with a degree or trade school" },
    ],
    idealNote: "Experience milestones can overlap; do not add them together. Residential wireman is optional. Master licensing has alternative qualification routes. Apprentice processing time is an estimate.",
    challenges: [
      { title: "Hours are the gate", detail: "Journeyman needs 8,000 hours in at least 4 years, with 2,000 in commercial or industrial work, and every hour is documented by your supervising contractor.", sourceId: "src-dora-electrical" },
      { title: "Classroom time is required", detail: "288 hours of classroom education for all journeyman applicants, with no grandfathering of any apprentice registration.", sourceId: "src-dora-electrical" },
      { title: "You can't skip to master", detail: "You can't go from apprentice or residential wireman to master if you're using experience to qualify for the master license.", sourceId: "src-dora-electrical" },
    ],
    people: [],
  },
  "teacher-colorado": {
    category: "Education", theme: "green", icon: "teacher", startsWithoutDegree: false, needsBachelors: true,
    tags: ["teacher", "teaching", "education", "k-12", "school", "classroom", "alternative license", "apprenticeship"],
    headline: "A bachelor's degree plus an approved program, with routes for career changers.",
    ideal: [
      { label: "Associate degree at FRCC", duration: "about 2 years", basis: "estimate" },
      { label: "Bachelor's with teacher preparation", duration: "about 2 more years", basis: "estimate", note: "about 60 more credits after an associate degree" },
      { label: "Content knowledge and initial license", duration: "during your program", basis: "estimate" },
      { label: "Induction, then Professional License", duration: "after you start teaching", basis: "estimate" },
    ],
    idealNote: "Colorado also lists faster routes for people who already have a degree (see the route).",
    challenges: [
      { title: "Prove you know the subject", detail: "You need an approved Praxis exam for your endorsement area or an approved Multiple Measures submission.", sourceId: "src-cde-teacher" },
      { title: "Program must be approved", detail: "Your preparation program has to complete an approved-program verification form for your license application.", sourceId: "src-cde-teacher" },
      { title: "Alternative routes are district-specific", detail: "Alternative Teacher and Teacher of Record routes depend on a district hiring you in the content area.", sourceId: "src-cde-teacher" },
    ],
    people: [],
  },
  "physician-colorado": {
    category: "Health care", theme: "blue", icon: "doctor", startsWithoutDegree: false, needsBachelors: true,
    tags: ["doctor", "physician", "md", "medicine", "medical school", "mcat", "amcas", "surgeon", "pre-med"],
    headline: "The longest route here: degree, MCAT, medical school, residency.",
    ideal: [
      { label: "Associate degree at FRCC", duration: "about 2 years", basis: "estimate" },
      { label: "Bachelor's degree and MCAT", duration: "about 2 more years", basis: "estimate", note: "about 60 more credits after an associate degree" },
      { label: "Medical school (MD)", duration: "typically 4 years", basis: "estimate" },
      { label: "Postgraduate training and licensing exams", duration: "varies by specialty", basis: "estimate", note: "Colorado requires completed postgraduate education" },
    ],
    idealNote: "Medical school and residency lengths vary and aren't stated on the pages we read, so they're estimates.",
    challenges: [
      { title: "An MCAT floor", detail: "CU School of Medicine requires a 507 or above to receive a secondary application.", sourceId: "src-cu-som-req" },
      { title: "One shot per cycle, with an early deadline", detail: "For the 2026-27 cycle the AMCAS deadline was October 15, 2026, with offers starting on a rolling basis the same day.", sourceId: "src-cu-som-timeline" },
      { title: "Letters take time", detail: "Three to five letters of recommendation, or a committee summary letter.", sourceId: "src-cu-som-req" },
      { title: "Years of training after the degree", detail: "Colorado requires medical school, national exams and satisfactory completion of postgraduate education before licensure.", sourceId: "src-dora-medical" },
    ],
    people: [
      { name: "Kjell Lindgren", role: "CU School of Medicine MD, 2002; later flew to the space station", sourceId: "src-cu-aero-astronauts", url: "https://www.colorado.edu/aerospace/about-us/astronauts-affiliated-cu",
        background: ["Listed by CU with a medical degree from the School of Medicine, 2002", "Flights: ISS Expedition 44/45 and SpaceX Crew-4"], lesson: "Medicine can lead to space." },
      { name: "Imelda Muller", role: "Medical degree, Navy undersea medical officer, NASA astronaut candidate", sourceId: "src-nasa-2025-class", url: "https://www.nasa.gov/news-release/nasa-selects-all-american-2025-class-of-astronaut-candidates/",
        background: ["Bachelor's in behavioral neuroscience", "Medical degree from the University of Vermont College of Medicine", "Was completing an anesthesia residency when selected"] },
    ],
  },
};
