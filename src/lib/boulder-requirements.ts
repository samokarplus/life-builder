import { boulderCourses,boulderPrograms } from "@/data/boulder";
import { evaluateRequirements,type EvalContext } from "./requirements";
/** Categories intentionally overlap aggregates; distinct area allocation is nested in the area rule.
 * BIA handbook explicitly permits math/BIA and math/non-BIA overlap. Credit totals remain deduplicated.
 * Manual checks always stay uncertain; category completion is never a graduation determination. */
export function evaluateBoulderProgram(programId:string,context:Omit<EvalContext,"courses"|"allowDoubleCount">){
 const program=boulderPrograms.find(p=>p.id===programId);
 if(!program)throw new RangeError("Unknown CU Boulder program");
 return evaluateRequirements(program.requirements,{...context,courses:boulderCourses,allowDoubleCount:true});
}
