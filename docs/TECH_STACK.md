# CodeDrill — Complete Technology Stack & Version Matrix

**Version:** 1.0.0  
**Status:** Approved for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Overview & Architectural Philosophy
The CodeDrill tech stack is curated to maximize:
1. **Type Safety & Developer Velocity:** Strict TypeScript throughout, runtime schema validation with Zod, and auto-generated API clients to eliminate runtime contract mismatches.
2. **Deterministic Sandboxing:** High-performance, isolated code execution preventing server-side compromise.
3. **Optimistic & Fluid UX:** Instant rendering with TanStack Query caching, smooth transitions with Tailwind CSS + Radix UI (shadcn/ui), and a high-fidelity Monaco editor.
4. **Low Operational Overhead:** Stateless Express API backed by MongoDB Atlas, containerized using Docker Compose for 1-command local onboarding.

---

## 2. Frontend Technology Stack (`codedrill-frontend`)

### 2.1 Core Runtime & Framework
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `react` | `^19.0.0` | Declarative UI framework with modern concurrent rendering, compiler optimizations, and robust ecosystem. |
| `react-dom` | `^19.0.0` | DOM bindings for React 19. |
| `vite` | `^6.1.0` | Ultra-fast native ESM build tool and development server with instant HMR and optimized Rollup production bundling. |
| `typescript` | `^5.7.3` | Enforces strict compile-time type safety (`strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`). |

### 2.2 Routing & Server State
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `react-router-dom` | `^7.2.0` | Industry-standard declarative client-side routing, supporting nested route layouts, loaders, and error boundaries. |
| `@tanstack/react-query` | `^5.66.0` | Asynchronous server-state manager with automated caching, background revalidation, mutation side-effects, and query invalidation. |
| `@tanstack/react-query-devtools`| `^5.66.0` | Visual inspection tool for debugging cache hits, stale times, and active queries during development. |

### 2.3 Client State & Storage
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `zustand` | `^5.0.3` | Minimalist, unopinionated client store for UI state (Monaco editor buffer, active practice filter selections, theme). Zero boilerplate compared to Redux Toolkit. |

### 2.4 UI, Styling & Component Library
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `tailwindcss` | `^4.0.0` | High-utility, performant CSS engine. Works seamlessly with CSS variables for light/dark mode. |
| `@tailwindcss/vite` | `^4.0.0` | Vite plugin for first-class Tailwind v4 compilation speed. |
| `clsx` | `^2.1.1` | Tiny utility for conditionally joining CSS class strings. |
| `tailwind-merge` | `^3.0.1` | Intelligently merges Tailwind utility classes without specificity conflicts (vital for shadcn/ui components). |
| `class-variance-authority` | `^0.7.1` | Creates strongly-typed, variant-driven UI components (e.g., button variants, badges). |
| `lucide-react` | `^0.475.0` | Clean, lightweight, consistent SVG icon set matching modern developer tooling aesthetics. |
| `@radix-ui/react-*` | Latest | Accessible, unstyled UI primitives powering shadcn/ui (Dialog, DropdownMenu, Tabs, Tooltip, Toast, Slider). |

### 2.5 Code Editor & Content Rendering
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `@monaco-editor/react` | `^4.7.0` | React wrapper for Microsoft Monaco Editor (VS Code core). Provides full Java syntax highlighting, line decorations, code folding, and intellisense hooks. |
| `react-markdown` | `^9.0.3` | Secure, AST-based markdown renderer for topic study notes and question descriptions. |
| `remark-gfm` | `^4.0.0` | Remark plugin adding support for GitHub Flavored Markdown (tables, checklists, strikethrough). |
| `rehype-highlight` | `^7.0.1` | Syntax highlighting engine for code fences rendered inside markdown articles. |
| `rehype-raw` | `^7.0.0` | Safely parses sanitized embedded HTML snippets in markdown guides. |

### 2.6 Form Handling & Validation
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `react-hook-form` | `^7.54.2` | High-performance, uncontrolled form management minimizing re-renders. |
| `@hookform/resolvers` | `^3.10.0` | Bridges React Hook Form with Zod schemas for end-to-end form validation. |
| `zod` | `^3.24.2` | TypeScript-first schema declaration and runtime validation library. |

### 2.7 API Client & Data Fetching
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `openapi-fetch` | `^0.14.1` | Ultra-lightweight (1.2kb), type-safe HTTP client directly inferred from OpenAPI 3.1 schema. |
| `openapi-typescript` | `^7.6.1` | CLI tool generating TypeScript types directly from `docs/openapi.yaml`. |

### 2.8 Data Visualization & Date Formatting
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `recharts` | `^2.15.1` | Composable charting library built on React components for progress analytics (topic radar charts, mastery trends). |
| `date-fns` | `^4.1.0` | Modern, immutable date utility library for streak calculations, SM-2 interval formatting, and timestamps. |
| `canvas-confetti` | `^1.9.4` | Delightful micro-interaction feedback on streak milestones and challenge completions. |

---

## 3. Backend Technology Stack (`codedrill-backend`)

### 3.1 Runtime, Framework & Core HTTP
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `node` | `>=20.18.0 (LTS)` | Active LTS Node runtime providing native fetch, stable crypto, and diagnostic reporting. |
| `express` | `^4.21.2` | Battle-tested, lightweight HTTP server framework with proven middleware ecosystem. |
| `typescript` | `^5.7.3` | Static typing, transpile target `ES2022`, module resolution `NodeNext`. |

