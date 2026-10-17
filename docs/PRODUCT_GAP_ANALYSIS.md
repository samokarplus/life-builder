# Product gap analysis: Dream Helper vs My Colorado Journey

Read on 2026-10-16 from the public pages of https://www.mycoloradojourney.gov (home, resources, methodology). We could not see behind any login, and found no account or saved-plan feature in the public pages, so "does not appear to" below means "not visible publicly", not "does not exist".

## What My Colorado Journey is
A Colorado occupational explorer: 16 industries, a public catalog of 646 careers and 76 pathway families, BLS wage benchmarks, Colorado labor-market signals, job-posting demand, and a directory of Colorado Workforce Centers and community resources (211, 988, unemployment help). Its stated goal is to help a person "choose a training, support, or job-search next step". Its methodology page is candid that growth and openings figures are workbook values until a state projections feed is ingested.

## What Dream Helper already does well
- A real planner: drag-and-drop semester roadmap, FRCC degree requirements checked against the official gtPathways and approved-electives lists, prerequisite and conflict checks, scenario comparison, cost estimates.
- Verified, sourced Colorado data with provenance on every record, stale-source warnings, and tests that fail if a record has no source.
- 16 Colorado routes (counselor, astronaut, nurse, doctor, EMT, electrician, teacher, PA, paramedic, software, PE, pharmacist, plumber, dental hygienist, LCSW, veterinarian) with ideal paths, honest challenges and real people.
- Six-campus transfer planner, CU Boulder requirement previews, funding calendar with countdowns, local-first persistence with export and import.

## Where we overlap
Browsing careers and seeing what a career takes. On occupation breadth, wages and openings they are far ahead, with official data pipelines, and we should not compete there.

## Where we are meaningfully different
1. **A plan, not a page.** We hold the student's own courses, dates, funding and route in one local profile. The public MCJ pages are exploration only.
2. **Requirement-level honesty.** We say what is satisfied, projected, uncertain or unknown, and mark assumptions.
3. **Dated, personal next steps.** CU Boulder and CU Denver deadlines, FAFSA and scholarship dates, counted down against the student's own plan.
4. **Sources shown on every claim.**

## What was missing (the pivot)
Our sections were separate tools: the roadmap, the route, and funding did not talk to each other, nothing told a student what to do next, and nothing remembered what they decided or were waiting on.

## Reusable pieces that carry the pivot
Student profile and `careerId`, `resolveGoal` mapping, pathway steps and progress, the requirement engine, `prereqIssues`, `cuTransferDeadlines` and funding dates, `cuDenverCmhc`, the funding records and their sources, the persistence and export schema, and the dashboard and navigation shell.

## Redundant or to be de-emphasized
- Do not add generic industry or occupation pages; link to MCJ for wages, openings and workforce centers.
- Career Explorer (Codex's earlier illustrative list) overlaps Colorado Dreams; it remains but Colorado Dreams is the entry point.

## Smallest valuable implementation (Phase 1, built)
A deterministic Action Center ("Next Steps") that turns the existing verified data and the student's plan into explained, editable, persistent actions tied to one goal. See `src/lib/journey/*` and `src/components/journey/*`.

## Next phases (not started; awaiting review)
2. Verified contacts directory and email drafts (mailto only, user sends).
3. Personalized opportunity matching with the existing four eligibility states, more records.
4. Assistant proposing structured actions the student confirms.
5. More Colorado coverage driven by real use.
