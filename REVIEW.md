# Dream Helper review

Reviewed October 16, 2026 (America/Los_Angeles). Base: `origin/main` at `cbbf4da`. Fix branch: `codex/review-fixes`.

## Result

The course transcription is accurate. The larger problems were in the interpretation and presentation of that data, import validation, and source registration. Fixes and regression tests are included on this branch. This remains a planning aid with incomplete degree-audit coverage.

- **233 gtPathways courses**, not 240, exist in both `GT_RAW` and the official FRCC page. All 233 rows match on code, normalized title, credits, GT category and the “not currently offered” asterisk. No missing or extra rows were found. The Explorer has 237 records: these 233 plus COM 1150 and three illustrative courses.
- **22 Colorado CACREP records** match the live directory, including institution, city, specialty, degree, accreditation status and cycle-end date.
- The source inventory contains **31 records: 27 rechecked, one previously verified source not reconfirmed, and three illustrative/unverified records carrying no verified factual dataset**. The Graduate School dynamic table did not load; its source is now unverified and active Aerospace claims use the department’s application/deadline pages.
- The main remaining data gaps are approved electives, GPA/residency auditing, transfer equivalencies, other selected programs, course prerequisites/offerings, and CU tuition. None is filled with guessed data.

Evidence: [course-by-course CSV](review/gtpathways-audit.csv), [comparison summary and document hash](review/gtpathways-audit.json), [complete source ledger](review/sources-audit.json).

## Factual audit

The ledger records each source’s review method and disposition. This audit covers the loaded datasets and their user-facing explanations; illustrative placeholders remain identified as such. Official pages were read directly, with live browser fallbacks for JavaScript content. No campus dataset was expanded or catalog importer activated.

### FRCC

