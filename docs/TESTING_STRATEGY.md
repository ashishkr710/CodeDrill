# CodeDrill — Comprehensive Testing Strategy & Quality Assurance

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Test Pyramid & Coverage Invariants

CodeDrill maintains high software quality across both frontend and backend through a strict testing pyramid:

```
           / \
          /   \
         / E2E \       Playwright (Critical User Journeys: 10%)
        /───────\
       /  Integ  \     Supertest + MongoMemoryServer / RTL (30%)
      /───────────\
     /    Unit     \   Vitest (SM-2 math, grading, state, utils: 60%)
    /───────────────\
```

### Coverage Targets (Enforced via CI Gates):
- **Backend Services & Core Logic:** $\ge 85\%$ line and branch coverage.
- **Backend API Endpoints (Integration):** $\ge 85\%$ endpoint coverage.
- **Frontend UI Components & Hooks:** $\ge 80\%$ line coverage.
- **Critical Flow E2E Tests:** 100% of P0 flows (Auth, Solve MCQ, Execute Java in Monaco, SM-2 Review).

---

## 2. Backend Testing Strategy (`codedrill-backend`)

### 2.1 Frameworks & Tooling
- **Test Runner:** `vitest` (Fast, native TypeScript ESM execution).
- **HTTP Integration:** `supertest` for exercising Express routes and middleware without opening TCP ports.
- **Database Simulation:** `mongodb-memory-server` spins up an ephemeral, in-memory MongoDB daemon for isolated integration tests.
- **Execution Sandboxing:** Tests utilize `MockExecutionAdapter` to avoid spinning up external Docker containers during unit and integration runs.

### 2.2 Test Categories & Target Matrix

| Layer | Test Type | File Pattern | What is Tested |
| :--- | :--- | :--- | :--- |
| **Domain Logic** | Unit | `src/services/**/*.spec.ts` | SM-2 interval calculations, Ease Factor bounds (min 1.3), streak day rollover, weak-topic threshold logic. |
| **Grading Engine** | Unit | `src/services/grading/*.spec.ts` | MCQ exact matching, fill-in-the-blank normalization, output prediction whitespace trimming. |
| **Static Shield** | Unit | `src/services/execution/shield.spec.ts`| Rejection of forbidden Java packages (`java.net.*`, `ProcessBuilder`, `System.exit()`). |
| **API Endpoints** | Integration | `tests/integration/**/*.test.ts` | Auth token rotation, replay attack revocation, question filtering, bookmark CRUD, validation error responses. |
| **Rate Limiter** | Integration | `tests/integration/rateLimit.test.ts`| 429 response emission when hitting execution caps. |

---

## 3. Frontend Testing Strategy (`codedrill-frontend`)

### 3.1 Frameworks & Tooling
- **Unit & Component Testing:** `vitest` + `@testing-library/react` + `@testing-library/user-event` + `jsdom`.
- **E2E Browser Automation:** `@playwright/test` running against Chromium, Firefox, and WebKit.
- **Mock Service Worker (MSW):** Intercepts API calls during frontend component testing to simulate network responses and errors.

### 3.2 Target Components & Interaction Tests
- **`McqCard.tsx`:** Asserts radio selection, multi-select toggles, submit button disabling when empty, correct/incorrect visual badge states.
- **`FillBlankCard.tsx`:** Asserts input slot typing, enter key trigger, case-insensitive evaluation.
- **`CodingWorkspace.tsx`:** Asserts Monaco editor mounting, theme switching, tab changes (Problem vs Output vs Hints), and Run Code dispatch.
- **`SpacedRepetitionFlashcard.tsx`:** Asserts answer reveal on spacebar press, SM-2 button trigger (0–5 rating).

---

## 4. End-to-End (E2E) Test Plan (Playwright)

### Critical Path E2E Scenarios:
1. **User Onboarding & Auth Journey:**
   - User navigates to `/auth/register` -> enters credentials -> receives JWT -> redirects to `/app/learn`.
   - Page refresh executes silent `/auth/refresh` without throwing user out.
2. **Java Collections Learn & Practice Journey:**
   - User browses to `Java Collections` -> clicks `HashMap Internals` -> reads study notes -> clicks "Practice Topic".
   - Answers MCQ -> receives instant explanation -> checks progress counter increment.
3. **Coding Sandbox Run & Submit Journey:**
   - User opens problem `Two Sum (Java)` -> types solution in Monaco -> clicks "Run Code".
   - Observes test runner loader -> sees sample cases pass -> clicks "Submit Solution" -> receives ACCEPTED banner.
4. **Spaced Repetition Review Journey:**
   - User navigates to `/app/revision` -> reviews due flashcard -> rates recall `4 (Good)` -> card animates out and updates counter.

---

## 5. Test Data Seeding Strategy

A dedicated seed CLI command (`npm run seed` in backend) provisions high-signal sample datasets for local development and CI:
- **Seed Dataset 1 (Curriculum):**
  - All 8 topics for Java Collections with full markdown notes and cheat sheets.
  - All 13 topics for DSA.
- **Seed Dataset 2 (Questions):**
  - At least 30 Java Collections questions covering all 5 modalities.
  - At least 30 DSA questions covering all 5 modalities.
- **Seed Dataset 3 (Demo Accounts):**
  - `user@codedrill.dev` (Standard user with 5-day streak and 12 revision cards).
  - `admin@codedrill.dev` (Admin user with content management permissions).
