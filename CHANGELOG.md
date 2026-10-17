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

## gtPathways mapping (claude/gtpathways-mapping)

- Loaded FRCC's official 2026-27 GT Pathway Courses list (about 240 courses with title, credits, category, and the catalog's "not currently offered" marks) from the FRCC catalog, verified 2026-10-16. Official details now override sample ones: GEY 1111 is Physical Geology w/Lab at 4 credits and HIS 1120 is "The World: 1500-Present".
- AA requirements for math, arts & humanities (two courses from different areas), history, social sciences, sciences (one lab course) and student choice are now evaluated from the real categories. Only the approved electives list is still "needs a check".
- Course Explorer: gtPathways filter, per-course category and offering status, "Show more" paging.
- PHI 1030, ENP 1005 and AIR 2001 are not on the gtPathways list and remain unverified sample courses.
- 84 unit tests pass, including new tests for same-area arts rejection and the lab-science rule.

## Dream Paths (claude/dream-paths)

- New Dream Paths page: end-to-end routes with sourced steps, dates and funding. Two paths so far: Licensed Professional Counselor in Colorado, and NASA astronaut via a STEM master's at CU Boulder (Aerospace Engineering Sciences lists Bioastronautics as a research area).
- CU Boulder transfer dates (spring Oct 1; summer/fall early notification Mar 15; fall final Jun 1; scholarship + FAFSA Jun 15) computed for your chosen entry term with live countdowns. The page prints month and day only, so cycles must be re-confirmed. The June 15 transfer scholarship is listed with no award amount because the page gives none.
- Source labels: NASA requirements (incl. three years of experience, 1,000 pilot-in-command hours, citizenship, physical), CU Boulder transfer timeline and AES graduate degrees were read from official pages. Colorado LPC figures (2,000 supervised hours, 1,500 direct contact, 50 supervision hours per 1,000) come only from search excerpts of C.R.S. 12-245-604 because DORA and the statute mirror blocked automated reading, so they are marked "Confirm with the official source".
- Not found: CU Boulder graduate application deadlines and GRE policy, a Colorado counseling program list, and scholarship amounts. None are guessed.
- Assistant answers deadline, LPC and astronaut questions with the same hedging. 94 unit tests pass.

## Colorado Dreams (claude/colorado-dreams)

- Dream Paths is now **Colorado Dreams**: pick your stage (high school to licensure) and dream, get a "your next step" card, dimmed earlier steps, and a friendlier tone.
- Colorado LPC route upgraded from "confirm" to **verified** using the official Colorado rules (4 CCR 737-1, effective 2025-09-14, read from the Secretary of State PDF) and DORA's applications and FAQ pages: CACREP-approved master's (60+ semester credits if enrolled after Aug 31, 2014), NBCC exam (results valid 5 years), jurisprudence exam (valid 1 year), candidate registration before counting hours, 2,000 supervised hours with 1,500 direct client contact over at least 24 months, 50 supervision hours per 1,000 (25 individual), hours older than 5 years not accepted, no reciprocity, license expiry rules. The earlier unverified "SB24-115" claim was removed because the official pages did not state it.
- **Colorado counseling program finder**: all 22 Colorado rows in the CACREP directory (Adams State, CCU, CSU, Denver Seminary, Regis, UCCS, CU Denver, DU, UNC) with specialty, degree, status and accreditation cycle end.
- CU Boulder Aerospace Engineering Sciences graduate details verified from the Graduate School table: MS/PhD/Professional MS, GRE not required, spring Oct. 1, fall Dec. 1.
- 97 unit tests pass. Still not loaded: scholarship amounts, program costs and deadlines for counseling programs, other Colorado campuses' course data.

## Funding, FAFSA and bioastronautics people (claude/funding-and-people)

