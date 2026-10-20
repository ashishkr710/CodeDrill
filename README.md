# CodeDrill — Deep Learning & Practice Platform for Java Collections & DSA

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x_LTS-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**CodeDrill** is a developer platform designed to help software engineers master Java Collections internals (memory models, bucketing, concurrency safety, iterator contracts) and Data Structures & Algorithms (DSA) through multimodal deliberate practice and spaced repetition.

---

## 📁 Repository Structure

The project is architected as two decoupled applications with unified technical documentation:

```
.
├── docs/                     # Comprehensive Phase 0 Architecture & Specifications
│   ├── PRD.md                # Product Requirements Document
│   ├── ARCHITECTURE.md       # System Topology & Architectural Decision Records
│   ├── TECH_STACK.md         # Library versions & architectural rationales
│   ├── DATA_MODEL.md         # MongoDB collections, Mongoose schemas & ER diagram
│   ├── openapi.yaml          # OpenAPI 3.1 REST API specification
│   ├── API_SPEC.md           # Endpoints, request/response models & error codes
│   ├── BACKEND_SPEC.md       # Layered Node.js/Express architecture & security
│   ├── FRONTEND_SPEC.md      # React 19, Zustand, Monaco & UI/UX wireframes
│   ├── CODE_EXECUTION.md     # Sandboxed execution engine & Java test harness
│   ├── CONTENT_PLAN.md       # Taxonomies, difficulty rubrics & 25 sample questions
│   ├── PROGRESS_AND_REVISION.md # Mastery formula, SM-2 algorithm & streak rules
│   ├── TESTING_STRATEGY.md   # Test pyramid, coverage targets & seed plans
│   ├── CONVENTIONS.md        # Naming, Git Conventional Commits & code style
│   ├── DEVELOPMENT_PLAN.md   # 10 milestone implementation roadmap with tasks
│   └── AGENT_RULES.md        # Autonomous engineering agent operating protocols
├── codedrill-backend/        # Express + TypeScript + MongoDB REST API
│   └── README.md             # Backend setup & developer guide
├── codedrill-frontend/       # React 19 + Vite + Tailwind + Monaco SPA
│   └── README.md             # Frontend setup & developer guide
└── docker-compose.yml        # Multi-container orchestration (Mongo, Judge0, API, SPA)
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js >= 20.18.0 (LTS)
- Docker Desktop with Compose v2+
- npm or pnpm

### 1. Clone & Review Docs
All technical specifications are stored in the [`/docs`](file:///e:/Programing/JAVA%20Collection%20practice/docs) folder. Ensure you review:
- [Architecture & Design](file:///e:/Programing/JAVA%20Collection%20practice/docs/ARCHITECTURE.md)
- [API Specification](file:///e:/Programing/JAVA%20Collection%20practice/docs/API_SPEC.md)
- [Master Development Plan](file:///e:/Programing/JAVA%20Collection%20practice/docs/DEVELOPMENT_PLAN.md)

### 2. Run with Docker Compose
Spin up MongoDB 7, Redis, Judge0 Code Sandbox, Backend API, and Frontend SPA:
```bash
docker compose up -d
```

### 3. Independent Service Setup
- For backend details, see [`codedrill-backend/README.md`](file:///e:/Programing/JAVA%20Collection%20practice/codedrill-backend/README.md)
- For frontend details, see [`codedrill-frontend/README.md`](file:///e:/Programing/JAVA%20Collection%20practice/codedrill-frontend/README.md)

---

## 🛡️ Key Architectural Invariants
- **Strict TypeScript Everywhere:** `strict: true` with zero tolerance for `any`.
- **Stateless REST + In-Memory Access Tokens:** 15-minute access JWTs in memory, 7-day refresh JWTs in HttpOnly cookies with replay family invalidation.
- **Sandboxed Code Execution:** Untrusted user code is NEVER executed in the API process. It runs inside isolated containers (Judge0 CE) constrained by Linux cgroups, seccomp filters, and unmapped network namespaces.
- **Active Recall & Retention:** Built-in SM-2 spaced repetition queue and dynamic weak-topic remediation.
