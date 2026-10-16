# Dream Helper — Product & Engineering Spec

Dream Helper — Your future, mapped out. A beautiful, intelligent college & career pathway planner ("Google Maps for your education").

Initial supported pathway: FRCC → CU Boulder. Architected to add institutions and careers later (no nationwide database in v1).

## Principles
1. Beautiful enough that someone wants to use it.
2. Simple enough for a first-year student.
3. Working functionality over decorative complexity.
4. Never invent academic requirements or course data; use a clearly labeled sample dataset.
5. Keep verified facts distinct from projections.
6. Let users freely experiment with alternative plans.
7. Planning is a journey, not a spreadsheet.
8. Design for expansion without overengineering the MVP.

## Design system
- Colors: ivory `#FAF9F6` (bg), white `#FFFFFF` (surface), charcoal `#202820` (text), forest `#285943` (accent), sage `#A9BFA8`, soft green `#EDF3EC`, warm neutral `#EAE6DD`, secondary text `#777C76`, borders `#E5E7E2`.
- Warm, minimal, calm, optimistic. Avoid gradients, bright blues, neon, generic-AI look.
- Inter/Geist UI type, optional editorial serif for hero headings; 12–16px rounded cards; subtle shadows; pill filters; skeletons; empty states; microinteractions.
- Responsive desktop/tablet/mobile; light (default) and dark mode.
- Collapsible sidebar (Overview, My Roadmap, Course Explorer, Compare Paths, Career Explorer, Costs & Savings, My Profile, Settings); top bar (pathway, search, theme toggle, save status, profile menu); mobile hamburger + quick roadmap access. Lucide icons.

## Landing page
Hero "Your future, mapped out." / "From your first college class to your dream career. Build a smarter, more affordable path to where you want to go." CTAs: "Build My Roadmap", "Explore a Demo". Interactive roadmap preview; sections: Start with your dream · Add your completed classes · Explore your roadmap · Compare pathways · Graduate with a plan; interactive planner demo; subtle scroll animation; minimal copy.

## Onboarding (conversational wizard)
1. Dream (free text + cards: Therapist/Counselor, Engineer, Physician, Teacher, Entrepreneur, Software Developer, Still Exploring, "I'm not sure yet")
2. Starting point (institution, program, semester, expected graduation, completed credits) — FRCC
3. Destination (transfer university, major, degree, transfer semester) — CU Boulder
4. Completed courses (search by code/title, grades optional, in-progress, transfer credits, AP/IB as unverified; live credit summary)
5. Priorities (lowest cost, fastest, balanced, mostly online, fewest campus days, career prep; max credits/semester; budget)
6. Generate roadmap from structured data with assumptions identified — never claim AI verified eligibility.

## Dashboard
"Good afternoon. Your future is taking shape." Pathway FRCC → CU Boulder → Graduate School → Career (clickable). Cards: Degree Progress, Next Milestone, Estimated Cost (verified vs illustrative), Academic Timeline, Upcoming Courses, Planning Alerts (missing prereqs, unverified equivalencies, conflicts, unmet requirements, unknown availability) in calm language.

## Interactive semester roadmap (core feature)
Semester cards chronologically (illustrative sample: Fall 2026 HIS 1120, GEY 1108, ENG 1022; Spring 2027 GEY 1111, PHI 1014, ENP 1005, PHI 1030, AIR 2001; Summer 2027 remaining AA courses; Fall 2027 CU Boulder). Sample is illustrative, not verified.
Interactions: drag between semesters (dnd-kit), add/remove/reorder, mark completed/in progress, edit semester, add summer/extra semester, credit totals, cost estimates, undo/redo. Course cards: code, name, credits, institution, requirement category, status, prereq indicator, transfer verification. Recalculate credits, graduation date, requirement completion, prereq conflicts, cost on move. Never silently override; explain conflicts and offer resolution. Views: Timeline, Board (Kanban), Dependency (React Flow).

## Course Explorer
Searchable catalog; filters (institution, subject, credits, requirement, online/in-person when verified, transfer status, prereqs, level); detail drawer (title, description, credits, prereqs, requirements satisfied, transfer equivalencies, cost, source links, last verified); "Add to Roadmap". Structured local dataset; no scraping without checking permitted access.

## Compare Paths
Duplicate plans; side-by-side scenarios (e.g., Philosophy vs Psychology vs Sociology; fastest vs cheapest vs lighter load). Compare graduation date, remaining credits, tuition, semesters, avg workload, summer courses, transfer requirements, unverified assumptions. Charts, saved scenarios, "What changed?" summary — only claims supported by the engine; explain priorities, never declare an objectively best plan.

## Cost & Savings
Compare CC tuition, university tuition, fees, books, optional housing, total remaining cost. Adjustable residency, credits/semester, semesters, tuition assumptions, aid, living expenses. Show savings from transferable FRCC coursework. Every number shows source, academic year, assumptions, verified vs user-entered. Never fabricate tuition. Interactive chart.

## Career Explorer
Education requirements per career, stored separately from degrees. Detailed sample: Licensed Professional Counselor (undergrad → graduate degree → clinical training → supervised experience → licensure) with jurisdiction and official licensing source; not licensing advice. Other careers clearly labeled placeholders.

## Assistant
Conversational panel using stored plan + structured data. Clean provider interface for a future AI API; deterministic answers without API key. Never invent equivalencies/requirements; point to official sources when unknown.

## Requirement engine
Programs define total credits, gen-ed, major, electives, minimum grades, residency, prerequisites, transfer conditions. Supports AND/OR, min-credit thresholds, course groups, alternatives, min grades, institution-specific rules. Statuses: satisfied / unsatisfied / uncertain. Double counting follows institution rules. Completed vs projected coursework kept separate.

## Data model (TypeScript, stable IDs, provenance)
Institution, AcademicProgram, Career, Course, CourseOffering, TransferEquivalency, DegreeRequirement, StudentProfile, CompletedCourse, Semester, PlannedCourse, AcademicPathway, PlanningScenario, TuitionRate, DataSource. Provenance: source URL, institution, catalog year, last verified date, verification status. Importers designed for future official data.

## Tech stack
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide, Motion, dnd-kit, React Flow, Recharts, Zustand, Zod. Local-first, IndexedDB/browser storage, JSON export/import, no login, no payments.

## Quality
Everything functional and persistent across refresh; keyboard accessible; responsive; error boundaries; loading/empty states; form validation; confirmation for destructive actions; toasts; undo. Tests: credit calculations, prerequisite checking, requirement evaluation, scenario comparison, persistence.

## Build order
1. Foundation — project, design system, navigation, landing page, data models, sample FRCC/CU data
2. Core planner — onboarding, dashboard, roadmap, drag-and-drop, editing, persistence
3. Academic intelligence — explorer, prereq checks, requirement tracking, prereq graph
4. Planning tools — compare paths, cost calculator, career view
5. Polish — animation, responsive, accessibility, tests