The [2026–27 GT list](https://frontrange.smartcatalogiq.com/current/catalog/elective-lists/gt-pathway-courses/) was compared row by row using a single saved official document. Only whitespace and printed category suffixes were normalized; codes, credits, categories and availability marks were compared explicitly. The source HTML SHA-256 is recorded in the JSON summary. To repeat against a manually saved official page:

```sh
python3 scripts/audit-gt.py /path/to/official-page.html
```

The comparison script has no network or application-import behavior. The committed CSV is audit evidence, not a new catalog feed. The row match does **not** establish prerequisites, section availability, transfer equivalency, or unrestricted eligibility. In particular, SCI 1055/1056 require a teacher-education agreement and completion of both courses with qualifying grades. Their restriction is now displayed, and the generic AA engine reports them as uncertain.

The [AA degree page](https://frontrange.smartcatalogiq.com/en/current/catalog/program-information/degree-descriptions/aa-degree) confirms the 60-credit total, area structure and oral options. Fixes add the CO2+CO3 writing alternative, require distinct science courses, and apply the published C minimum. Missing grades remain uncertain. The panel now states the additional 2.0 GPA and 25% FRCC residency conditions without pretending to audit them. Electives remain unmapped. Requirements for a selected AS or another institution are explicitly unknown.

The [tuition page](https://frontrange.edu/admissions-aid/paying-for-college/tuition-fees/tuition-rates.html) matches the loaded regular-resident reference: $299.75/credit, $116 COF, $183.75 after COF if eligible, excluding fees. These are reference options; no user rate is automatically overwritten. No CU tuition amount is loaded.

### Admissions, funding and careers

| Dataset | Official evidence | Outcome |
|---|---|---|
| CU undergraduate transfer | [Live transfer timeline](https://www.colorado.edu/admissions/process/transfer/timeline) | Oct 1 spring; Mar 15 summer application/fall early notification; Jun 1 fall final; Jun 15 transfer scholarship/need-based FAFSA. Corrected the summer label. The page separately announces the 2027 cycle; future computed years are planning assumptions. |
| CU Aerospace graduate | [Deadlines](https://www.colorado.edu/aerospace/admissions/graduates/deadlines-fees), [How to apply](https://www.colorado.edu/aerospace/admissions/graduates/how-apply), [degree overview](https://www.colorado.edu/academics/grad-aerospace-engineering-sciences) | Spring Oct 1/fall Dec 1 corroborated. GRE is optional for PhD and not accepted for master’s/professional master’s applicants. Replaced the broad GRE wording and removed the unconfirmed contact field. MS/PhD/Professional MS and online Professional MS descriptions match. |
| Colorado LPC | [Current rule PDF, effective 2025-09-14](https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=12132&fileName=4%20CCR%20737-1), [DORA applications](https://dpo.colorado.gov/ProfessionalCounselor/Applications), [DORA FAQ](https://dpo.colorado.gov/MentalHealth/FAQ) | Reviewed education/equivalency, exam, experience, supervision and renewal statements. Added approved-equivalency and permitted-practice-status alternatives, and qualified the five-year experience limit for exceptions. Core 2,000/1,500-hour and 24-month statements match. This is a summarized route, not a complete legal eligibility determination. |
| Colorado counseling programs | [CACREP live directory](https://www.cacrep.org/directory/) | Filtered CO and currently accredited statuses; all 22 loaded rows match. Accreditation is program-specific, not a blanket institutional or LPC-eligibility guarantee. |
| NASA | [Become an Astronaut](https://www.nasa.gov/humans-in-space/astronauts/become-an-astronaut/) | Citizenship, STEM master’s/alternatives, three years’ experience, pilot hours and physical match. Added the omitted 850 high-performance-jet qualification to the assistant. Corrected the statement that selection/training details were absent. June 2025 exceptions on the source are cycle-specific; the app does not offer a current application window. |
| FAFSA | [Filling out the form](https://studentaid.gov/apply-for-aid/fafsa/filling-out), [deadlines](https://studentaid.gov/apply-for-aid/fafsa/fafsa-deadlines) | Verified live in browser: form years, tax years, federal deadline/corrections and Colorado’s financial-aid-office guidance. Added the independent-student spouse qualification. Summer form choice needs school confirmation. |
| CU aid timeline | [Completing the FAFSA](https://www.colorado.edu/financialaid/apply-aid/fafsa) | March 1 recommendation and scholarship month/day pattern match. Source has inconsistent year wording in its 2026–27 timeline, so future dates remain expressly annual-pattern projections. |
| First Generation scholarship | [Scholarship page](https://www.colorado.edu/scholarships/first-generation) | Amounts and first-year/transfer deadlines match. Added nonresident award prerequisite, transfer-credit limit treatment and summer restriction. No award is promised. |
| Space Grant | [Student opportunities](https://www.colorado.edu/center/spacegrant/student-involvement-opportunities-space-grant) | Participation groups, listed challenges and CU-only positions match. Removed the unsupported “21 colleges” assertion from this page’s summary. |
| Five fellowship/internship examples | [Bioastronautics student awards](https://www.colorado.edu/bioastronautics/student-awards) | GRFP, NSTGRO, Draper, two Amelia Earhart awards and three 2026 Pathways recognitions match the described years. These historical examples do not establish current eligibility, amounts or open applications. |

### People, courses and facilities

The [faculty directory](https://www.colorado.edu/bioastronautics/faculty) matches all 12 loaded names, roles and active/affiliated/retired groupings. Detailed education, award and research-interest claims were checked against [Clark](https://www.colorado.edu/aerospace/torin-clark), [Hayman](https://www.colorado.edu/aerospace/allie-hayman), [Nabity](https://www.colorado.edu/aerospace/james-nabity), [Arquilla](https://www.colorado.edu/aerospace/katya-arquilla), and [Klaus](https://www.colorado.edu/aerospace/david-klaus). They now have individual source records. Klaus’s unsupported “human performance analysis” paraphrase was replaced. Hayman’s link now uses the current canonical URL. Other entries carry directory-level roles/link descriptions, not imported biography claims.

All eight displayed ASEN course summaries and printed offering patterns match the [curriculum page](https://www.colorado.edu/bioastronautics/curriculum). These patterns are not verified section schedules. BioServe’s description matches the [program home page](https://www.colorado.edu/bioastronautics/); AReS is listed on the [equipment page](https://www.colorado.edu/bioastronautics/laboratory-equipment). Corrected the inaccurate statement that equipment lists were unavailable. Student access remains unknown.

## Bugs fixed

| Severity | Reproduction / previous behavior | Fix and regression evidence |
|---|---|---|
| P1 | Import only the catalog/API: funding, licensing or program source IDs could be absent because feature modules mutated a shared array. | Complete immutable source registry, duplicate-ID guard and isolated source-lookup test. |
| P1 | Complete one 4-credit lab: the science AND rule reused it for both courses. | Explicit distinct-course clauses; one lab fails, two qualifying courses pass. Existing shared-clause semantics remain available where intended. |
| P1 | Complete ENG 1022 + a CO3 course, or supply a D grade: AA results were respectively rejected or falsely accepted. | Published writing alternative and C minimum; missing/pass interpretations stay uncertain. |
| P1 | Select AS or change current institution: AA results were still supplied to the UI/assistant. | Shared coverage selector; explicit unknown state; client/server and browser tests. |
| P1 | Malformed persisted state failed validation but later writes could still replace it; unknown envelope/state versions were relabeled. | Block writes after hydration failure, including queued writes; reject unsupported versions and foreign app identifiers. Preserve original data. |
| P1 | Duplicate semester/planned-course IDs in JSON made drag/drop/removal ambiguous. | Validate unique stable IDs in current and scenario plans; reject duplicate terms and duplicate completed-course records. Failed imports leave the current plan untouched. |
| P2 | Large requirement searches silently pruned candidates, allowing a definitive false negative. | Propagate bounded-search exhaustion as uncertainty with an adviser-review note; regression with a large credit group. This is still a bounded allocator. |
| P2 | A 3-credit limit with a required 4-credit course, missing prerequisite or cycle produced empty terms and silently omitted work. | Explain unschedulable courses before replacing the plan; preserve the prior plan and keep onboarding editable. |
| P2 | Invalid dates rolled into another month; Feb 29 recurrence rolled to Mar 1; day differences used elapsed milliseconds. | Strict date validation, leap-year recurrence and civil-day arithmetic, tested across DST and midnight. |
| P2 | Assistant answered the suggested unmet-requirements prompt with completed-credit totals, used fall dates for spring questions, and used array order for “next”. | Intent regression tests, term/year handling, separate graduate/licensing answers and chronological sorting. |
| P2 | Body-size check ran after an unbounded read and counted UTF-16 characters rather than bytes. | Streaming UTF-8 byte limit before parsing/provider access; oversize and provider-error tests. No API key disclosure. |
| P2 | Catalog import accepted unsafe URL schemes, duplicate source IDs and unresolved nested policies; new restriction metadata was stripped. | HTTP(S) links, nested provenance/course-reference checks, duplicate guards and preservation of GT/restriction fields. |
| P2 | Later life-stage selection reduced earlier cards to 70% opacity, failing text/link contrast. | Remove opacity reduction; retain readable cards at every selected stage. Six responsive/theme axe cases exercise this state. |
| P2 | Invalid-data recovery offered retry but no accessible route to obtain the original backup. | “Export original backup” downloads untouched storage without unblocking writes; adapter and real-browser tests. |
| P3 | Multiple screens still claimed there was no verified tuition/catalog data. | Updated explanations to distinguish published references, user-selected estimate inputs, illustrative entries and unverified plan conditions. |

## Security and persistence review

The optional assistant remains bound to localhost, checks request origin, strips unrelated profile fields, uses server-only credentials, disables provider storage, and exposes no tools or plan-writing actions. Tests mock the provider: no paid request or private plan was sent during review. Prompt instructions reduce invention risk but cannot guarantee model truthfulness. This endpoint is not ready for public deployment without authentication, rate/concurrency limits and a deployment-specific origin policy.

Production dependency audit: **0 advisories**. Full audit: **5 high advisories** in the existing development lint dependency chain. The suggested forced fix changes the Next ESLint configuration major; it was not applied blindly. Upgrade that toolchain in a separate compatibility-tested change.

Legacy v1 migration, real IndexedDB saves, import rejection, export round-trip, failed-read protection, future versions and backup preservation are tested. Multi-tab edits still have no conflict reconciliation. Unknown imported catalog IDs remain preserved rather than silently removed; the app has no catalog-import activation yet. Large-file/deeply nested user imports and catalogue-version reconciliation warrant dedicated limits and recovery tests before broader data ingestion.

## Usability and accessibility

Production Chromium screenshots and axe WCAG 2 A/AA + 2.1 AA checks cover **all 13 pages at 1440, 768 and 375 pixels, in light and dark themes**. Extra states cover roadmap timeline/dependencies, course drawer, confirmation dialog, and all three Bioastronautics sections with a later life stage selected. Screenshots are in `artifacts/screenshots/`; contact sheets in `artifacts/review/`. These are local generated artifacts, not committed binary baselines.

| Page | Review outcome / next usability improvement |
|---|---|
| Landing | Clear primary action and sample preview. Long phone scroll; bring the interactive planner nearer the first screen. |
| Onboarding | Keyboard-friendly labeled choices; normal completion/reload tested. New generation errors preserve the prior plan. Add focus-to-error and test every intermediate step at phone widths. |
| Overview | Cards reflow correctly. Four pathway cards plus the route rail repeat information and delay the first academic action on phones; condense this section. |
| Roadmap | Keyboard and pointer moves, announcements, undo, summer add, view persistence and alternate views pass. Phone toolbar wraps heavily; group secondary actions. |
| Explorer | Filters, real course drawer and keyboard focus restoration work. Many filters precede results on phones; collapse advanced filters. Unknown GT membership is no longer presented as a negative fact. |
| Compare | Scenario creation/reload and cost controls pass. Wide comparisons use contained scrolling; provide a compact stacked comparison for small screens. |
| Careers | Search/linking/stage persistence pass. Illustrative LPC overview is separate from sourced Colorado Dreams; connect them more directly to avoid two competing career entry points. |
| Colorado Dreams | Source badges and changing stages/people/course/lab sections work. Fixed stage-dependent contrast. This is the densest page; collapse completed/context steps and preserve stage/path/entry-year preferences. |
| Funding | Filters and annual-pattern caveats are readable. Separate recurring patterns from confirmed cycle-specific deadlines more prominently. |
| Costs | Unknowns stay blank; published FRCC rates require an explicit choice. User rates survive reload. Emphasize residency/COF conditions when choosing a rate. |
| Profile | Editable fields are labeled, saved and preserved. Unsupported programs now produce an honest requirement-coverage message. A reviewed program selector would be easier than free text. |
| Settings | Import/export/reset and confirmation focus work; destructive actions require explicit confirmation. Add an import preview with warnings about unknown catalog IDs before replacement. |
| Print | Readable single-column summary at all widths. Clarified mixed provenance. Print-media/PDF pagination and assistive-technology reading order still need separate manual review. |

No tested page has document-level horizontal overflow at 375px. Dialog Escape/focus return and cancellation-first confirmation behavior are tested. Axe and screenshots are not full accessibility certification: manual VoiceOver/NVDA, zoom/text spacing, touch-target measurement, print media, and every empty/error/intermediate state remain follow-up work. The six page matrices do not claim exhaustive testing of all possible user plans.

## Next steps, in order

1. **Finish FRCC audit coverage before another campus.** Review the approved elective list, surplus-credit allocation, GPA/residency, repeat/grade policy, and official prerequisite data. Pin catalog editions rather than relying only on `/current/`. Add a visible catalog-change review when existing plans recalculate against new data. Keep incomplete or restricted cases uncertain.
2. **Add a source-health command.** Proposed `npm run sources:check -- --as-of YYYY-MM-DD --json`: read the central registry offline; flag missing/invalid/future verification dates, nonverified active dependencies, duplicate/unused IDs and academic-year mismatches. Apply configurable review windows (e.g. 30 days for aid/deadlines/licensing, 90 days for general catalog/faculty snapshots). These windows are maintenance policy, not academic facts. Output source ID, reason, age, affected records and official URL; exit nonzero for overdue active sources. Test exact expiry boundaries, leap years, future dates and nullable catalog years for noncatalog sources. A later, explicitly authorized link checker may record redirects/status/content hashes; it must never mark a claim verified just because HTTP 200 or a hash matches. Require human comparison, including row-level GT diffs, before changing academic facts.
3. **Add campuses in a focused sequence, as a product recommendation.** Start with **CSU Fort Collins** ([official transfer admissions](https://admissions.colostate.edu/apply/transfer/), [FRCC-specific support](https://admissions.colostate.edu/contact-us/find-your-counselor/transfer/)), then **CU Denver** ([transfer credit guidance](https://ucdenver.edu/admissions/how-to-transfer-credits-to-cu-denver)). Both connect naturally to existing Colorado counseling discovery. Consider **UNC Greeley** next for the counseling pathway already represented in CACREP. Add **Mines** only after the STEM/AS model is supported; its [transfer page](https://undergraduate-admissions.mines.edu/transfer-students/) links CCCS preapprovals that need separate course-level review. For each campus: one program/catalog year, explicit equivalencies, provenance, tuition conditions and acceptance fixtures before activation. No new university records are added in this PR.
4. **Add three useful careers with separate credential models.** School counselor ([current CDE special-services source](https://www.cde.state.co.us/node/67788)) should be distinct from LPC. Aerospace engineer ([BLS occupational source](https://www.bls.gov/ooh/architecture-and-engineering/aerospace-engineers.htm)) offers a broader STEM destination than astronaut selection. Software developer can connect to a reviewed CS transfer path. Research credential/degree requirements and jurisdiction first; keep employment projections separate from eligibility and salaries out until year/location provenance is loaded. These are research priorities, not newly verified career requirements.
5. **Complete manual accessibility and recovery QA.** Screen-reader workflows, every onboarding step, 200%/400% zoom, invalid import preview, storage-quota failures, multi-tab conflicts, unsupported course recovery and print/PDF pagination. Keep the existing screenshot/axe matrix in CI, with production-server isolation.

## Validation

Baseline before edits: `npm install`, **105 tests passing**, production build passing. Final results:

- `npm test`: **132 tests pass** across 20 files.
- `python3 -m unittest discover -s scripts -p '*_test.py'`: **5 tests pass** for the offline audit comparator.
- `npx eslint src`: **passes**.
- `npx next build`: **passes** (18 generated entries).
- `npm run test:e2e`: **18 tests pass**, including all six responsive/theme matrices; **120 screenshots**, no axe violations in tested states, no document overflow at 375px.

The [screenshot manifest](review/screenshot-manifest.json) lists the page captures. Local logs: `/tmp/dream-helper-review-build.log` and `/tmp/dream-helper-review-e2e.log`. The course audit is deterministic against the saved official document; external facts can change after the review date. No live AI call, campus expansion or deployment was performed.
