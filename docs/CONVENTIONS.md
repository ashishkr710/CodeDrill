# CodeDrill — Engineering Standards & Team Conventions

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Naming Conventions

### 1.1 Files & Directories
- **Source Files (Backend):** `kebab-case` with dot qualifiers for role.
  - Controllers: `auth.controller.ts`, `question.controller.ts`
  - Services: `auth.service.ts`, `practice.service.ts`
  - Routes: `auth.routes.ts`, `practice.routes.ts`
  - Models: `user.model.ts`, `question.model.ts`
  - Schemas: `auth.schema.ts`, `question.schema.ts`
  - Adapters: `judge0.adapter.ts`, `piston.adapter.ts`
- **Source Files (Frontend):**
  - React Components: `PascalCase.tsx` (e.g., `CodingWorkspace.tsx`, `TopicCard.tsx`, `Navbar.tsx`)
  - Hooks: `camelCase.ts` prefixed with `use` (e.g., `useDebounce.ts`, `useKeyboardShortcuts.ts`)
  - Stores: `camelCase.ts` suffixed with `Store` (e.g., `authStore.ts`, `themeStore.ts`)
  - Utilities: `camelCase.ts` (e.g., `cn.ts`, `formatters.ts`)

### 1.2 Identifiers in Code
- **TypeScript Types & Interfaces:** `PascalCase`. No Hungarian notation (e.g., use `User`, `QuestionItem`, not `IUser` unless strictly declaring a Mongoose model interface).
- **Variables & Functions:** `camelCase` (e.g., `calculateMasteryScore`, `fetchDueRevisionItems`).
- **Constants & Enums:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`, `JWT_ACCESS_EXPIRATION`).
- **Database Collections:** `snake_case` plural (e.g., `users`, `refresh_tokens`, `questions`, `user_progress`).

---

## 2. Commit Message Standards (Conventional Commits)

All commits must follow the **Conventional Commits 1.0.0** format:
`<type>(<scope>): <short description>`

### 2.1 Commit Types:
- `feat`: A new user-facing capability or API endpoint.
- `fix`: A bug fix or patch.
- `docs`: Documentation updates only (`/docs` or `README`).
- `style`: Formatting, missing semi-colons, Tailwind sorting (no code logic changes).
- `refactor`: Code reorganization with zero behavior alterations.
- `perf`: Performance optimization (e.g. database indexing, bundle size reduction).
- `test`: Adding or correcting tests.
- `chore`: Build tooling, dependency bumps, Dockerfile updates.

### 2.2 Scopes:
- Backend: `(auth)`, `(practice)`, `(execution)`, `(progress)`, `(revision)`, `(admin)`, `(db)`
- Frontend: `(editor)`, `(learn)`, `(quiz)`, `(dashboard)`, `(auth-ui)`, `(theme)`

### 2.3 Examples:
- `feat(execution): implement Judge0 batch execution adapter for Java 21`
- `fix(auth): invalidate entire refresh token family upon replay attempt`
- `test(revision): add unit tests for SM-2 interval progression when quality < 3`

---

## 3. Branching & PR Checklist

### 3.1 Git Flow Model
- `main`: Production-ready code; protected branch.
- `develop`: Integration staging branch.
- Feature branches: `feat/<epic>-<short-name>` (e.g., `feat/practice-mcq-engine`).
- Fix branches: `fix/<issue-name>` (e.g., `fix/token-rotation-race`).

### 3.2 Pre-PR Quality Checklist
Before requesting review or merging:
- [ ] TypeScript compilation passes with zero errors (`tsc --noEmit`).
- [ ] Linters pass with zero warnings (`npm run lint`).
- [ ] Prettier formatting has been applied (`npm run format`).
- [ ] All unit and integration tests pass (`npm run test`).
- [ ] No `console.log` statements remain (use Pino logger in backend, remove dev logs in frontend).
- [ ] No hardcoded secrets, API keys, or localhost URLs in code.
- [ ] If API contracts changed, both `docs/openapi.yaml` and `docs/API_SPEC.md` are updated.

---

## 4. Code Style & TypeScript Strictness

### 4.1 Strict TypeScript Rules (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 4.2 Prohibited Patterns
1. **Never use `any`:** Use `unknown`, generic parameters, or define explicit Zod schemas.
2. **Never execute raw queries without schema casting:** Mongoose models must sanitize all inputs to guard against NoSQL injection.
3. **Never store plain-text passwords:** Argon2id must be invoked prior to persistence.
4. **Never write inline styles in React:** All styling must go through Tailwind CSS utilities or CSS custom properties.
