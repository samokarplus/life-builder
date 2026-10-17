# Codex review prompt

Paste everything below the line into Codex, from the repo root.

---

You are the independent reviewer and fixer for **Dream Helper (Colorado)**, a local-first planner that combines a student's school dream and job dream: FRCC to CU Boulder and beyond, Colorado licensure and career routes (LPC counselor, astronaut via CU Boulder bioastronautics), funding and FAFSA, and a requirement/credit engine. Stack: Next.js App Router, TypeScript, Tailwind v4, Zustand + IndexedDB, dnd-kit, React Flow, Recharts, Zod, Vitest, Playwright. Read README.md, SPEC.md and CHANGELOG.md first.

## Ground rules (do not break these)
1. **Never invent academic, legal, price or deadline facts.** Every fact lives in `src/data/*` with a `DataSource` (url, lastVerified, status). If you cannot read an official source, mark it `unverified` and say so in the UI. Do not scrape beyond reading single public pages.
2. Keep verified facts, projections and user-entered values visibly separate.
3. Every fix needs a test. Small commits. Update CHANGELOG.md. Work on a branch named `codex/<topic>` and open a PR to `main`; do not push to `main`.
4. **Run Playwright on its own port** (`PW_PORT=3100 npx playwright test`). It never reuses a server. (An earlier bug had tests silently hitting another checkout on port 3000; do not reintroduce that.) Run `npm test`, `npx eslint src`, `npx next build` before every PR.

## 1. Re-verify the data (highest priority)
For each source in `src/data/sample.ts`, `pathways.ts`, `programs.ts`, `funding.ts`, `people.ts`, open the official URL in a browser and check what we claim. Report a table: claim, our value, what the page says now, status. Specifically:
- FRCC 2026-27 tuition ($299.75, COF $116) and the AA structure (60 credits; area credits; electives 18-23).
- **gtPathways transcription**: `src/data/frcc-gtpathways-raw.ts` was typed from FRCC's GT Pathway Courses page. Diff it against the live page: missing or extra courses, wrong credits, wrong categories, courses marked "not offered" (*).
- CU Boulder: transfer timeline dates, financial aid timeline (Dec 1 / Feb 15 / Mar 1 / Mar 15 / Jun 15), First Generation Scholarship amounts, Aerospace Engineering Sciences graduate deadlines (spring Oct 1, fall Dec 1, GRE not required).
- Colorado LPC rules: 4 CCR 737-1 (effective 2025-09-14): CACREP master's (60 semester credits if enrolled after 8/31/2014), NBCC exam, jurisprudence exam validity, candidate registration before counting hours, 2,000 hours / 1,500 direct / 24 months, supervision ratios, 5-year hour limit. Confirm there is no newer rule version.
- CACREP Colorado list (22 rows) and NASA astronaut basic qualifications (note the NASA page text mentions 2025 dates; flag anything stale).
- Bioastronautics faculty list and course list.
Fix any discrepancy by correcting the data and the source note. If something cannot be confirmed, downgrade it to `unverified`.

## 2. Find bugs and fragile design
- `sources.push(...)` side-effect registration across data files: a test already caught one ordering bug. Replace with an explicit registry (single `sources` module, no import-order dependence) and tests that fail on dangling `sourceId`s.
- Date logic: `describeDeadline`, `nextOccurrence`, `cuTransferDeadlines`, `nextFallEntry` around midnight, DST, leap day, and year rollover. Add property-style tests.
- Requirement engine (`src/lib/requirements.ts`): AA "two arts & humanities from different areas", lab-science rule, double-count rules, `unmapped` rule, backtracking search limit. Try to break it with adversarial transcripts.
- Plan generation (`generatePlan`) with prerequisites that are unverified; `planDefault: false` courses.
- Persistence: IndexedDB migration from v1 localStorage, JSON export/import round trip (including `scenarios`, `costInputs`, `careerStageProgress`), corrupted data, quota errors, two tabs open.
- Assistant (`src/lib/assistant/deterministic.ts`): regex intent routing order (e.g. "transfer", "deadline", "scholarship"); questions that should refuse; the optional server AI route (`src/app/api/assistant`): key handling, request limits, prompt injection from stored data, error paths. No live paid calls without asking me.
- Security pass: XSS via imported JSON or data strings, external links (`rel`), CSP/headers, dependency audit.

## 3. UX, accessibility and brand
- Walk every page at 1440 / 768 / 375 px in light and dark: `/`, `/onboarding`, `/overview`, `/roadmap` (board, timeline, dependencies), `/explorer`, `/compare`, `/careers`, `/paths` (Colorado Dreams, both routes, every stage), `/funding`, `/costs`, `/profile`, `/settings`, `/print`, command palette (Ctrl/Cmd+K), assistant panel.
- Keyboard-only: tab order, focus traps in dialogs/drawers, drag-and-drop with the keyboard, skip link.
- Is the interface friendly and simple? List the five most confusing moments for a first-year student and fix the cheapest ones. Check copy for jargon (gtPathways, CACREP, NBCC, COF) and add plain-language explanations where missing.
- Brand consistency: logo (`src/components/brand/logo.tsx`, `src/app/icon.svg`), gold accent usage, spacing, empty and loading states.
- Axe: zero violations in all states, including the new pages and dialogs.

## 4. Discover and propose
- Add a `npm run verify-sources` script that lists every `DataSource`, its age, and flags any older than 90 days; surface stale sources in the UI.
- Propose (and, if small, build) the next safe expansion: CU Denver, CSU, Colorado School of Mines, Colorado Mesa, UNC. Define exactly which official pages supply course catalogs, transfer guides, deadlines and tuition for each, check each site's terms for permitted access, and write the importer contract. Do not scrape.
- Propose the next careers (engineer, physician, teacher, software developer) with the official licensing/accreditation sources for Colorado.
- Review the product against SPEC.md: list features still missing or only partly built.

## Deliverables
1. `REVIEW.md` at the repo root: findings by severity (blocker / major / minor), each with repro steps, evidence, and fix status.
2. Fixes on a `codex/review-fixes` branch with tests, passing `npm test`, `npx eslint src`, `npx next build`, and `PW_PORT=3100 npx playwright test`.
3. A short list of questions for me where a judgment call is needed.
