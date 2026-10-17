import type { Course, DegreeRequirement, RequirementRule, CompletedCourse, InstitutionRequirementPolicy } from "./types";
export type ReqStatus = "satisfied" | "projected" | "uncertain" | "unsatisfied";
export interface ReqResult {
  requirementId: string; label: string; status: ReqStatus; creditsCounted: number;
  usedCourseIds: string[]; completedCourseIds: string[]; projectedCourseIds: string[]; uncertainCourseIds: string[]; missingCourseIds: string[]; notes: string[];
}
export interface EvalContext {
  courses: Course[];
  completed: (Pick<CompletedCourse, "courseId" | "grade" | "verified"> & Partial<Pick<CompletedCourse,"kind" | "earnedInstitutionId">>)[];
  projected: string[];
  allowDoubleCount?: boolean;
  institutionPolicies?: InstitutionRequirementPolicy[];
  programInstitutions?: Record<string,string>;
}
const GRADE = ["F","D-","D","D+","C-","C","C+","B-","B","B+","A-","A","A+"];
/** Missing grades, pass/fail and unknown minimums require an official interpretation. */
export function meetsGrade(grade: string | undefined, minimum: string): boolean | null {
  const g = GRADE.indexOf(grade?.trim().toUpperCase() ?? "");
  const min = GRADE.indexOf(minimum.trim().toUpperCase());
  return g<0 || min<0 ? null : g>=min;
}
interface Eval {status:ReqStatus;used:string[];notes:string[];missing:string[]}
const rank: ReqStatus[] = ["satisfied","projected","uncertain","unsatisfied"];
const unique = (ids: string[]) => [...new Set(ids)];
const empty = (notes: string[] = [], missing: string[] = []): Eval => ({status:"unsatisfied",used:[],notes,missing});
export function ruleCourseIds(rule: RequirementRule): string[] {
  if(rule.type==="course") return [rule.courseId];
  if(rule.type==="group") return unique(rule.courseIds);
  if(rule.type==="credits"||rule.type==="transfer") return ruleCourseIds(rule.from);
  if(rule.type==="residency"||rule.type==="unmapped") return [];
  return unique(rule.rules.flatMap(ruleCourseIds));
}
function credits(ids:string[],ctx:EvalContext) {return unique(ids).reduce((n,id)=>n+(ctx.courses.find(c=>c.id===id)?.credits??0),0);}
function combine(parts:Eval[]): Eval {
  const has=(s:ReqStatus)=>parts.some(p=>p.status===s);
  return {status:has("unsatisfied")?"unsatisfied":has("uncertain")?"uncertain":has("projected")?"projected":"satisfied",used:unique(parts.flatMap(p=>p.used)),missing:unique(parts.flatMap(p=>p.missing)),notes:unique(parts.flatMap(p=>p.notes))};
}
type SearchContext = EvalContext & { truncated?: () => void };
function candidates(rule:RequirementRule,ctx:SearchContext,taken:Set<string>):Eval[] {
  const catalog=new Map(ctx.courses.map(c=>[c.id,c]));
  const completed=new Map(ctx.completed.map(c=>[c.courseId,c]));
  switch(rule.type) {
    case "course": {
      const course=catalog.get(rule.courseId);const code=course?.code??rule.courseId;
      if(!course) return [empty([`${code}: course data unknown; check official sources`],[rule.courseId])];
      if(taken.has(rule.courseId)) return [empty([`${code} already counts toward another requirement`],[rule.courseId])];
      const c=completed.get(rule.courseId);
      if(course.eligibilityNote && (c || ctx.projected.includes(rule.courseId))) return [{status:"uncertain",used:[rule.courseId],missing:[],notes:[`${code}: ${course.eligibilityNote}`]}];
      if(c) {
        if(rule.minGrade) {
          const ok=meetsGrade(c.grade,rule.minGrade);
          if(ok===false) return [empty([`${code} grade is below ${rule.minGrade}`],[rule.courseId])];
          if(ok===null) return [{status:"uncertain",used:[rule.courseId],missing:[],notes:[`${code} needs ${rule.minGrade} or better; grade interpretation unknown`]}];
        }
        return [{status:c.verified?"satisfied":"uncertain",used:[rule.courseId],missing:[],notes:c.verified?[]:[`${code}: ${c.kind==="ap-ib"?"AP/IB":c.kind==="transfer"?"transfer":"reported"} credit needs institutional verification`]}];
      }
      if(ctx.projected.includes(rule.courseId)) return [{status:"projected",used:[rule.courseId],missing:[],notes:[`${code} is planned, not yet complete${rule.minGrade?`; needs ${rule.minGrade} or better`:""}`]}];
      return [empty([`${code} not in your plan`],[rule.courseId])];
    }
    case "all": {
      // A course may support multiple clauses within one requirement, but earns credits once.
      let combos:Eval[]=[{status:"satisfied",used:[],notes:[],missing:[]}];
      for(const child of rule.rules) {
        const next=combos.flatMap(a=>candidates(child,ctx,rule.distinctCourses?new Set([...taken,...a.used]):taken).map(b=>combine([a,b]))).sort((a,b)=>rank.indexOf(a.status)-rank.indexOf(b.status));
        if(next.length>256) ctx.truncated?.();
        combos=next.slice(0,256);
      }
      return combos;
    }
    case "any": return rule.rules.length?rule.rules.flatMap(r=>candidates(r,ctx,taken)):[empty(["No alternatives loaded; check official sources"])];
    case "group": return [empty(["Course group needs a credit threshold"])];
    case "unmapped": return [{...empty([rule.note]),status:"uncertain"}];
    case "credits": {
      if(rule.min<=0) return [{status:"satisfied",used:[],notes:[],missing:[]}];
      // Enumerate group subsets with a bounded dynamic frontier. Nested AND/OR uses its actual branches.
      const options:Eval[]=[];
      if(rule.from.type==="group") {
        let subsets:Eval[]=[{status:"satisfied",used:[],notes:[],missing:[]}];
        for(const id of unique(rule.from.courseIds)) {
          const item=candidates({type:"course",courseId:id,minGrade:rule.from.minGrade},ctx,taken)[0];
          if(item.status==="unsatisfied") continue;
          const additions=subsets.filter(s=>credits(s.used,ctx)<rule.min).map(s=>combine([s,item]));
          if(subsets.length+additions.length>1024) ctx.truncated?.();
          subsets=[...subsets,...additions].sort((a,b)=>rank.indexOf(a.status)-rank.indexOf(b.status)||credits(a.used,ctx)-credits(b.used,ctx)).slice(0,1024);
        }
        options.push(...subsets.filter(s=>credits(s.used,ctx)>=rule.min));
        if(!options.length) {
          const all=unique(rule.from.courseIds).map(id=>candidates({type:"course",courseId:id,minGrade:rule.from.type==="group"?rule.from.minGrade:undefined},ctx,taken)[0]);
          const result=combine(all.filter(e=>e.used.length));
          options.push({...result,status:"unsatisfied",missing:unique(all.flatMap(e=>e.missing)),notes:[...result.notes,`${credits(result.used,ctx)} of ${rule.min} credits covered`]});
        }
      } else {
        options.push(...candidates(rule.from,ctx,taken).map(e=>credits(e.used,ctx)>=rule.min?e:{...e,status:"unsatisfied" as const,notes:[...e.notes,`${credits(e.used,ctx)} of ${rule.min} credits covered`]}));
      }
      return options.sort((a,b)=>rank.indexOf(a.status)-rank.indexOf(b.status)||credits(a.used,ctx)-credits(b.used,ctx));
    }
    case "residency": {
      const eligible=ctx.courses.filter(c=>c.institutionId===rule.institutionId).map(c=>c.id);
      const filtered: EvalContext={...ctx,completed:ctx.completed.filter(c=>{
        const origin=c.earnedInstitutionId??(c.kind==="transfer"||c.kind==="ap-ib"?undefined:catalog.get(c.courseId)?.institutionId);
        return origin===rule.institutionId;
      })};
      return candidates({type:"credits",min:rule.minCredits,from:{type:"group",courseIds:unique([...eligible,...filtered.completed.map(c=>c.courseId)])}},filtered,taken).map(e=>({...e,notes:[...e.notes,`Residency at ${rule.institutionId}: transfer/AP/IB credit is excluded unless its earned institution is known.`]}));
    }
    case "transfer": return candidates(rule.from,ctx,taken).map(e=>{
      const transfer=e.used.filter(id=>{const c=completed.get(id);return c?.kind==="transfer"||c?.kind==="ap-ib";});
      return credits(transfer,ctx)>rule.maxCredits?{...e,status:"unsatisfied" as const,notes:[...e.notes,`Selected transfer/AP/IB credit exceeds the ${rule.maxCredits}-credit limit`]}:e;
    });
  }
}
/** Search alternatives together so a flexible rule cannot starve another requirement. */
export function evaluateRequirements(reqs:DegreeRequirement[],ctx:EvalContext):ReqResult[] {
  const ordered=[...reqs].sort((a,b)=>(ruleCourseIds(a.rule).length||Infinity)-(ruleCourseIds(b.rule).length||Infinity));
  const weights:Record<ReqStatus,number>={satisfied:100,projected:10,uncertain:1,unsatisfied:0};
  let bestScore=-1, visits=0, limited=false;
  let best=new Map<string,Eval>();
  function search(index:number,allocated:Map<string,string[]>,chosen:Map<string,Eval>,score:number) {
    if(++visits>50000){limited=true;return;}
    if(index===ordered.length){if(score>bestScore){bestScore=score;best=new Map(chosen);}return;}
    if(score+(ordered.length-index)*100<bestScore)return;
    const r=ordered[index];
    const institution=r.institutionId??ctx.programInstitutions?.[r.programId];
    const policy=ctx.institutionPolicies?.find(p=>p.institutionId===institution);
    const canShare=(previous:string)=>{
      const prior=reqs.find(r=>r.id===previous);
      const priorInstitution=prior?.institutionId??ctx.programInstitutions?.[prior?.programId??""];
      if(institution&&priorInstitution&&institution!==priorInstitution)return true;
      return ctx.allowDoubleCount??(policy?.allowDoubleCount===true||policy?.sharedRequirementPairs?.some(pair=>pair.includes(previous)&&pair.includes(r.id))===true);
    };
    const taken=new Set([...allocated].filter(([,owners])=>owners.some(owner=>!canShare(owner))).map(([id])=>id));
    const options=candidates(r.rule,{...ctx,truncated:()=>{limited=true;}},taken).sort((a,b)=>rank.indexOf(a.status)-rank.indexOf(b.status)||credits(a.used,ctx)-credits(b.used,ctx));
    const seen=new Set<string>();
    for(const e of options){
      const key=e.status+e.used.slice().sort().join("|");if(seen.has(key))continue;seen.add(key);
      const next=new Map(allocated);
      if(e.status!=="unsatisfied")e.used.forEach(id=>next.set(id,[...(next.get(id)??[]),r.id]));
      chosen.set(r.id,e);search(index+1,next,chosen,score+weights[e.status]);
    }
  }
  search(0,new Map(),new Map(),0);
  return reqs.map(r=>{
    const e=best.get(r.id)??empty(["Allocation could not be evaluated; check official sources"]);
    const done=e.used.filter(id=>ctx.completed.some(c=>c.courseId===id));
    return {requirementId:r.id,label:r.label,status:limited&&e.status==="unsatisfied"?"uncertain":e.status,creditsCounted:credits(e.used,ctx),usedCourseIds:e.used,completedCourseIds:done,projectedCourseIds:e.used.filter(id=>!done.includes(id)),uncertainCourseIds:done.filter(id=>!ctx.completed.find(c=>c.courseId===id)?.verified || e.notes.some(note=>note.startsWith(`${ctx.courses.find(c=>c.id===id)?.code}:`) || note.startsWith(`${ctx.courses.find(c=>c.id===id)?.code} needs`))),missingCourseIds:e.missing,notes:limited?[...e.notes,"Allocation search limit reached; review uncertain results with an adviser."]:e.notes};
  });
}
