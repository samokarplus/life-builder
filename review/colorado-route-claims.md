# Colorado route audit — 2026-10-16

Read-only review of individual official pages, not a crawler. The table covers the new route, metadata and access claims. “Confirmed” means the named official page says this, not that an individual qualifies. Estimates and editorial suggestions are not verified requirements. Prior datasets retain the separate audit in REVIEW.md and review/sources-audit.json.

## Terms checked before the factual pages

| Site | Notice read | Disposition |
| --- | --- | --- |
| Colorado DORA / CDPHE | [General notices](https://www.colorado.gov/general-notices), [legal notices](https://www.colorado.gov/legal-notices) | Read live in browser after web-reader 403. Privacy and DMCA notices; individual public pages only. |
| CDE | [Website disclaimer](https://ed.cde.state.co.us/cde-web-site-disclaimer) | Accuracy/external-link disclaimers; no bulk collection. |
| FRCC / FRCC blog | [Disclaimers and legal notices](https://www.frontrange.edu/disclaimers-legal-notices/index.html) | Campus/program conditions can change. Paraphrased facts and attributed historical accounts; no image reuse. |
| CU Denver / Anschutz | [Disclaimer and terms](https://www.cudenver.edu/index.php/legal) | Personal reading; no copied page material, logos, research datasets or commercial-use permission inferred. Formal policy PDF timed out. |
| CU Boulder | [Legal and trademarks](https://www.colorado.edu/about/legal-trademarks) | Public-service accuracy disclaimer. No logos/images reused. |
| NASA | [Media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) | Attribution and no endorsement; no NASA insignia reused. |
| CCCS | [Website usage disclaimer/privacy](https://cccs.edu/privacy-policy/) | Information can change. Linking guidance says sites should notify the webmaster; no message sent without authorization. No bulk download. |

## Claim / original value / official page / disposition

Source IDs below resolve to exact URLs and dates in `src/data/sources.ts`. Wording in this table is deliberately abbreviated; the application data remains the precise, sourced record.

| Claim | Original value | Official page says | Status / fix |
| --- | --- | --- | --- |
| RN initial application | Two parts, cited FAQ | Nursing Applications: exam approval first; license application after passing or successful score transfer | Confirmed; corrected primary citation to `src-dora-nursing-apps`, retaining FAQ for exam details. |
| RN practice before license | Not allowed; students only clinical practice | Nursing FAQ Application tab agrees | Confirmed `src-dora-nursing-faq`. |
| RN clinical education | Supervised clinical concurrent with theory | FAQ Education tab distinguishes traditional from nontraditional programs | Confirmed. |
| NCLEX attempts | 3 within 3 years; 45 days; fourth by petition | FAQ Exam tab agrees, three years measured from first attempt | Confirmed. |
| NCLEX locations | Greenwood Village, Colorado Springs, Westminster | FAQ Exam tab names those three centers | Confirmed as the page’s list; not an exhaustive future guarantee. |
| CNA examination | NNAAP, outside testing company | Applications identifies Credentia and NNAAP | Confirmed. |
| CNA training records | Certificate; programs retain 2 years | FAQ Education tab agrees | Confirmed; added that citation where Applications alone was cited. |
| RN prerequisites/application order | Apply, advisor, prerequisites, transfer evaluation, HESI, nursing application | Larimer ADN page lists all six | Confirmed, explicitly campus-scoped. |
| RN ranking | Top 40 fall/spring, potentially fewer placements | Larimer and Westminster ADN pages agree | Confirmed for those two campuses, not a college-wide admission promise. |
| RN opening | Fall 2027 not yet announced | Both admissions pages say announcement forthcoming | Confirmed as of check date; no invented deadline. |
| HESI A-2 | Reading, math, biology, anatomy/physiology, critical thinking | Both campuses list five; 80% average, twice/365 days, reports/15 months | Confirmed. Extra thresholds not turned into engine eligibility checks. |
| RN post-admission | Immunizations, AHA BLS, drug/background screening | Both campus admissions pages agree | Confirmed. |
| Campus differences | No explicit distinction | Nursing overview lists AAS at Larimer and Westminster, not Boulder County | Fixed: overview and Westminster citations added. Westminster in-progress external transcripts have extra instructions; notification says 30 business days vs Larimer’s 30 days. Separate applications required. |
| ADN duration | About two years | Prior route gave no official duration | Kept as estimate; no guaranteed completion time. |
| Electrician documentation | Supervising contractor affidavit | Electrical Applications / Licensure Requirements tab agrees | Confirmed `src-dora-electrical`. |
| Residential wireman | 4,000 residential hours / at least 2 years | DORA agrees | Confirmed; optional, not a compulsory stage before journeyman. |
| Journeyman | 8,000 / at least 4 years; 2,000 commercial/industrial; 288 classroom | DORA agrees, all applicants/no grandfathering | Confirmed. |
| Master alternatives | 10,000 / 5 years OR EE degree + 2,000/1 OR trade/community college + 8,000/4 OR JW + 2,000/1 | DORA lists these alternatives; planning/layout and supervision conditions; no double credit for supervision alongside supervisees | Confirmed. App retains overview, directs to full rules; durations clarified as overlapping/alternative milestones. |
| Experience-only master shortcut | Cannot skip from apprentice/residential | DORA expressly prohibits it when qualifying by experience | Confirmed challenge. |
| Electrical endorsement | Active state license, examination on current Colorado NEC | DORA agrees; verification by issuing board | Confirmed, not automatic. |
| Electrical reciprocity | AK AR ID IA MN MT NE NH NM ND OK SD UT WY; state exam; held one year | DORA lists all 14, current/good standing, qualifying journeyman/master certificate and fee; no grandfathered certificates | Confirmed overview; full conditions remain linked. |
| Apprentice duration | “right away”, official | DORA offers registration, no promised processing time | Fixed to estimate: processing varies. |
| Teacher initial license | Accredited bachelor+, preparation verification, content knowledge | CDE teacher requirements agree | Confirmed `src-cde-teacher`. |
| Teacher content proof | Praxis or approved multiple measures | CDE lists these, endorsement-specific | Confirmed overview; not every endorsement is interchangeable. |
| Teacher professional advancement | Induction certificate | CDE agrees; expired holders may have extra endorsement requirements | Confirmed overview. No guaranteed processing duration. |
| Alternative teacher | 1/2 years; district-specific, degree, content, job, approved program | CDE agrees | Confirmed. |
| Teacher of Record | Colorado BA preparation with ≤36 hours left | CDE also requires content proof, joint TOR plan and teaching position | Added omitted TOR plan, content and teaching-position conditions to the summary; not an eligibility finding. |
| Physician minimums | Medical graduation, national exams, postgraduate education | Medical Board Initial tab agrees | Confirmed `src-dora-medical`. |
| Physician exams | USMLE, COMLEX | Examination Verification tab names these plus historical examinations | Confirmed as examples, not exhaustive. |
| Physician reciprocity / processing | No automatic reciprocity; most 60 days; 800–1,000/year | Board page still says all three | Confirmed as page wording, not a promised processing time or current annual statistic. |
| CU MD degree | Accredited bachelor, exception some PharmD holders | Requirements page agrees | Confirmed `src-cu-som-req`. |
| CU MD competency fields | Life/social sciences, physics, mathematics | Requirements page agrees; competency-based rather than a fabricated course checklist | Confirmed. |
| MCAT threshold / age / multiple tests | 507 secondary; ≤3 years; best single-date total | Requirements page states these | Confirmed; secondary invitation is not admission. |
| CU MD letters | 3–5 or committee summary | Requirements page agrees | Confirmed; added requirements citation to application step. |
| CU MD timing | May primary, early July secondary, Sep–Mar interview, Oct 15 primary/offers, Nov 30 secondary | Timeline 2026–27 / Class 2031 agrees | Confirmed fixed cycle. Requirements page generally says early June vs timeline’s May: use cycle-specific page; confirm with admissions. |
| AMCAS status | Static “passed” string | Oct 15, 2026 is a fixed cycle deadline | Fixed to civil-day calculation before/on/after deadline; never rolls into a new cycle. |
| EMS initial route | Full course, NREMT, OATH, CBI/FBI fingerprints ±60 days | Live CDPHE certification page agrees | Confirmed `src-cdphe-ems`. |
| EMS examination wording | Written and psychomotor | CDPHE still says both on its page | Confirmed as page wording only. Level-specific NREMT changes need confirmation; no unsupported paramedic credential equivalence. |
| EMS cards | CPR/BLS; ACLS paramedic/intermediate | Initial page says paramedic only; reciprocity page also says intermediate | Conflict surfaced explicitly; added `src-cdphe-ems-reciprocity`. |
| EMS expiry / renewal | 3 years; renew in 6 months before expiry | Certification page agrees | Confirmed. |
| EMS interstate | No reciprocity | Reciprocity page explicitly agrees; other-state credential alone does not authorize practice | Confirmed with its own source. |
| EMS advanced options | Paramedic, critical/community paramedic | CDPHE navigation/links list these | Confirmed as options; no fabricated requirements for the advanced routes. |
| NASA competition | 10 selected / more than 8,000 | Sept 22, 2025 release agrees | Confirmed `src-nasa-2025-class`. |
| NASA Overcash | CU aerospace BS/bioastro MS; Navy/test pilot; 1,300 hours/20 aircraft; rugby program | Release biography agrees | Confirmed as NASA’s 2025 account, not an endorsement of a guaranteed pathway. |
| NASA Menon | TCU math/Spanish, Duke biomedical MS, mission control, Polaris Dawn 2024 | Release biography agrees | Confirmed; removed unsupported “not a pilot” inference. |
| NASA Muller | Behavioral neuroscience BA, medical degree, Navy/undersea, Johns Hopkins anesthesia residency | Release biography agrees | Confirmed as at selection. |
| NASA Kubo | Purdue electrical BS/ECE MS, NASA co-op, 12 years SpaceX including launch director | Release biography agrees | Confirmed as NASA’s account. |
| CU Lindgren | MD 2002; ISS 44/45, Crew-4 | CU astronaut-affiliations table agrees | Confirmed `src-cu-aero-astronauts`. |
| CU Ivins | Aero BS 1973; STS32/46/62/81/98 | CU table agrees | Confirmed. |
| CU Gillis | Aerospace 2017; Polaris Dawn | CU table agrees | Confirmed. |
| NASA basic minimums | Citizen, STEM master/alternatives, 3 years OR 1,000 PIC/850 jets, physical | Live NASA page agrees, but alternatives/residency still contain June 2025 conditions | Current page retains stale cycle wording; warning preserved. No inferred next application date. |
| NASA wait / historical competition | As needed, recent ~4 years; March 2–31, 2020 / 12,000+ | NASA page agrees | Confirmed historical wording; no recurring scheduled selection. |
| NASA total “earliest realistic decade” | Implied minimum summed stages | Not an official earliest date; alternatives/overlap exist | Removed. Bachelor “2 more years” changed official → estimate on all routes. |
| CU Denver counseling duration | 63 credits; recommended 3–4 years | Live counseling page agrees | Confirmed `src-cud-cmhc`, source linked from ideal stage. |
| CU Denver counseling interview | Required half-day group in Denver; no alternate/individual | Program page agrees; Spring27 Oct23,2026 / Fall27 Mar12,2027 | Confirmed as published cycle dates, not annual recurrences. |
| FRCC Joel Bitler | CNA after HS; LPN2002; ADN; later BSN; manages 5 nursing/3 assisted-living | December 2020 story says these (ADN2007); employment is historical | Confirmed historical account. Changed “now” to publication date; his LPN quote is personal experience, not a legal ban. |
| FRCC Alyssa Andrade | First-generation, Aug2021 start, hospice, AA health sciences, flight-nurse goal, learning FAFSA | May12,2026 commencement speech agrees | Confirmed as her own account; goal not claimed outcome. |
| FRCC Tom Guida | Architecture/tuition, AmeriCorps, Colorado, ~3,000 covered, mock-interview job offer, future paramedic | Sept6,2023 account agrees | Confirmed historical account; changed employment/goal tense and removed current-funding implication. |
| Concurrent enrollment | Public grades9–12, district/charter+COF tuition, campus variation, three contacts | FRCC page agrees | Confirmed `src-frcc-hs`; books/fees may remain. |
| ASCENT | Listed with current high-school options | FRCC says repealed after2025–26 and sunset June30,2026 | Fixed everywhere it was advertised; current options exclude it, historical notice retained. |
| High School/Campus Select / PTECH / TREP | Listed options | FRCC page lists them; campus/underage/program conditions apply | Confirmed options, not universal eligibility. |
| WUE amount | 275.60 vs754.25, 2026–27 percredit tuition only | Tuition table confirms regular WUE/nonresident; online460.30, WUE nursing368.25 differ | Confirmed; added tuition-table citation and scope warning. |
| WUE rule / residency | 50% above in-state, maintain outside residency | WUE page agrees | Confirmed `src-frcc-wue`; do not calculate unlisted program prices from the rule. |
| WUE application | Within30 days after earliest class; repeat eachsemester; parent docs under23 | WUE page agrees | Confirmed. Participating-state list remains intentionally unloaded. |
| Bridge eligibility | AA/AS, GPA2, optin application/firstsemester | FRCC and CCCS agree for new first-time students | Confirmed; clarified first-time, advisor program check and selective-major limits. |
| Bridge 12 Colorado partners +WGU | Names from FRCC image labels | CCCS live University Partners panel has destination URLs for all13 | Corroborated through URL targets independently of image labels (`src-cccs-b2b`). |
| Bridge HBCU partners | Texas Southern and Saint Augustine’s | Current CCCS text names Texas Southern and Coppin State; FRCC still has Saint Augustine’s logo | Fixed current text; discrepancy explicitly flagged, Saint Augustine’s not a confirmed current destination. |
| General admission | “Anyone” | FRCC homepage says over17 automatic; high-school page has under17 process; nursing selective | Qualified copy and added homepage citation. |
| Statewide transfer | Junior / ≤60 remaining | FRCC says applicable agreement, same major, participating institution | Qualified; never a blanket guarantee for every associate/major. |
| Specific transfer agreements | ASL/UNC, architecture+recording/CU, health/hospitality/nutrition/CSU, integratedhealth/MSU, pharmacy/Regis | FRCC guide lists these | Confirmed as page overview; “University of Colorado” campus unspecified on that page, not inferred. |
| Mixed interstate license card | Four professions, cited electrical alone | Different DORA/CDPHE authorities | Fixed with additional source IDs visibly linked. |
| Every two-year bachelor “official” duration | Credits converted to years | Credits do not guarantee time | Fixed to estimate; discriminated type requires sourceId for actual official durations. |

## Limits requiring confirmation

- CDPHE’s current generic written/psychomotor wording may lag level-specific NREMT changes. Retained the state page’s account; ask the program/agency about the intended level.
- Saint Augustine’s active Bridge participation is not corroborated by the current system page. No promise of admission there.
- Current Care Forward eligibility/available appropriation is not established by a 2023 alumni story. UI now presents a historical story only.
- NASA’s June2025 alternatives are cycle-specific; no future eligibility date or selection opening inferred.
- CU MD timeline and requirements pages disagree about generic primary opening (May vs June); exact cycle deadline is explicit, next cycle remains unloaded.
- The six new campus datasets, three CU bachelor audits, Bioastronautics MS degree audit and eleven additional careers are expansion work, not verified by this Part1 ledger.

## Electives merge follow-up

The official2026–27 Approved Elective List was read as one public catalog page after the FRCC legal-notice review (catalog index exposes no separate terms link). The transcribed named entries and starting numbers match its category rows, including HLT2008 exclusion and the upper-level/specialized exclusions. The list cannot establish existence, title, credit value or eligibility of an illustrative course whose number happens to fit a range. Found and fixed that adapter bug: only verified catalog records enter the official AA elective rule. Its provenance now points to the elective-list source. The current verified non-GT elective candidate is COM1150; no unresearched range courses, specialized courses or PED/OUT/DAN cap assumptions are added.
