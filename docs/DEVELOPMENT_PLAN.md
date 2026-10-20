# CodeDrill — Master Development & Implementation Plan

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect  

---

## Roadmap Overview

The implementation roadmap is broken into **10 sequential milestones (M1 to M10)**. Each task contains clear dependencies, acceptance criteria, estimated effort, and an interactive checkbox.

```
M1: Repo Setup & CI ──► M2: Auth & Profiles ──► M3: Content & Admin ──► M4: Learn Mode
                                                                           │
                                                                           ▼
M8: Revision & Notes ◄── M7: Progress Engine ◄── M6: Code Sandbox ◄── M5: Practice (MCQ/Output)
        │
        ▼
M9: Daily & Mock ──────► M10: Security, Polish & Deploy
```

---

## Milestone 1: Workspace Setup, Tooling & Docker Foundation
*Objective:* Scaffold independent repositories/folders, establish strict TypeScript, ESLint, Prettier, Git hooks, and Docker Compose orchestration.

- [x] **Task 1.1: Backend Project Scaffolding**
  - **Dependencies:** None
  - **Estimate:** 2h
  - **Acceptance Criteria:** `codedrill-backend/` configured with `package.json`, `tsconfig.json` (strict: true), `src/` directory layout, and `.env.example`.
- [x] **Task 1.2: Frontend Project Scaffolding**
  - **Dependencies:** None
  - **Estimate:** 2h
  - **Acceptance Criteria:** `codedrill-frontend/` initialized with Vite 6, React 19, TypeScript strict mode, Tailwind CSS v4, and shadcn/ui foundation.
- [x] **Task 1.3: Tooling, Linters & Git Hooks**
  - **Dependencies:** Task 1.1, Task 1.2
  - **Estimate:** 1.5h
  - **Acceptance Criteria:** Husky pre-commit hooks running ESLint and Prettier on staged files across both packages.
- [x] **Task 1.4: Multi-Container Docker Compose**
  - **Dependencies:** Task 1.1, Task 1.2
  - **Estimate:** 3h
  - **Acceptance Criteria:** `docker-compose.yml` spins up MongoDB 7, Judge0 CE (with Redis & Postgres), backend, and frontend locally with 1 command.
- [x] **Task 1.5: OpenAPI Client Generation Pipeline**
  - **Dependencies:** Task 1.2, `docs/openapi.yaml`
  - **Estimate:** 1.5h
  - **Acceptance Criteria:** Script `npm run generate:api` in frontend parses `docs/openapi.yaml` and outputs strongly typed TypeScript interfaces.

---

## Milestone 2: Authentication, Authorization & User Profile
*Objective:* Implement dual-token JWT authentication (access in memory, refresh in HttpOnly cookie), Argon2 hashing, rate limiting, and profile management.

- [x] **Task 2.1: User & RefreshToken Models**
  - **Dependencies:** Task 1.1
  - **Estimate:** 2h
  - **Acceptance Criteria:** Mongoose models with Argon2 password hashing hooks and TTL index on refresh token expiration.
- [x] **Task 2.2: Auth Service & Token Rotation Logic**
  - **Dependencies:** Task 2.1
  - **Estimate:** 3h
  - **Acceptance Criteria:** 15m Access Token, 7d Refresh Token, token rotation on refresh, and replay detection revoking token family.
- [ ] **Task 2.3: Auth Routes, Controllers & Zod Schemas**
  - **Dependencies:** Task 2.2
  - **Estimate:** 2.5h
  - **Acceptance Criteria:** Endpoints `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` with full Zod validation and integration tests.
- [ ] **Task 2.4: Frontend Auth State & Interceptors**
  - **Dependencies:** Task 2.3, Task 1.5
  - **Estimate:** 3h
  - **Acceptance Criteria:** Zustand `authStore`, silent token refresh handler on 401, protected route guard component.
- [ ] **Task 2.5: Auth UI Pages**
  - **Dependencies:** Task 2.4
  - **Estimate:** 3h
  - **Acceptance Criteria:** Accessible Login and Registration pages with React Hook Form, Zod client validation, and toast feedback.

---

## Milestone 3: Content Models, Admin CRUD & Seed Data
*Objective:* Build curriculum data layer (tracks, topics, questions), admin management API, and database seeder.

- [ ] **Task 3.1: Content Models (Track, Topic, Question)**
  - **Dependencies:** Task 1.1
  - **Estimate:** 3.5h
  - **Acceptance Criteria:** Mongoose schemas supporting 5 question types with compound indexes and validation.
- [ ] **Task 3.2: Admin Question CRUD & Bulk Import Service**
  - **Dependencies:** Task 3.1, Task 2.3
  - **Estimate:** 4h
  - **Acceptance Criteria:** Admin endpoints for creating, updating, and bulk importing questions via JSON/CSV with dry-run verification.
- [ ] **Task 3.3: Database Seeder Script (30 Collections + 30 DSA)**
  - **Dependencies:** Task 3.1
  - **Estimate:** 4h
  - **Acceptance Criteria:** Executing `npm run seed` populates all tracks, topics, and at least 60 comprehensive questions covering all 5 modalities.
