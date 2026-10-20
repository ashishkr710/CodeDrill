# CodeDrill — Autonomous Agent Development & Operating Rules

**Version:** 1.0.0  
**Status:** Invariant (Must be strictly followed throughout Phases 1+)  
**Enforcement:** Mandatory for all AI Agent turns  

---

## 1. Core Operating Principles

As an agent implementing CodeDrill, you must follow these non-negotiable operating rules:

### Rule 1: Read Relevant Docs Before Touching Code
Before starting work on any task from `docs/DEVELOPMENT_PLAN.md`:
- Re-read the corresponding section in `docs/ARCHITECTURE.md`, `docs/API_SPEC.md`, `docs/DATA_MODEL.md`, `docs/BACKEND_SPEC.md`, or `docs/FRONTEND_SPEC.md`.
- Never guess schemas, route paths, payload structures, or color tokens. Follow the documented contracts exactly.

### Rule 2: Work One Task at a Time
- Tackle exactly one checkbox task at a time in the order specified in `docs/DEVELOPMENT_PLAN.md`.
- Do not jump ahead or write code for future milestones.
- Keep scope tight and verify before moving to the next task.

### Rule 3: Update Checkboxes Upon Completion
- Immediately after completing and validating a task, update the corresponding checkbox in `docs/DEVELOPMENT_PLAN.md` from `[ ]` to `[x]`.
- Provide a concise summary of:
  1. What was built or modified.
  2. How it was verified (tests executed, linting checks).
  3. What task is next.

### Rule 4: Write Tests with Every Feature
- Never commit a service, utility, or endpoint without accompanying tests.
- Backend services require unit tests (Vitest).
- Backend routes require integration tests (Supertest + `mongodb-memory-server`).
- Complex frontend components require testing with React Testing Library.
- Run tests and ensure 100% pass rate before concluding a turn.

### Rule 5: Strict API Contract Synchronization
- **Never** change an API endpoint route, query parameter, request body, or response structure without updating both `docs/openapi.yaml` and `docs/API_SPEC.md` first.
- Re-run `npm run generate:api` in the frontend if backend API schemas change to preserve type synchronization.

### Rule 6: TypeScript Strictness
- `any` is strictly prohibited. If a type cannot be inferred, declare a strict interface or use `unknown` with a Zod type guard.
- Every function must have explicit parameter types and return types where not immediately inferred.

### Rule 7: Zero Inline Styles & Visual Excellence
- The frontend must strictly utilize Tailwind CSS v4 utility classes and shadcn/ui design tokens.
- Maintain consistent dark/light mode CSS variable mapping.
- Never write raw inline CSS (`style={{ ... }}`).

### Rule 8: Ambiguity Protocol
- If a requirement is underspecified, contradictory, or introduces significant architectural trade-offs, **STOP and ask the user for clarification** instead of making assumptions.
