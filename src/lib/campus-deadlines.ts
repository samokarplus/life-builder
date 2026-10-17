import type { CampusDeadline, ColoradoCampus } from "./importers/campuses";
import { describeDeadline, type EntryTerm } from "./deadlines";
export type CampusAudience="first-year"|"transfer";
/** Fixed cycles never recur. Annual patterns explicitly remain planning assumptions. */
export function campusDeadlines(campus:ColoradoCampus,audience:CampusAudience,term:EntryTerm,entryYear:number,today:Date){
 if(!Number.isInteger(entryYear)||entryYear<2020||entryYear>2100)throw new RangeError("Invalid entry year");
 return campus.deadlines.filter(d=>(d.audience===audience||d.audience==="both")&&d.term===term).flatMap(d=>{
  const date=resolve(d,entryYear);
  return date?[{...d,date,...describeDeadline({id:d.id,label:d.label,date},today)}]:[];
 }).sort((a,b)=>a.date.localeCompare(b.date));
}
function resolve(d:CampusDeadline,year:number):string|null{
 const w=d.when;
 if(w.basis==="fixed-cycle")return w.entryYear===year?w.date:null;
 return `${year+w.yearOffset}-${String(w.month).padStart(2,"0")}-${String(w.day).padStart(2,"0")}`;
}
