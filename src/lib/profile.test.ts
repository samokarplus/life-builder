import { expect,it } from "vitest";
import { priorityMessage } from "./profile";
import { pathMetrics } from "./compare";
import { profileSchema } from "@/store/planner";
import { defaultProfile } from "@/store/planner";
const m=pathMetrics([],[],[],{});
it("does not rank prices if any cost is unknown",()=>{expect(priorityMessage("Lowest total cost",[{name:"A",m:{...m,tuition:null}},{name:"B",m}])).toContain("Enter all tuition rates");});
it("explains a tie without declaring a best plan",()=>{expect(priorityMessage("Lowest total cost",[{name:"A",m},{name:"B",m}])).toContain("tie for");});
it("validates editable profile settings",()=>{expect(profileSchema.safeParse({...defaultProfile,budget:-1}).success).toBe(false);expect(profileSchema.safeParse({...defaultProfile,startingSemester:"not-a-term"}).success).toBe(false);expect(profileSchema.safeParse({...defaultProfile,budget:0,startingSemester:"fall-2026"}).success).toBe(true);});
