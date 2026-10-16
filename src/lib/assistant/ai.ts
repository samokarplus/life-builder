import type { AssistantProvider } from "./provider";
import { deterministicProvider } from "./deterministic";
/** Opt-in only. Never pass arbitrary client files, logs, or a conversation history. */
export const aiProvider:AssistantProvider={name:"Optional AI · structured plan only",async answer(question,ctx){
 try {
  const p=ctx.profile;
  const response=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,plan:{profile:{currentInstitutionId:p.currentInstitutionId,destinationInstitutionId:p.destinationInstitutionId,major:p.major,maxCreditsPerSemester:p.maxCreditsPerSemester,completed:p.completed,priorities:p.priorities},semesters:ctx.semesters,tuitionPerCredit:ctx.tuitionPerCredit}})});
  if(!response.ok)throw Error("AI unavailable");
  const data=await response.json();if(typeof data.answer!=="string")throw Error("Invalid answer");return data.answer;
 }catch{return `AI is unavailable; here is the built-in answer. ${await deterministicProvider.answer(question,ctx)}`;}
}};
