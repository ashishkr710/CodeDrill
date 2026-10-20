# CodeDrill Frontend Application (`codedrill-frontend`)

Modern Single Page Application (SPA) for deliberate learning and practice of Java Collections and DSA. Built with React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Monaco Editor, and TanStack Query v5.

---

## 🚀 Setup & Local Installation

### Prerequisites
- Node.js >= 20.18.0 (LTS)
- npm or pnpm

### Installation
```bash
cd codedrill-frontend
npm install
```

### Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend Express API | `http://localhost:5000/api/v1` |
| `VITE_APP_TITLE` | Application title | `CodeDrill` |

---

## 🛠️ Available Scripts

- `npm run dev`: Launches Vite dev server with instant Hot Module Replacement (HMR) at `http://localhost:5173`.
- `npm run build`: Performs TypeScript type check (`tsc -b`) and bundles production assets to `dist/`.
- `npm run preview`: Locally previews the production build.
- `npm run test`: Runs unit and component tests with `vitest`.
- `npm run test:e2e`: Runs Playwright end-to-end browser tests.
- `npm run lint`: Runs ESLint on all `.ts` and `.tsx` files.
- `npm run format`: Formats code using Prettier and Tailwind class sorter.
- `npm run generate:api`: Ingests `../docs/openapi.yaml` and updates TypeScript types in `src/types/api.d.ts`.

---

## 🎨 UI/UX & Design Philosophy
- **Rich Aesthetics:** Tailored modern dark and light modes using CSS variables and vibrant semantic accents.
- **Monaco Editor:** Syntax-highlighted Java 21 IDE with keybindings, bracket matching, line decorations, and automatic draft caching.
- **Micro-Interactions:** Confetti feedback on completed streaks and spaced-repetition deck clears.

For complete frontend architectural details and wireframes, see [FRONTEND_SPEC.md](file:///e:/Programing/JAVA%20Collection%20practice/docs/FRONTEND_SPEC.md).
