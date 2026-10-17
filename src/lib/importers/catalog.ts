import { z } from "zod";
import type { RequirementRule } from "../types";
export const dataSourceSchema = z.object({
  id:z.string().min(1),url:z.url().refine(url => ["https:", "http:"].includes(new URL(url).protocol), "Use an HTTP(S) source URL.").nullable(),institutionId:z.string().nullable(),catalogYear:z.string().nullable(),lastVerified:z.iso.date().nullable(),
  status:z.enum(["verified","unverified","illustrative","user-entered"]),note:z.string().optional(),
}).superRefine((s,ctx)=>{if(s.status==="verified"&&(!s.url||!s.lastVerified||!s.catalogYear))ctx.addIssue({code:"custom",message:"Verified records require an official source URL, catalog year and verification date."});});
export const courseSchema = z.object({id:z.string().min(1),institutionId:z.string().min(1),code:z.string().min(1),title:z.string().min(1),credits:z.number().nonnegative().max(30),level:z.union([z.literal(1000),z.literal(2000),z.literal(3000),z.literal(4000),z.literal(5000),z.literal(6000),z.literal(7000),z.literal(8000),z.literal(9000)]),prerequisiteIds:z.array(z.string()),category:z.string(),description:z.string().optional(),gtPathways:z.array(z.string()).optional(),notOffered:z.boolean().optional(),planDefault:z.boolean().optional(),eligibilityNote:z.string().optional(),prerequisiteSourceId:z.string().optional(),sourceId:z.string()});
const ruleSchema:z.ZodType<RequirementRule>=z.lazy(()=>z.discriminatedUnion("type",[
  z.object({type:z.literal("unmapped"),credits:z.number().nonnegative(),note:z.string().min(1)}),
  z.object({type:z.literal("course"),courseId:z.string(),minGrade:z.string().optional()}),
  z.object({type:z.literal("group"),courseIds:z.array(z.string()),minGrade:z.string().optional()}),
  z.object({type:z.literal("all"),rules:z.array(ruleSchema),distinctCourses:z.boolean().optional()}),z.object({type:z.literal("any"),rules:z.array(ruleSchema)}),
  z.object({type:z.literal("credits"),min:z.number().nonnegative(),from:ruleSchema}),
  z.object({type:z.literal("residency"),institutionId:z.string(),minCredits:z.number().nonnegative(),sourceId:z.string(),from:ruleSchema.optional()}),
  z.object({type:z.literal("transfer"),from:ruleSchema,maxCredits:z.number().nonnegative(),sourceId:z.string()}),
]));
export const catalogSchema=z.object({
  version:z.literal(1),sources:z.array(dataSourceSchema).min(1),courses:z.array(courseSchema),
  requirements:z.array(z.object({id:z.string(),programId:z.string(),label:z.string(),institutionId:z.string().optional(),sourceId:z.string(),rule:ruleSchema})),
  tuition:z.array(z.object({id:z.string(),institutionId:z.string(),academicYear:z.string(),perCredit:z.number().nonnegative().nullable(),residency:z.enum(["in-state","out-of-state"]),sourceId:z.string()})),
}).superRefine((data,ctx)=>{
  const ids=new Set(data.sources.map(s=>s.id));
  if(ids.size!==data.sources.length)ctx.addIssue({code:"custom",path:["sources"],message:"Duplicate source ID."});
  const courseIds=new Set(data.courses.map(c=>c.id));
  function checkRule(rule:RequirementRule,path:(string|number)[]) {
    if((rule.type==="residency"||rule.type==="transfer")&&!ids.has(rule.sourceId))ctx.addIssue({code:"custom",path,message:"Nested policy must reference a supplied DataSource."});
    if(rule.type==="course"&&!courseIds.has(rule.courseId))ctx.addIssue({code:"custom",path,message:"Unknown requirement course ID."});
    if(rule.type==="group"&&rule.courseIds.some(id=>!courseIds.has(id)))ctx.addIssue({code:"custom",path,message:"Unknown group course ID."});
    if(rule.type==="all"||rule.type==="any")rule.rules.forEach((r,i)=>checkRule(r,[...path,"rules",i]));
    if(rule.type==="residency"&&rule.from)checkRule(rule.from,[...path,"from"]);
    if(rule.type==="credits"||rule.type==="transfer")checkRule(rule.from,[...path,"from"]);
  }
  data.requirements.forEach((r,i)=>checkRule(r.rule,["requirements",i,"rule"]));
  data.courses.forEach((c,i)=>{if(c.prerequisiteSourceId&&!ids.has(c.prerequisiteSourceId))ctx.addIssue({code:"custom",path:["courses",i,"prerequisiteSourceId"],message:"Unknown prerequisite DataSource."});if(c.prerequisiteIds.some(id=>!courseIds.has(id)))ctx.addIssue({code:"custom",path:["courses",i,"prerequisiteIds"],message:"Unknown prerequisite course ID."});});
  for(const [key,records] of Object.entries({courses:data.courses,requirements:data.requirements,tuition:data.tuition})) {
    const seen=new Set<string>();
    records.forEach((r,index)=>{if(!ids.has(r.sourceId))ctx.addIssue({code:"custom",path:[key,index,"sourceId"],message:"Every record must reference a supplied DataSource."});if(seen.has(r.id))ctx.addIssue({code:"custom",path:[key,index,"id"],message:"Duplicate stable ID."});seen.add(r.id);});
  }
});
export type CatalogBundle=z.infer<typeof catalogSchema>;
export interface CatalogImporter {
  id:string;
  label:string;
  /** Parse a user-supplied official export; no network access or scraping. */
  parse(input:string):Promise<CatalogBundle>;
}
export const jsonCatalogImporter:CatalogImporter={id:"catalog-json-v1",label:"Structured catalog JSON",async parse(input){return catalogSchema.parse(JSON.parse(input));}};
/** Stub for a future institution-specific parser. Data must be reviewed before activation. */
export function officialCatalogImporter(institutionId:string):CatalogImporter {
 return {id:`official-${institutionId}`,label:"Official catalog adapter (not configured)",async parse(){throw new Error("Official adapter not configured. Supply a reviewed structured JSON export; no website fetching is supported.");}};
}
