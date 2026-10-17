/** Register factual datasets here; estimates and UI metadata are not academic facts.
 * The CLI also fails if a new data module is introduced without inventory registration. */
import { courses, careers, requirements, illustrativeRequirements, tuitionRates } from "./sample";
import { pathways } from "./pathways";
import { accessOptions } from "./access";
import { careerMeta } from "./career-meta";
import { fundingDates, fundingItems } from "./funding";
import { coloradoCounselingPrograms, cuAesGrad, cuDenverCmhc } from "./programs";
import { bioastronauticsCourses, bioastronauticsFacilities, bioastronauticsFaculty } from "./people";
import { boulderPrograms,boulderRequirements,boulderTuitionExample } from "./boulder";
import { coloradoCampuses } from "./campuses";
import { glossary } from "./glossary";

export const inventoryModules = ["career-expansion", "boulder", "campuses", "access", "career-meta", "frcc-electives", "frcc-gtpathways", "frcc-gtpathways-raw", "funding", "glossary", "inventory", "pathways", "people", "programs", "sample", "sources"];
const collection = (name: string, records: readonly unknown[]) => records.map((record, i) => ({ location:`${name}[${i}]`,record }));
export const sourceRecords = [
 ...collection('boulderPrograms',boulderPrograms),...collection('boulderRequirements',boulderRequirements),...collection('boulderTuition',[boulderTuitionExample]),
 ...collection('campuses',coloradoCampuses),...collection('campusAdmissions',coloradoCampuses.flatMap(c=>c.admissions)),...collection('campusDeadlines',coloradoCampuses.flatMap(c=>c.deadlines)),...collection('campusTuition',coloradoCampuses.map(c=>c.tuition)),...collection('campusTransfer',coloradoCampuses.map(c=>c.transfer)),
 ...collection('courses',courses),...collection('careers',careers),...collection('requirements',requirements),...collection('illustrativeRequirements',illustrativeRequirements),...collection('tuitionRates',tuitionRates),
 ...collection('pathways.steps',pathways.flatMap(p=>p.steps)),...collection('accessOptions',accessOptions),
 ...collection('challenges',Object.values(careerMeta).flatMap(m=>m.challenges)),...collection('people',Object.values(careerMeta).flatMap(m=>m.people)),
 ...collection('officialDurations',Object.values(careerMeta).flatMap(m=>m.ideal).filter(s=>s.basis==='official')),
 ...collection('fundingDates',fundingDates),...collection('fundingItems',fundingItems),...collection('counselingPrograms',coloradoCounselingPrograms),
 ...collection('graduatePrograms',[cuAesGrad,cuDenverCmhc]),...collection('bioCourses',bioastronauticsCourses),...collection('facilities',bioastronauticsFacilities),...collection('faculty',bioastronauticsFaculty),...collection('glossary',glossary),
];
