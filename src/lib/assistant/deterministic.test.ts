import { describe, expect, it } from "vitest";
import { deterministicProvider } from "./deterministic";
import { courses, sampleSemesters } from "@/data/sample";
import { defaultProfile } from "@/store/planner";
import { pathMetrics } from "../compare";

const ctx = {
  profile: defaultProfile, semesters: sampleSemesters, courses, requirements: [],
  metrics: pathMetrics(sampleSemesters, courses, [], { frcc: null, cub: null }),
  tuitionPerCredit: { frcc: null, cub: null }, prereqIssueCount: 1,
};

describe("deterministic assistant", () => {
  it("answers graduation from the plan", async () => {
    expect(await deterministicProvider.answer("Can I graduate by summer 2027?", ctx)).toMatch(/Spring 2027.*on or before Summer 2027/);
  });
  it("refuses to invent tuition or modality", async () => {
    expect(await deterministicProvider.answer("Would this save money?", ctx)).toMatch(/don't include verified tuition/);
    expect(await deterministicProvider.answer("Can I take only two in-person classes?", ctx)).toMatch(/aren't verified/);
  });
  it("does not invent major requirements", async () => {
    expect(await deterministicProvider.answer("What if I switch to psychology?", ctx)).toMatch(/isn't loaded/);
  });
});
it("covers stored priorities, workloads and unknown transfer credit",async()=>{expect(await deterministicProvider.answer("What are my priorities?",ctx)).toContain("15 credits");expect(await deterministicProvider.answer("Is my load too high?",{...ctx,profile:{...ctx.profile,maxCreditsPerSemester:12}})).toContain("4 over");expect(await deterministicProvider.answer("Will AP credit transfer?",ctx)).toContain("unknown, check official sources");});

it("answers deadlines, LPC and astronaut questions with sourced, hedged text",async()=>{
  expect(await deterministicProvider.answer("What is the transfer deadline?",ctx)).toMatch(/Fall early-notification deadline: \d{4}-03-15.*confirm/);
  expect(await deterministicProvider.answer("How do I become an LPC therapist?",ctx)).toContain("2,000 supervised hours");
  expect(await deterministicProvider.answer("What does NASA require for astronaut?",ctx)).toContain("three years");
});

it("answers FAFSA and faculty questions from sourced data",async()=>{
  expect(await deterministicProvider.answer("How do I pay for this, FAFSA?",ctx)).toContain("June 30, 2028");
  expect(await deterministicProvider.answer("Which professors work on astronaut research?",ctx)).toContain("Torin Clark");
});
it('uses the requested spring year and separates graduate/licensing deadlines',async()=>{
 expect(await deterministicProvider.answer('Transfer deadline for spring 2027?',ctx)).toContain('2026-10-01');
 expect(await deterministicProvider.answer('Aerospace masters application deadline?',ctx)).toContain('Fall Dec. 1');
 expect(await deterministicProvider.answer('LPC application deadline?',ctx)).not.toContain('Fall early-notification');
});
it('orders upcoming courses chronologically even with unsorted imported semesters',async()=>{
 const answer=await deterministicProvider.answer('What courses are next?',{...ctx,semesters:[{...sampleSemesters[1],year:2029},sampleSemesters[1]]});
 expect(answer).toContain('Spring 2027');
});
