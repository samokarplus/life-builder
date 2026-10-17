import type { PathMetrics } from "./compare";
export const PRIORITIES=["Lowest total cost","Fastest graduation","Balanced workload","Mostly online","Fewest campus days","Career preparation"];
export function priorityMessage(priority:string|undefined,rows:{name:string;m:PathMetrics}[]) {
 if(!priority) return "Select a priority in Profile to put these tradeoffs in context.";
 const prefix=`Based on your selected priority: ${priority.toLowerCase()}.`;
 if(rows.length<2)return `${prefix} Select at least two scenarios to compare.`;
 if(/cost/i.test(priority)) {if(rows.some(r=>r.m.tuition==null))return `${prefix} Enter all tuition rates before comparing cost. Transfer eligibility remains unknown.`;const min=Math.min(...rows.map(r=>r.m.tuition!));const best=rows.filter(r=>r.m.tuition===min);return `${prefix} ${best.map(r=>r.name).join(" and ")} ${best.length===1?"has":"tie for"} the lowest estimated tuition at your entered rates. Fees, living costs, and transfer approval can change the result.`;}
 if(/fastest/i.test(priority)){const valid=rows.filter(r=>r.m.lastTerm);if(!valid.length)return `${prefix} Add courses before projecting a finish term.`;const earliest=Math.min(...valid.map(r=>r.m.lastTermKey));return `${prefix} ${valid.filter(r=>r.m.lastTermKey===earliest).map(r=>r.name).join(" and ")} ends planned coursework earliest. This is not verified graduation eligibility.`;}
 if(/balanced/i.test(priority))return `${prefix} Average planned loads range from ${Math.min(...rows.map(r=>r.m.avgLoad))} to ${Math.max(...rows.map(r=>r.m.avgLoad))} credits. Check individual semesters for peaks.`;
 return `${prefix} Verified modality, campus schedules, and career-specific requirements are not loaded. Unknown, check official sources.`;
}
