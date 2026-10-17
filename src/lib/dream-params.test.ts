import { expect, it } from "vitest";
import { parseDreamParams, routeProgress } from "./dream-params";
import { pathways } from "@/data/pathways";
it("bounds invalid query hints and respects a saved high-school starting point", () => {
  expect(parseDreamParams(new URLSearchParams({path:"javascript:alert(1)",stage:"bogus",q:"x".repeat(1000)}), {currentStage:"high-school"})).toEqual({pathId:pathways[0].id,stage:"high-school",query:"x".repeat(200)});
  expect(parseDreamParams(new URLSearchParams({path:"rn-colorado",stage:"graduate"}), {}).stage).toBe("graduate");
});
it("deduplicates and excludes unknown progress IDs", () => {
  expect(routeProgress("rn-colorado", ["rn-1","rn-1","unknown"])).toEqual(["rn-1"]);
  expect(routeProgress("unknown", ["rn-1"])).toEqual([]);
});
