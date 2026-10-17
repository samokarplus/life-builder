import { sources, VERIFIED_ON } from "./sample";

sources.push(
  { id: "src-cub-bio-faculty", url: "https://www.colorado.edu/bioastronautics/faculty", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics: Faculty page, plus each person's own Smead Aerospace Engineering Sciences profile." },
  { id: "src-cub-bio-home", url: "https://www.colorado.edu/bioastronautics/", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics home page." },
  { id: "src-cub-bio-curriculum", url: "https://www.colorado.edu/bioastronautics/curriculum", institutionId: "cub", catalogYear: null, lastVerified: VERIFIED_ON, status: "verified", note: "CU Boulder Bioastronautics curriculum page." },
);

export interface Faculty {
  id: string;
  name: string;
  title: string;
  status: "active" | "emeritus" | "scholar-in-residence";
  interests: string[]; // as listed on the person's profile
  highlights?: string[]; // selected items from the profile
  url: string; // official profile
  sourceId: string;
}

/** People listed on the Bioastronautics Faculty page (checked 2026-10-16). Names link to official profiles; no private contact details are copied. */
export const bioastronauticsFaculty: Faculty[] = [
  { id: "clark", name: "Torin Clark", title: "Associate Professor; Associate Chair for Department Affairs", status: "active", url: "https://www.colorado.edu/aerospace/torin-clark", sourceId: "src-cub-bio-faculty",
    interests: ["Astronaut biomedical and cognitive issues", "Aerospace human factors", "Human sensorimotor and vestibular function and adaptation", "Spatial orientation perception and motion sickness models", "Pilot spatial disorientation", "Artificial gravity", "Human-in-the-loop experiments"],
    highlights: ["PhD Aeronautics and Astronautics, MIT (2013); BS Aerospace Engineering Sciences, CU (2008)", "Selected for the National Academies' Forum for New Leaders in Space Science (2016)"] },
  { id: "hayman", name: "Allie Hayman", title: "Associate Professor", status: "active", url: "https://www.colorado.edu/aerospace/allie-anderson", sourceId: "src-cub-bio-faculty",
    interests: ["Space and aviation biomedical issues", "Spacesuit design", "Astronaut vision changes in long-duration spaceflight", "Behavioral health in isolated, confined environments", "Planetary exploration", "Wearable sensor systems"],
    highlights: ["PhD Aerospace Biomedical Engineering, MIT (2014)", "NSF CAREER Award (2023)"] },
  { id: "nabity", name: "James Nabity", title: "Associate Professor; Associate Chair for Academic Operations", status: "active", url: "https://www.colorado.edu/aerospace/james-nabity", sourceId: "src-cub-bio-faculty",
    interests: ["Environmental Control and Life Support Systems (ECLSS) for human spaceflight", "Space habitat design", "Propulsion and power"],
    highlights: ["Listed focus area: Bioastronautics", "Profile lists being a NASA highly qualified candidate for the astronaut class (2009)"] },
  { id: "arquilla", name: "Katya Arquilla", title: "Assistant Professor", status: "active", url: "https://www.colorado.edu/aerospace/katya-arquilla", sourceId: "src-cub-bio-faculty",
    interests: ["How humans interact with and adapt to complex systems, including spacecraft, aircraft, autonomous and robotic systems, and Earth's changing climate"],
    highlights: ["PhD Aerospace Engineering Sciences, CU Boulder (2021)", "Previously Boeing Assistant Professor at MIT"] },
  { id: "anderson-arian", name: "Arian Anderson", title: "Assistant Professor", status: "active", url: "https://som.cuanschutz.edu/Profiles/Faculty/Profile/36443", sourceId: "src-cub-bio-faculty", interests: ["Profile is on the CU Anschutz School of Medicine site; see it for research details."] },
  { id: "niederwieser", name: "Tobias Niederwieser", title: "Assistant Research Professor, BioServe", status: "active", url: "https://www.colorado.edu/aerospace/tobias-niederwieser", sourceId: "src-cub-bio-faculty", interests: ["Affiliated with BioServe Space Technologies"] },
  { id: "zea", name: "Luis Zea", title: "Assistant Research Professor, BioServe", status: "active", url: "https://www.colorado.edu/faculty/zea-luis/", sourceId: "src-cub-bio-faculty", interests: ["Affiliated with BioServe Space Technologies"] },
  { id: "voss", name: "James Voss", title: "Scholar in Residence (retired)", status: "scholar-in-residence", url: "https://www.nasa.gov/wp-content/uploads/2016/01/voss_james_0.pdf", sourceId: "src-cub-bio-faculty", interests: ["The department links his NASA biography."] },
  { id: "hieb", name: "Rick Hieb", title: "Scholar in Residence (retired)", status: "scholar-in-residence", url: "https://www.nasa.gov/wp-content/uploads/2016/01/hieb.pdf", sourceId: "src-cub-bio-faculty", interests: ["The department links his NASA biography."] },
  { id: "tanner", name: "Joe Tanner", title: "Senior Instructor (retired)", status: "scholar-in-residence", url: "https://www.nasa.gov/wp-content/uploads/2016/05/tanner_joseph.pdf", sourceId: "src-cub-bio-faculty", interests: ["The department links his NASA biography."] },
  { id: "klaus", name: "David Klaus", title: "Professor Emeritus (retired)", status: "emeritus", url: "https://www.colorado.edu/aerospace/david-klaus", sourceId: "src-cub-bio-faculty", interests: ["Space habitat design and human performance analysis (per his emeritus profile)"] },
  { id: "stodieck", name: "Louis Stodieck", title: "Research Professor Emeritus (retired)", status: "emeritus", url: "https://www.colorado.edu/aerospace/louis-stodieck", sourceId: "src-cub-bio-faculty", interests: ["Emeritus; see his profile."] },
];

export interface BioCourse { code: string; title: string; offered: string; summary: string }

/** Bioastronautics courses listed on the program's curriculum page; summaries are paraphrased. */
export const bioastronauticsCourses: BioCourse[] = [
  { code: "ASEN 3036", title: "Introduction to Human Spaceflight", offered: "periodic", summary: "Overview of human spaceflight, including astronaut selection and training, physiological and psychological concerns, and life support basics. Counts as upper-division humanities credit." },
  { code: "ASEN 5158", title: "Space Habitat Design", offered: "Fall, core MS", summary: "Systems engineering of a spacecraft built for people, from mission objectives to integrated vehicle schematics." },
  { code: "ASEN 5016", title: "Space Life Sciences", offered: "Spring, core MS", summary: "Factors affecting living organisms in spaceflight, from life support needs to human adaptation; emphasizes technical writing and proposals." },
  { code: "ASEN 5018/6028", title: "Graduate Projects I & II (Human Spacecraft)", offered: "Fall and Spring", summary: "Two-semester design, fabrication and evaluation project that meets the MS project requirement." },
  { code: "ASEN 5137", title: "Experimental Design and Statistical Methods", offered: "periodic", summary: "Designing experiments and analyzing results, with a focus on human-subject research." },
  { code: "ASEN 5226", title: "Medicine in Space and Surface Environments", offered: "periodic", summary: "Joint with CU Anschutz Emergency Medicine: medical care for Moon or Mars missions, hands-on skills, CPR and Wilderness First Aid certification, and a simulated spacewalk field component at the Mars Desert Research Station." },
  { code: "ASEN 6116", title: "Spacecraft Life Support Systems", offered: "periodic", summary: "Environmental control and life support technologies, with computational work. Prerequisite ASEN 5158 or instructor consent." },
  { code: "ASEN 6216", title: "Human Operation of Aerospace Vehicles", offered: "periodic", summary: "Human operator capabilities and limits, spatial orientation illusions, and display and control interface design." },
];

export const bioastronauticsFacilities = [
  { name: "BioServe Space Technologies", detail: "A research center in the Aerospace department, established in 1987. It has designed, built and flown biotechnology payloads on over 100 space flight missions since 1991, including to the International Space Station.", url: "https://www.colorado.edu/bioastronautics/", sourceId: "src-cub-bio-home" },
  { name: "Aerospace Research Simulator (AReS)", detail: "Listed on the program's Laboratory Equipment page. No further description was on that page.", url: "https://www.colorado.edu/bioastronautics/laboratory-equipment", sourceId: "src-cub-bio-home" },
];