- New **Funding & FAFSA** page with a dated calendar (countdowns) and sourced cards, filterable by dream (astronaut or counselor) and stage. Read from official pages on 2026-10-16: studentaid.gov (2027-28 FAFSA is available; federal deadline June 30, 2028; corrections Sept 12, 2028; Colorado's entry says to contact the school's aid office), CU Boulder Financial Aid (FAFSA recommended by March 1; scholarship application opens Dec 1, due March 15; transfer June 15), the CU Boulder First Generation Scholarship ($4,000/yr Colorado residents, $8,000/yr nonresidents), and the Colorado Space Grant Consortium (open to high school through graduate students).
- Astronaut-path funding examples come from the CU Bioastronautics Student Awards page (NSF GRFP, NASA NSTGRO, Draper, Zonta Amelia Earhart, NASA Pathways internships). They are labeled as examples; amounts and eligibility are not loaded.
- Astronaut path now shows **CU Boulder Bioastronautics**: professors with official profile links and listed research interests, eight bioastronautics courses (paraphrased), and BioServe Space Technologies and AReS. Equipment lists were not on the readable pages, so none are claimed.
- Not found: Integrative Physiology faculty doing space research (no dedicated IPHY space lab surfaced), scholarship amounts for Space Grant and the transfer scholarship, Colorado state aid deadlines.
- Assistant answers FAFSA/scholarship and professor questions. 105 unit tests pass.
- **Test infrastructure fix:** Playwright used to reuse whatever server was already on port 3000, which can be a different checkout. It now starts its own server on `PW_PORT` (default 3100) and never reuses one, so results always reflect the code in this repo. Running it that way found and fixed a landing-page contrast failure and a keyboard-unreachable scroll region on the dashboard route map, and the visual test now covers `/paths`, `/funding` and `/print`. 15 Playwright tests pass.

## Colorado brand and simpler navigation (claude/colorado-brand-ui)

- New **logo**: the Colorado flag's "C" and gold disc with Rocky Mountain peaks rising out of the letter, plus a "Dream Helper / Colorado" wordmark. Used in the sidebar, mobile header, landing page and as the favicon (`src/app/icon.svg`).
- Added a Colorado gold accent (light and dark), a mountain-ridge divider, and a gold marker on the active sidebar item.
- Sidebar regrouped into **Dream** (Colorado Dreams, Funding & FAFSA), **Plan**, **Explore** and **You**, so the vision comes first and the rest is easy to find.
- Landing page: "Colorado dreams" section (LPC route, astronaut route, funding) with counts read from the data files, so they can't drift from the real content.
- `docs/CODEX_REVIEW_PROMPT.md`: a ready-to-paste prompt for an independent review.

## Review fixes — October 16, 2026

- Audited all 233 official FRCC gtPathways rows and 22 Colorado CACREP records; added source ledger and REVIEW.md.
- Removed route-dependent source registration; corrected AA alternatives, grades, science reuse and restricted-credit handling.
- Protected migration/import identifiers and unsupported versions; added original-backup recovery.
- Hardened assistant inputs, deadline intents and program coverage; fixed date validation, incomplete plan generation and later-stage contrast.
- Expanded browser coverage; remaining academic, accessibility and deployment limitations are documented in REVIEW.md.

Review validation: 132 Vitest tests, 5 offline-comparator tests, 18 Playwright tests; ESLint and production build pass. The browser run captures 120 screenshots.

## Approved electives and CU Denver counseling (claude/electives-and-cu-denver)

- **FRCC approved electives list** transcribed from the catalog (expanding its collapsed sections): every gtPathways course, the named courses, and the "or higher" ranges (which exclude specialized courses and the 3000/4000 level). The AA tracker's electives requirement now evaluates from it instead of reporting "needs a check", and each course's drawer in the Explorer says why it does or doesn't count as an elective. Not modeled: the 3-credit cap on PED/OUT/DAN, and extra math/science credits flowing into electives.
- **CU Denver MA in Counseling, Clinical Mental Health** (read from the program's own page): on campus, 63 credits, CACREP, fall applications open Nov 1 and are due Jan 15, spring open Jul 1 and are due Sep 15, required group interview (Oct 23, 2026 and Mar 12, 2027 are the dates listed), application materials, and contact. Shown in the LPC route with live countdowns.
- 140 unit tests pass.
