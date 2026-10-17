import { expect,it } from "vitest";
import { boulderCourses,boulderPrograms } from "@/data/boulder";
import { evaluateBoulderProgram } from "./boulder-requirements";
import { evaluateRequirements } from "./requirements";
import type { DegreeRequirement } from "./types";
const ids=(codes:string[])=>codes.map(c=>`cub:${c.replace(' ','-')}`);
const complete=(codes:string[],grade='A',verified=true)=>ids(codes).map(courseId=>({courseId,grade,verified,kind:'regular' as const,earnedInstitutionId:'cub'}));
it("honors BIA math overlap, grade thresholds and completed/planned separation",()=>{
 const codes=['ASEN 5016','ASEN 5158','ASEN 5137','ASEN 5044'];
 const result=evaluateBoulderProgram('cub-bio-ms',{completed:complete(codes),projected:[]});
 for(const key of ['core','bia','nonbia','math'])expect(result.find(r=>r.requirementId.endsWith(`:${key}`))?.status).toBe('satisfied');
 expect(result.find(r=>r.requirementId.endsWith(':other'))?.status).toBe('uncertain');
 const planned=evaluateBoulderProgram('cub-bio-ms',{completed:[],projected:ids(codes)});
 expect(planned.find(r=>r.requirementId.endsWith(':core'))).toMatchObject({status:'projected',completedCourseIds:[]});
 const low=evaluateBoulderProgram('cub-bio-ms',{completed:complete(['ASEN 5016','ASEN 5158'],'C+'),projected:[]});
 expect(low.find(r=>r.requirementId.endsWith(':core'))?.status).toBe('unsatisfied');
 const uncertain=evaluateBoulderProgram('cub-bio-ms',{completed:complete(codes,'A',false),projected:[]});
 expect(uncertain.find(r=>r.requirementId.endsWith(':core'))?.status).toBe('uncertain');
});
it("does not reuse Marxism across philosophy history and values areas",()=>{
 const common=['PHIL 3000','PHIL 3010','PHIL 4250','PHIL 2440','PHIL 3480','PHIL 3100','PHIL 4340','PHIL 4300'];
 const evaluate=(codes:string[])=>evaluateBoulderProgram('cub-philosophy-general',{completed:complete(codes),projected:[]}).find(r=>r.requirementId.endsWith(':areas'))!;
 expect(evaluate(common).status).not.toBe('satisfied');
 expect(evaluate([...common,'PHIL 2140']).status).toBe('satisfied');
});
it("counts four distinct psychology options, never matching FRCC course numbers implicitly",()=>{
 const breadth=(codes:string[])=>evaluateBoulderProgram('cub-psychology',{completed:complete(codes),projected:[]}).find(r=>r.requirementId.endsWith(':breadth'))!;
 expect(breadth(['PSYC 2012','PSYC 2145','PSYC 2606']).status).toBe('unsatisfied');
 expect(breadth(['PSYC 2012','PSYC 2145','PSYC 2606','PSYC 3102']).status).toBe('satisfied');
 const result=evaluateBoulderProgram('cub-psychology',{completed:[{courseId:'frcc:PSY-1001',grade:'A',verified:true}],projected:[]});
 expect(result.find(r=>r.requirementId.endsWith(':core'))?.status).toBe('unsatisfied');
});
it("requires a whole aerospace focus pair instead of mixing the two tracks",()=>{
 const focus=(codes:string[])=>evaluateBoulderProgram('cub-aerospace-bs',{completed:complete(codes),projected:[]}).find(r=>r.requirementId.endsWith(':focus'))!;
 expect(focus(['ASEN 3405','ASEN 4402']).status).toBe('unsatisfied');
 expect(focus(['ASEN 3405','ASEN 4401']).status).toBe('satisfied');
});
it("restricts scoped residency to the program's courses and actual earned institution",()=>{
 const requirement=boulderPrograms[0].requirements.find(r=>r.id.endsWith(':residency'))!;
 const result=(codes:string[],transfer=false)=>evaluateRequirements([requirement],{courses:boulderCourses,completed:complete(codes).map(c=>transfer?{...c,kind:'transfer' as const,earnedInstitutionId:'frcc'}:c),projected:[]})[0];
 expect(result(['ASEN 2401','ASEN 2402','ASEN 2403','ASEN 2501']).status).toBe('unsatisfied');
 const phil=['PHIL 3000','PHIL 3010','PHIL 3100','PHIL 3480'];
 expect(result(phil).status).toBe('satisfied');
 expect(result(phil,true).status).toBe('unsatisfied');
 expect(result(phil).creditsCounted).toBe(12);
});
it("never declares a full degree complete from the reviewed course subset",()=>{
 for(const p of boulderPrograms){
 const result=evaluateBoulderProgram(p.id,{completed:boulderCourses.map(c=>({courseId:c.id,grade:'A',verified:true,earnedInstitutionId:'cub'})),projected:[]});
 expect(result.some(r=>r.status==='uncertain')).toBe(true);
 }
 expect(()=>evaluateBoulderProgram('not-a-program',{completed:[],projected:[]})).toThrow();
});
it("keeps legacy unscoped residency behavior",()=>{
 const r:DegreeRequirement={id:'legacy',programId:'x',sourceId:'s',rule:{type:'residency',institutionId:'cub',minCredits:3,sourceId:'s'},label:'Campus'};
 expect(evaluateRequirements([r],{courses:boulderCourses,completed:complete(['ASEN 5016']),projected:[]})[0].status).toBe('satisfied');
});
