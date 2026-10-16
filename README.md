# Dream Helper

Your future, mapped out — a local-first college & career pathway planner (initial pathway: FRCC → CU Boulder).

Full product brief: [SPEC.md](./SPEC.md).

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest: credits, prerequisites, requirements, scenarios, costs, persistence
```

## What's here

- **Onboarding** → generates an initial roadmap from the sample catalog
- **Overview** dashboard, **Roadmap** (timeline / board / dependency graph, drag-and-drop, undo/redo)
- **Course Explorer**, **Compare Paths**, **Costs & Savings**, **Career Explorer**, **Assistant** (deterministic, provider interface ready for an AI API)
- Data persists in `localStorage`; JSON export/import in Settings

## Data honesty

`src/data/sample.ts` is **illustrative sample data**: course codes come from the brief, credits are assumed, requirements are not the official FRCC/CU rules, and no tuition figures are included (users enter their own). Every record carries provenance (`DataSource`) so official catalog importers can replace it.

## Architecture

- `src/lib/types.ts` domain model · `schedule.ts` prerequisites/progress/plan generation · `requirements.ts` AND/OR/threshold/grade engine with double-count rules · `compare.ts` scenarios · `costs.ts` · `assistant/` provider interface
- `src/store/planner.ts` Zustand store (persisted, undo/redo, Zod-validated import)

## Not yet built

IndexedDB storage, official data importers, real transfer equivalencies, CU Boulder major requirements, course-offering availability.
