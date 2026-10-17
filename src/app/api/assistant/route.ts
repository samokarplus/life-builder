import { assistantRequestSchema, ACADEMIC_INSTRUCTIONS, responseText } from "@/lib/assistant/server";
import { courses, requirements, sources } from "@/data/sample";
import { evaluateRequirements } from "@/lib/requirements";
import { planContext } from "@/lib/plan-context";
import { pathMetrics } from "@/lib/compare";
const configured=()=>Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL);
const headers={"Cache-Control":"no-store"};
export async function GET(request:Request){
 // This optional endpoint is intentionally local-only, like the planner.
 const local=["localhost","127.0.0.1","[::1]"].includes(new URL(request.url).hostname);
 return Response.json({enabled:local&&configured()},{headers});
}
export async function POST(request:Request){
 const url=new URL(request.url);
 if(!["localhost","127.0.0.1","[::1]"].includes(url.hostname)||request.headers.get("origin")&&request.headers.get("origin")!==url.origin)return Response.json({error:"Only same-origin local requests are supported."},{status:403,headers});
 if(!configured())return Response.json({error:"Optional AI is not configured."},{status:503,headers});
 const raw=await request.text();if(raw.length>100000)return Response.json({error:"Plan is too large."},{status:413,headers});
 let data;try{data=assistantRequestSchema.parse(JSON.parse(raw));}catch{return Response.json({error:"Invalid structured plan."},{status:400,headers});}
 const {profile,semesters,tuitionPerCredit}=data.plan;
 const facts={question:data.question,plan:data.plan,courses,sources,requirements:evaluateRequirements(requirements,{courses,...planContext(semesters,profile.completed)}),metrics:pathMetrics(semesters,courses,profile.completed,tuitionPerCredit)};
 try {
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL,instructions:ACADEMIC_INSTRUCTIONS,input:JSON.stringify(facts),store:false,max_output_tokens:700}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error("Provider unavailable");const answer=responseText(await response.json());if(!answer)throw Error("Empty answer");
  return Response.json({answer:`AI explanation — confirm academic decisions with official sources. ${answer}`},{headers});
 }catch{return Response.json({error:"AI unavailable. Use the built-in assistant."},{status:502,headers});}
}
