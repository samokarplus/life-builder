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
- Data persists in IndexedDB with a v1 localStorage migration and real save feedback; JSON export/import in Settings

## Data honesty

`src/data/sample.ts` is **illustrative sample data**: course codes come from the brief, credits are assumed, requirements are not the official FRCC/CU rules, and no tuition figures are included (users enter their own). Every record carries provenance (`DataSource`) so official catalog importers can replace it.

## Architecture

- `src/lib/types.ts` domain model · `schedule.ts` prerequisites/progress/plan generation · `requirements.ts` AND/OR/threshold/grade engine with double-count rules · `compare.ts` scenarios · `costs.ts` · `assistant/` provider interface
- `src/store/planner.ts` Zustand store (persisted, undo/redo, Zod-validated import)

## Not yet built

Official catalog adapter activation, real transfer equivalencies, CU Boulder major requirements, and verified course-offering availability. The local JSON importer contract and illustrative fixture are in `src/lib/importers/`.


## Validation and visual review

```bash
npm test
npx eslint src
npx next build
npx playwright install chromium
npm run test:e2e
```

Playwright starts the production build on port 3000. `npm run test:smoke` runs the interaction suite only. The full suite also runs axe and captures every page at 1440px, 768px and 375px, in both themes, under `artifacts/screenshots/`. Screenshots are review artifacts, not pixel-baseline assertions. The HTML report is in `playwright-report/` (both folders are ignored by Git).

## Storage and migration

Zustand uses `idb-keyval` with the IndexedDB database `dream-helper`, object store `plans`, and stable key `dream-helper:v1`; the envelope's version is now 2. On first load it reads a previous v1 localStorage envelope if IndexedDB is empty, validates it, and saves the migrated state. The original localStorage entry is kept as a backup. A failed read/validation is shown instead of replacing the plan; failed writes retain the in-memory changes and offer retry/export. The top bar reports actual save completion and its persisted timestamp, never a timer-based success. Export accepts v1 or v2 JSON; new exports are v2. Keep backups before clearing browser data. Simultaneous editing in multiple tabs is not merged.

## Requirement and importer contracts

`DegreeRequirement.institutionId` (or `EvalContext.programInstitutions`) selects `institutionPolicies`, each with provenance, an explicit double-count switch and optional shared requirement pairs. No official institution policies are supplied. Residency and transfer-cap rules also carry source IDs. Grade comparison handles plus/minus letters; unknown/pass-fail interpretations remain uncertain. A requirement's projected completion never becomes earned completion. Drill-downs show used, missing, reported-completed and projected courses.

`src/lib/importers/catalog.ts` validates a supplied JSON bundle and resolves each record's `DataSource`. Verified sources need a URL, catalog year and verification date; the label alone does not establish truth. The included fixture reuses an illustrative sample course. Institution-specific official parsing is intentionally stubbed, with no network fetching.

## Optional AI assistant

Development and production preview bind to 127.0.0.1 by default. The deterministic assistant works offline. Optional AI requires both of these **server-only** variables in `.env.local`:

```text
OPENAI_API_KEY=your-own-key
OPENAI_MODEL=your-enabled-model-id
```

Restart the server after configuring them. No key is exposed in browser code. The assistant then shows a separate opt-in explaining that the current question and structured academic plan are sent to OpenAI; dream text, budget and prior chat messages are omitted. The endpoint accepts same-origin localhost requests only, validates/bounds input, supplies the trusted sample catalog and provenance, uses no web tools, and falls back to a built-in answer on failure. It cannot modify a plan. AI explanations are not verified academic advice. Live API behavior is not exercised by the test suite; tests mock the network.

The implementation follows the official [Responses API documentation](https://developers.openai.com/api/docs/guides/migrate-to-responses), including separate instructions and `store: false`. No recurring cloud storage, login, or hosting migration is introduced.

See [CHANGELOG.md](CHANGELOG.md) for scope and remaining data gaps.
