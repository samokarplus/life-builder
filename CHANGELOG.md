# Changelog

## Dream Helper refinement — October 16, 2026

- Refined ivory/forest surfaces, secondary-text contrast, responsive layouts, focus states, route transitions, page-shaped loading skeletons, empty states, and landing-page interactive previews.
- Replaced course-detail modals with a right-side drawer. Added native accessible confirmation dialogs, focus restoration, working top-bar search, mobile navigation, and route-group error boundaries.
- Roadmap: persisted view, chronological timeline with explicitly projected transfer and graduation-goal milestones, keyboard announcements, drag overlay, prerequisite-resolution actions, per-term credit warnings, and summer quick-add.
- Requirement evaluation: grade modifiers, nested AND/OR and credit thresholds, shared-course allocation with backtracking, institution-specific sharing policies, residency and transfer caps, uncertainty for unverified credit, and dashboard/roadmap drill-downs.
- Moved saves to IndexedDB through Zustand persist; versioned validation/migration retains the original v1 localStorage backup. Serialized writes, real save feedback, failure states and retry protect user choices.
- Added provenance-validated local catalog importer schemas, an explicitly illustrative fixture, and an unconfigured official-adapter interface. No scraping or new university data.
- Added broader deterministic assistant intents and an optional, local-only server AI provider, explicit user opt-in, minimal structured academic context, bounded requests, no client-side key, and deterministic fallback.
- Editable institutions, major, semester, program, degree, priorities and budget; onboarding now preserves these fields and external-credit reports. Compare messages reflect the selected priority. Career search, plan linking and self-reported stage tracking persist.
- Added engine, migration, importer, profile, and mocked AI tests; Playwright onboarding, keyboard/pointer drag, persistence/migration, compare, cost, drawer and career smoke tests; screenshot/axe/overflow matrix for every page at 1440, 768 and 375px in light/dark themes.

### Data and deployment limits

- Academic records and requirement rules remain illustrative. No official transfer equivalencies, program audits, modality, tuition, or researched licensing requirements have been added. Career placeholders remain explicit.
- Requirement allocation uses a bounded search; exhausting it marks otherwise-unsatisfied results uncertain. Institution policy definitions are supported, but no official policies are asserted.
- The importer validates local JSON and provides a future adapter contract; it does not fetch or activate official catalogs.
- AI requests are tested with a mocked provider; no paid live call was made. Configure both server environment variables and opt in in the assistant to use it. Responses still require official-source confirmation.
- Data stays in this browser unless explicitly exported or sent through optional AI. Browser data can still be cleared by the user/browser; keep JSON backups. Cross-device sync and multi-tab merge are outside this change.

### Validation

- Baseline: 29 unit tests and production build passed before edits.
- Final checks passed: 65 unit tests, `npx eslint src`, and `npx next build`. All 15 Playwright tests passed against the production build, including 84 screenshots across 10 pages, 3 widths and 2 themes plus alternate roadmap views/drawers/dialogs. Axe reported zero WCAG 2 A/AA and 2.1 AA violations in the tested states; page-width checks found no overflow at 375px. Screenshots were visually reviewed.
- Dependency audit: zero production advisories (`npm audit --omit=dev`). Five pre-existing high-severity development-tool advisories remain in the ESLint configuration/glob dependency chain; npm proposes an incompatible major configuration change, so no forced downgrade was applied.

## UI and strength pass (claude/ui-and-strength-pass)

- Landing: sticky navigation with anchors, hero glow, promise cards (private, sourced, never guesses), closing call to action, hover-lift cards.
- Dashboard: "you are here" journey cards, progress ring, credits-per-semester chart (amber above your limit), and a Plan health checklist (prerequisites, credit limit, empty terms, unverified completed credit). Checks run on the plan only and are labeled as not a degree audit.
- Roadmap: Ctrl/Cmd+Z undo and Shift+Ctrl/Cmd+Z / Ctrl+Y redo, ignored while typing.
- Added `planHealth` with tests (67 unit tests); all 15 Playwright tests, including axe, contrast and 375px overflow checks, still pass.
- Command palette (Ctrl/Cmd+K): jump to any page, run actions (undo, redo, theme, rebuild roadmap, print) or open a course in the explorer. Keyboard-navigable listbox.
- Dashboard "Your route": a stop-by-stop route of your semesters with a "you are here" marker and destination.
- Printable plan at `/print` (print or save as PDF), linked from the roadmap and palette.
- 73 unit tests, 15 Playwright tests pass.

## Real FRCC data (claude/real-frcc-data)

First verified data, each with its source URL, catalog year and verification date (2026-10-16):

- FRCC 2026-27 resident tuition: $299.75 per credit before fees, $183.75 after the $116 College Opportunity Fund stipend (frontrange.edu tuition page). Costs and Settings show it with "Use this rate" buttons; the rate you pick is still labeled user-entered.
- FRCC Associate of Arts, 2026-27 catalog: 60 credits and the requirement structure. ENG 1021/1022 and COM 1150/1250/2300 titles and credits are verified; the written and oral communication requirements now use them.
- The other AA areas (math, arts & humanities, history, social sciences, sciences, student choice, electives) depend on each course's gtPathways designation, which is not loaded. They report "needs a check" via a new `unmapped` rule type instead of guessing.
- CU Boulder tuition is intentionally not loaded: published figures I found disagreed with each other. Confirm with the CU Boulder Bursar.
- ENG 1022's prerequisite on ENG 1021 is still an unverified assumption. Plan generation skips the three COM options (a degree needs only one).
- Illustrative requirements moved to `illustrativeRequirements` for engine tests. 79 unit tests and 15 Playwright tests pass.