### 3.2 Database & Data Access
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `mongoose` | `^8.10.0` | Elegant MongoDB ODM providing schema enforcement, lifecycle hooks, compound indexing, and population. |
| `mongodb` | (Bundled via Mongoose) | Core native driver. |

### 3.3 Security, Auth & Crypto
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `jsonwebtoken` | `^9.0.2` | Signs and verifies asymmetric/symmetric JWT access tokens. |
| `argon2` | `^0.41.1` | Winner of the Password Hashing Competition; superior resistance to GPU/ASIC cracking over bcrypt. |
| `helmet` | `^8.0.0` | Secures Express apps by setting crucial HTTP response headers (CSP, HSTS, X-Frame-Options). |
| `cors` | `^2.8.5` | Strict Cross-Origin Resource Sharing middleware restricting API access to trusted frontend origins. |
| `express-rate-limit` | `^7.5.0` | Token-bucket rate limiter guarding against brute-force auth attempts and sandbox execution flooding. |
| `cookie-parser` | `^1.4.7` | Parses and signs secure `HttpOnly` cookies storing refresh tokens. |

### 3.4 Request Validation & Serialization
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `zod` | `^3.24.2` | Runtime request body, query, and parameter validation. Ensures untyped HTTP input is safely coerced into typed domain objects. |

### 3.5 Logging & Observability
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `pino` | `^9.6.0` | Ultra-fast JSON logger with minimal CPU overhead. Structured logging with request IDs. |
| `pino-http` | `^10.4.0` | Express middleware auto-logging request lifecycle, status codes, and response times. |
| `pino-pretty` | `^13.0.0` | Dev-only colorized, readable log formatter. |

### 3.6 Utilities & File Parsing
| Package | Version | Justification & Role |
| :--- | :--- | :--- |
| `dotenv` | `^16.4.7` | Loads environment variables from `.env` files into `process.env`. |
| `csv-parse` | `^5.6.0` | Fast, stream-based CSV parsing for admin bulk question importing. |
| `nanoid` | `^5.0.9` | Cryptographically secure, URL-friendly unique ID generator for submission identifiers. |

---

## 4. Code Execution Sandboxing Tier

| Component | Version / Image | Justification & Role |
| :--- | :--- | :--- |
| **Judge0 CE** | `judge0/judge0:v1.13.1` | High-performance open-source code execution engine. Supports Java OpenJDK 17/21, strict memory bounds, wall-clock time enforcement, and container isolation. |
| **Judge0 Postgres & Redis** | `postgres:16-alpine`, `redis:7-alpine` | Internal state and asynchronous queue broker for the Judge0 worker cluster. |
| **Piston (Alternative Adapter)** | `ghcr.io/engineer-man/piston:latest` | Lightweight alternative sandbox engine easily swappable via backend `ExecutionAdapter` config. |

---

## 5. Testing & Quality Assurance Suite

### 5.1 Frontend Testing
| Tool | Version | Justification & Role |
| :--- | :--- | :--- |
| `vitest` | `^3.0.5` | Next-generation unit test runner sharing Vite's config, plugins, and transform pipeline. |
| `@testing-library/react` | `^16.2.0` | User-centric UI component testing emphasizing accessibility and real interaction patterns. |
| `@testing-library/jest-dom` | `^6.6.3` | Custom Jest/Vitest matchers for asserting on DOM nodes (`toBeInTheDocument`, `toHaveClass`). |
| `jsdom` | `^26.0.0` | Headless browser DOM simulation for fast unit tests. |
| `@playwright/test` | `^1.50.1` | End-to-end browser automation for full user flows (sign in, complete MCQ, run code in Monaco). |

### 5.2 Backend Testing
| Tool | Version | Justification & Role |
| :--- | :--- | :--- |
| `vitest` | `^3.0.5` | Fast, ESM-native test runner for unit tests and service logic tests. |
| `supertest` | `^7.0.0` | High-level abstraction for testing HTTP requests against Express instances without binding to network ports. |
| `mongodb-memory-server` | `^10.1.4` | In-memory MongoDB instance for isolated, zero-mock integration testing with real Mongoose queries. |

---

## 6. Development Tooling, Linters & Infrastructure

| Tool | Version | Configuration & Purpose |
| :--- | :--- | :--- |
| `eslint` | `^9.20.1` | Flat config (`eslint.config.js`) enforcing TypeScript rules, React hooks rules, and import hygiene. |
| `@typescript-eslint/parser` | `^8.24.0` | Parses TypeScript AST for ESLint analysis. |
| `prettier` | `^3.5.1` | Opinionated code formatter configured with 2-space indentation, single quotes, and trailing commas. |
| `prettier-plugin-tailwindcss`| `^0.6.11` | Automatically sorts Tailwind utility classes in recommended order. |
| `husky` | `^9.1.7` | Git hooks manager executing linting and testing pre-commit. |
| `lint-staged` | `^15.4.3` | Runs linters only on git-staged files to keep pre-commit execution fast. |
| `docker` & `compose` | Engine v27+, Compose v2+ | Multi-container local orchestration (`mongodb`, `judge0`, `judge0-db`, `judge0-redis`, `backend`, `frontend`). |
