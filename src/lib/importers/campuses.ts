import { z } from "zod";

const citation = z.string().min(1);
const text = z.string().trim().min(1).max(2000);
const pattern = z.object({ basis:z.literal("annual-pattern"), month:z.number().int().min(1).max(12), day:z.number().int().min(1).max(31), yearOffset:z.number().int().min(-1).max(0) }).superRefine((d,ctx)=>{
 const date=new Date(Date.UTC(2027,d.month-1,d.day));
 if(date.getUTCMonth()!==d.month-1)ctx.addIssue({code:"custom",message:"Invalid month/day pattern."});
});
const fixed = z.object({ basis:z.literal("fixed-cycle"), date:z.iso.date(), entryYear:z.number().int().min(2020).max(2100) });
export const campusDeadlineSchema=z.object({id:citation,label:text,sourceId:citation,audience:z.enum(["first-year","transfer","both"]),term:z.enum(["spring","summer","fall"]),when:z.union([fixed,pattern])});
export const campusSchema=z.object({
 id:citation,name:text,sourceId:citation,
 admissions:z.array(z.object({audience:z.enum(["first-year","transfer"]),note:text,sourceId:citation})).length(2).refine(rows=>new Set(rows.map(r=>r.audience)).size===2,"Provide both first-year and transfer guidance."),
 deadlines:z.array(campusDeadlineSchema),
 tuition:z.object({sourceId:citation,period:text,scope:text,credits:z.literal(1),residentBase:z.number().positive().finite(),cof:z.number().nonnegative().finite(),caveat:text}).refine(t=>t.cof<=t.residentBase,"COF cannot exceed base tuition."),
 transfer:z.object({sourceId:citation,note:text}),
});
export type ColoradoCampus=z.infer<typeof campusSchema>;
export type CampusDeadline=z.infer<typeof campusDeadlineSchema>;
const sourceSchema=z.object({id:citation,url:z.url().refine(u=>new URL(u).protocol==="https:","Use an HTTPS official source URL."),lastVerified:z.iso.date().nullable(),status:z.enum(["verified","unverified"]),note:text}).superRefine((s,ctx)=>{
 if(s.status==="verified"&&!s.lastVerified)ctx.addIssue({code:"custom",message:"Verified sources need a check date."});
});
export const campusBundleSchema=z.object({version:z.literal(1),sources:z.array(sourceSchema).min(1),campuses:z.array(campusSchema).min(1)}).superRefine((bundle,ctx)=>{
 const ids=new Set(bundle.sources.map(s=>s.id));
 if(ids.size!==bundle.sources.length)ctx.addIssue({code:"custom",message:"Duplicate source ID."});
 const campusIds=new Set<string>();
 for(const [i,c] of bundle.campuses.entries()){
  if(campusIds.has(c.id))ctx.addIssue({code:"custom",path:["campuses",i,"id"],message:"Duplicate campus ID."});
  campusIds.add(c.id);
  const deadlineIds=new Set(c.deadlines.map(d=>d.id));
  if(deadlineIds.size!==c.deadlines.length)ctx.addIssue({code:"custom",path:["campuses",i,"deadlines"],message:"Duplicate deadline ID."});
  for(const record of [c,c.tuition,c.transfer,...c.admissions,...c.deadlines])if(!ids.has(record.sourceId))ctx.addIssue({code:"custom",path:["campuses",i],message:`Unknown DataSource: ${record.sourceId}`});
 }
});
/** Manual, reviewed JSON only. Parsing never fetches pages or activates data in a student's plan. */
export const campusImporter={id:"colorado-campus-json-v1",async parse(input:string){return campusBundleSchema.parse(JSON.parse(input));}};