- [ ] **Task 3.4: Admin Portal Frontend**
  - **Dependencies:** Task 3.2, Task 2.5
  - **Estimate:** 4h
  - **Acceptance Criteria:** Admin dashboard with question list, JSON upload dropzone with syntax validation, and preview table.

---

## Milestone 4: Learn Mode & Curriculum Browser
*Objective:* Implement the study guide system with markdown notes, visual diagrams, and complexity cheat sheets.

- [ ] **Task 4.1: Curriculum Backend API**
  - **Dependencies:** Task 3.1
  - **Estimate:** 2h
  - **Acceptance Criteria:** `GET /tracks` and `GET /topics/:slug` returning topics, markdown study notes, and complexity tables.
- [ ] **Task 4.2: Frontend Markdown Study Notes Renderer**
  - **Dependencies:** Task 4.1, Task 1.2
  - **Estimate:** 3h
  - **Acceptance Criteria:** React Markdown component supporting syntax-highlighted code blocks, copy-to-clipboard buttons, and responsive tables.
- [ ] **Task 4.3: Interactive Complexity Cheat Sheets**
  - **Dependencies:** Task 4.1
  - **Estimate:** 2.5h
  - **Acceptance Criteria:** Filterable and sortable big-O cheat sheet table for Collections operations (`get`, `put`, `remove`, `contains`).
- [ ] **Task 4.4: Learn Mode Track & Topic Browser Pages**
  - **Dependencies:** Task 4.2, Task 4.3
  - **Estimate:** 3h
  - **Acceptance Criteria:** Responsive Track selection cards and Topic drawer with reading time estimation and "Start Practice" CTA.

---

## Milestone 5: Rapid-Fire Practice Engine (MCQ, Output, Fill-in, Interview)
*Objective:* Build client and server engines for non-coding active recall question types.

- [ ] **Task 5.1: Non-Coding Grading Service**
  - **Dependencies:** Task 3.1
  - **Estimate:** 3h
  - **Acceptance Criteria:** Pure grading functions for single/multi MCQ, normalized output comparison, and fill-in-the-blank slot matching.
- [ ] **Task 5.2: Submission API & User Progress Updates**
  - **Dependencies:** Task 5.1, Task 2.3
  - **Estimate:** 3h
  - **Acceptance Criteria:** `POST /practice/submissions` records attempt in `submissions`, updates `user_progress` atomic counters, and returns detailed explanation.
- [ ] **Task 5.3: MCQ & Output Prediction Components**
  - **Dependencies:** Task 5.2
  - **Estimate:** 3.5h
  - **Acceptance Criteria:** Accessible `McqCard` and `OutputCard` components with immediate visual feedback and explanation drawer.
- [ ] **Task 5.4: Fill-in-the-Blank & Interview Short-Answer Components**
  - **Dependencies:** Task 5.2
  - **Estimate:** 3.5h
  - **Acceptance Criteria:** `FillBlankCard` with inline input slots and `InterviewCard` with self-evaluation rubric toggle.
- [ ] **Task 5.5: Practice Question Filter & List View**
  - **Dependencies:** Task 5.3, Task 5.4
  - **Estimate:** 3h
  - **Acceptance Criteria:** Filter questions by track, topic, difficulty, type, company, and solved status with smooth pagination.

---

## Milestone 6: Sandboxed Code Execution & Monaco Coding Workspace
*Objective:* Build the containerized execution runner, Monaco IDE interface, and test suite evaluation engine.

- [ ] **Task 6.1: Sandbox Adapter Implementation (Judge0 & Mock)**
  - **Dependencies:** Task 1.4
  - **Estimate:** 4h
  - **Acceptance Criteria:** `IExecutionAdapter` implementation connecting to Judge0 CE, handling batch execution, timeouts, and compiling outputs.
- [ ] **Task 6.2: Java Test Harness & Security Static Shield**
  - **Dependencies:** Task 6.1
  - **Estimate:** 4h
  - **Acceptance Criteria:** Driver generator injecting user `class Solution` into test harness; regex/AST static shield rejecting disallowed classes.
- [ ] **Task 6.3: Code Run & Code Submit API Endpoints**
  - **Dependencies:** Task 6.2
  - **Estimate:** 3h
  - **Acceptance Criteria:** `/practice/code/run` (sample test cases) and `/practice/code/submit` (hidden test cases + grading) with rate limiting.
- [ ] **Task 6.4: Monaco Editor Integration & Theme Store**
  - **Dependencies:** Task 1.2
  - **Estimate:** 4h
  - **Acceptance Criteria:** Monaco editor configured for Java 21, auto-indent, code formatting, dark/light themes, and debounced localStorage draft saving.
- [ ] **Task 6.5: Interactive Test Console & Split Pane**
  - **Dependencies:** Task 6.4, Task 6.3
  - **Estimate:** 4h
  - **Acceptance Criteria:** Resizable split-pane layout with Test Case tabs, execution timer, memory meter, and compile error viewer.

---

## Milestone 7: Progress Analytics, Dashboard & Weak-Topic Detection
*Objective:* Build mastery scoring, streak calculations, and visual performance dashboards.

- [ ] **Task 7.1: Progress Aggregation Service**
  - **Dependencies:** Task 5.2, Task 6.3
  - **Estimate:** 3.5h
  - **Acceptance Criteria:** Implements Mastery Score formula, accuracy weighting, streak calendar rollover, and weak topic flaggers.
- [ ] **Task 7.2: Progress Summary & Weak Topics API**
  - **Dependencies:** Task 7.1
  - **Estimate:** 2h
  - **Acceptance Criteria:** `GET /progress/summary` and `GET /progress/weak-topics` endpoints.
- [ ] **Task 7.3: Dashboard Visualizations (Recharts)**
  - **Dependencies:** Task 7.2
  - **Estimate:** 4h
  - **Acceptance Criteria:** Radar chart for topic mastery, GitHub-style activity streak heatmap, and solved difficulty distribution bar.
- [ ] **Task 7.4: "Needs Focus" Weak Topic Remediation Banner**
  - **Dependencies:** Task 7.3
  - **Estimate:** 2h
  - **Acceptance Criteria:** Dynamic remediation component recommending 5 targeted questions for topics failing accuracy benchmarks.

---

## Milestone 8: Spaced Repetition (SM-2) Queue, Bookmarks & Notes
*Objective:* Implement the retention engine and personal question annotation tools.

- [ ] **Task 8.1: SM-2 Algorithm Service & Due Scheduler**
  - **Dependencies:** Task 5.2
  - **Estimate:** 3h
  - **Acceptance Criteria:** SM-2 calculation engine adjusting interval and Ease Factor based on quality rating (0–5).
- [ ] **Task 8.2: Revision Queue API Endpoints**
  - **Dependencies:** Task 8.1
  - **Estimate:** 2h
  - **Acceptance Criteria:** `GET /revision/queue` and `POST /revision/:id/review` endpoints.
- [ ] **Task 8.3: Bookmarks & Markdown Notes API**
  - **Dependencies:** Task 3.1
  - **Estimate:** 2h
  - **Acceptance Criteria:** Full CRUD for user bookmarks and private markdown notes.
- [ ] **Task 8.4: Spaced Repetition Review Page & Flashcard UI**
  - **Dependencies:** Task 8.2
  - **Estimate:** 3.5h
  - **Acceptance Criteria:** Anki-style review flashcard with keyboard shortcuts (Space to reveal, 0–5 to score) and confetti on completion.
- [ ] **Task 8.5: Bookmarks & Notes Manager Page**
  - **Dependencies:** Task 8.3
  - **Estimate:** 2.5h
  - **Acceptance Criteria:** Searchable list of saved questions with inline markdown note editor.

---

## Milestone 9: Daily Challenge & Timed Mock Interview Simulator
*Objective:* Implement daily engagement loops and timed interview screens.

- [ ] **Task 9.1: Daily Challenge Scheduler & API**
  - **Dependencies:** Task 3.3, Task 7.1
  - **Estimate:** 2.5h
  - **Acceptance Criteria:** Global daily problem rotation with streak preservation and bonus score multiplier.
- [ ] **Task 9.2: Timed Mock Interview Engine**
  - **Dependencies:** Task 6.3, Task 5.2
  - **Estimate:** 4h
  - **Acceptance Criteria:** Mock session creator picking randomized question baskets (1 Coding + 2 Output + 2 MCQ) with server-enforced countdown timer.
- [ ] **Task 9.3: Mock Interview Mode Frontend**
  - **Dependencies:** Task 9.2
  - **Estimate:** 4h
  - **Acceptance Criteria:** Fullscreen distraction-free interview simulator with persistent timer bar, problem switcher, and performance report card.

---

## Milestone 10: Performance Optimization, Security Audit & Deployment
*Objective:* Polish UX, execute security audits, add E2E tests, and generate production artifacts.

- [ ] **Task 10.1: Security Hardening & Rate Limit Tuning**
  - **Dependencies:** All milestones
  - **Estimate:** 3h
  - **Acceptance Criteria:** Helmet headers, CORS strictness verified, sandbox escape defenses tested, and rate limiting validated.
- [ ] **Task 10.2: Frontend Bundle Optimization & Accessibility Audit**
  - **Dependencies:** All milestones
  - **Estimate:** 3h
  - **Acceptance Criteria:** Code-splitting (`React.lazy`), bundle size under 350KB initial gzip, WCAG AA contrast compliance verified.
- [ ] **Task 10.3: Playwright End-to-End Suite**
  - **Dependencies:** All milestones
  - **Estimate:** 4h
  - **Acceptance Criteria:** 4 critical path E2E browser tests passing green in headless CI.
- [ ] **Task 10.4: Production Dockerfiles & CI/CD Actions**
  - **Dependencies:** All milestones
  - **Estimate:** 3h
  - **Acceptance Criteria:** Multi-stage production Dockerfiles for frontend (Nginx alpine) and backend (Node alpine) + GitHub Actions CI workflow.
