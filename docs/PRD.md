# CodeDrill — Product Requirements Document (PRD)

**Version:** 1.0.0  
**Status:** Ready for Review (Phase 0)  
**Author:** Full-Stack TypeScript Architect & Engineering Team  
**Target Audience:** Engineering, Product, Design, QA  

---

## 1. Executive Summary & Vision

### 1.1 Vision Statement
**CodeDrill** is an opinionated, high-velocity learning and deliberate-practice web application designed specifically for software engineers preparing for technical interviews and mastering two foundational pillars of software craftsmanship:
1. **Deep Java Collections & Internal Mechanics:** Demystifying internals (e.g., `HashMap` bucketing, treeification, resizing thresholds), memory overhead, concurrency safety (`ConcurrentHashMap`, `CopyOnWriteArrayList`), fail-fast vs. fail-safe iterators, and strict contract adherence (`equals` and `hashCode`).
2. **Data Structures & Algorithms (DSA):** Comprehensive coverage from fundamental two-pointer and sliding-window patterns to dynamic programming, graphs, segment trees, and bit manipulation.

Unlike generic algorithm problem banks that focus purely on long-form competitive coding, **CodeDrill** embraces micro-learning, active recall, and retrieval practice through five multimodal question modalities: MCQs, output predictions, fill-in-the-blank code snippets, sandboxed coding challenges, and interview-style short-answer questions.

### 1.2 Core Value Propositions
- **Granular Cognitive Assessment:** Not every concept requires writing a full 60-line algorithm. Rapid-fire output prediction and fill-in-the-blank questions build muscle memory for language quirks and edge-case contracts.
- **Engineered Retention:** Spaced repetition (SM-2 variant) and weak-topic detection guarantee that knowledge decay is systematically counteracted.
- **Real-World Sandbox:** Ultra-fast, isolated code execution against visible and hidden test suites using a containerized execution engine.

---

## 2. Target Personas

| Persona | Background & Goals | Pain Points | CodeDrill Solution |
| :--- | :--- | :--- | :--- |
| **P1: Junior / Mid Java Developer ("Alex")** | 1–3 years Java experience; preparing for senior or product-company rounds; needs to master collections internals and core DSA patterns. | Struggles to explain *why* `ConcurrentHashMap` doesn't lock the entire map, or how `TreeMap` maintains red-black invariants; forgets DSA patterns after a week of inactivity. | Concise deep-dive notes, internal memory diagrams, SM-2 revision queue, and output prediction quizzes. |
| **P2: Computer Science Student ("Priya")** | Final-year CS undergraduate preparing for campus placements and internships; needs structured roadmap covering core DSA + Java. | Overwhelmed by LeetCode's unstructured 3,000+ problems; lacks feedback on code mechanics and conceptual interview questions. | Curated two-track curriculum, progress tracking, streak gamification, and daily challenges. |
| **P3: Polyglot Engineer Transitioning to Enterprise Backend ("Carlos")** | Experienced in Python/TypeScript, moving to a high-scale Java/Spring Boot shop; needs rapid Java-specific mastery. | Confuses Java's collection contracts (`Comparable` vs `Comparator`, fail-fast behavior) with other languages' standard libraries. | Java Collections deep-dive track, targeted cheat sheets, and interview short-answer drills. |
| **P4: Platform Administrator / Instructor ("Sarah")** | Content creator and engineering mentor managing question pools. | Hard to import/export questions in bulk; lacks fine-grained validation and taxonomy tooling. | Admin portal with bulk JSON/CSV import, rich schema validation, and question lifecycle management. |

---

## 3. User Journeys & User Stories

### 3.1 User Stories by Functional Epic

#### Epic 1: Authentication & User Profile
- **US1.1:** As an engineer, I want to sign up using email and password with immediate client-side and server-side validation, so that my account is secure.
- **US1.2:** As an engineer, I want my session to remain active seamlessly using secure HTTP-only refresh tokens, so I don't get logged out mid-practice.
- **US1.3:** As an engineer, I want to view my profile, edit my display name, view my account creation date, and reset my password.

#### Epic 2: Curated Learning (Learn Mode)
- **US2.1:** As a learner, I want to browse structured topics across both tracks (Java Collections & DSA), viewing hierarchical categories (e.g., `Java Collections -> Map -> HashMap Internals`).
- **US2.2:** As a learner, I want to read concise, high-signal topic notes rendered in GitHub-flavored markdown with syntax highlighting, visual diagrams, and big-O complexity cheat sheets.
- **US2.3:** As a learner, I want to mark topics as "Studied" and jump immediately into a targeted practice drill for that specific topic.

#### Epic 3: Multi-Modal Practice Engine
- **US3.1 (MCQ):** As a user, I want to answer single-select and multi-select MCQs with instant visual feedback and comprehensive explanations detailing why incorrect options are wrong.
- **US3.2 (Output Prediction):** As a user, I want to inspect a Java code snippet (e.g., modifying a list during iteration), submit what the console will output, and see the exact runtime behavior (including exceptions like `ConcurrentModificationException`).
- **US3.3 (Fill-in-the-Blank):** As a user, I want to complete missing expressions or method signatures in a code block with syntax-aware inputs to prove structural recall.
- **US3.4 (Coding Challenge):** As a user, I want a Monaco-powered IDE where I can write solution code, run against custom/sample test cases in real-time, and submit against hidden edge cases with detailed memory/runtime analytics.
- **US3.5 (Interview Short-Answer):** As a user, I want to read an architectural interview prompt (e.g., *"Explain how HashMap handles hash collisions in Java 8+"*), formulate my answer, self-rate against a structured rubric, and reveal the model answer.

#### Epic 4: Smart Progress, Analytics & Retention
- **US4.1 (Streaks & Activity):** As a user, I want my daily practice activity to maintain a streak counter with timezone awareness and a GitHub-style activity heat map.
- **US4.2 (Weak Topic Detection):** As a user, I want the system to analyze my failure rate and identify weak topics (accuracy < 60% over >= 5 attempts), presenting a "Needs Focus" action drawer.
- **US4.3 (Spaced Repetition / SM-2):** As a user, I want questions I struggle with to automatically enter my Spaced Repetition Revision Queue, surfacing them after optimal decay intervals (1 day, 3 days, 6 days, etc.).
- **US4.4 (Bookmarks & Notes):** As a user, I want to bookmark any question and attach private markdown notes for quick reference before an interview.

#### Epic 5: Timed Drills & Challenges
- **US5.1 (Daily Challenge):** As a user, I want a fresh, curated daily question (alternating between Collections and DSA) that awards bonus streak points.
- **US5.2 (Mock Interview Mode):** As a user, I want to generate a timed, multi-question assessment (e.g., 45 minutes, 1 Coding + 2 Output + 2 MCQs) simulating a real technical phone screen.

#### Epic 6: Administration & Content Operations
- **US6.1:** As an admin, I want to create, read, update, and delete topics and questions with rich schema validation.
- **US6.2:** As an admin, I want to bulk import questions via JSON and CSV with pre-flight dry-run validation that flags syntax or schema errors before committing to the database.

---

## 4. MoSCoW Feature Prioritization

| Priority | Feature / Capability | Description & Scope |
| :--- | :--- | :--- |
| **Must Have (P0)** | Dual Track Architecture | Independent tracks for Java Collections and DSA with topic taxonomies. |
| **Must Have (P0)** | Secure JWT Auth & RBAC | Access token (15m in memory), Refresh token (7d in HTTP-only cookie), role-based permissions (`user`, `admin`). |
| **Must Have (P0)** | 5 Practice Modalities | Full execution and scoring engine for MCQ, Output, Fill-in-blank, Coding, and Interview short-answer. |
| **Must Have (P0)** | Isolated Code Execution Engine | Sandboxed code runner (Judge0 / Piston adapter) supporting Java 17/21 with memory, time limits, and security isolation. |
| **Must Have (P0)** | Rich Learn Mode | Markdown reader, syntax-highlighted code blocks, complexity tables, and topic navigation. |
| **Must Have (P0)** | Core Progress Engine | Solved/attempted stats, topic accuracy percentages, submission histories. |
| **Should Have (P1)** | Spaced Repetition (SM-2 Queue) | Automated revision scheduling based on user quality ratings (0–5) and intervals. |
| **Should Have (P1)** | Weak-Topic Detection Engine | Dynamic heuristic computing mastery scores and surfacing remediation lists. |
| **Should Have (P1)** | Bookmarks & Personal Notes | Per-user question annotations with markdown preview. |
| **Should Have (P1)** | Admin Content Management | Question CRUD and bulk JSON/CSV import with schema validation. |
| **Should Have (P1)** | Daily Challenge | Time-bound daily problem with streak preservation logic. |
| **Could Have (P2)** | Timed Mock Interview Simulator | Configurable time limits, randomized question baskets, aggregate scoring report. |
| **Could Have (P2)** | Interactive Cheat Sheets | Filterable big-O and memory complexity tables with interactive visual aids. |
| **Could Have (P2)** | Global & Topic Leaderboards | Solved counts, streak length, and mastery percentiles. |
| **Won't Have (Initial Release)** | Multiplayer / 1v1 Live Coding | Real-time WebRTC/WebSocket code battles (deferred to v2.0). |
| **Won't Have (Initial Release)** | AI Auto-Grading for Interviews | LLM-based semantic grading of free-text answers (v2.0 roadmap). |
| **Won't Have (Initial Release)** | Native Mobile App | PWA supported; native iOS/Android rejected for web responsiveness. |

---

## 5. Non-Goals (Explicit Boundaries)
1. **Generic Language Support:** The platform is purpose-built for Java and Core DSA. We will not support C++, Rust, Go, or PHP in the initial versions. (Optional JS/Python sandbox execution will only be enabled if explicitly configured in the execution adapter).
2. **Arbitrary Package Imports:** The sandbox will restrict user submissions to the Java standard library (`java.base`, `java.util`, `java.lang`, `java.io`, `java.math`). No Maven/Gradle dependencies or internet access allowed in the runner.
3. **Heavy Social Feed:** No public feed, comments section, or social messaging in Phase 1 to maintain maximum focus on core technical learning.

---

## 6. Success Metrics & KPIs

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **Code Execution Latency (P95)** | < 1,800 ms (Java compile + run) | Monitored via backend execution metrics / Pino logs |
| **Practice Completion Rate** | > 65% of started sessions completed | Analytics tracking `session_start` to `session_submit` |
| **D7 User Retention** | > 40% active return rate | Spaced repetition reminder triggers and daily streaks |
| **Topic Mastery Progression** | Average user reaches > 70% mastery in >= 3 topics within 14 days | User progress aggregation queries |
| **API Error Rate (5xx)** | < 0.1% total requests | Express error handling middleware metrics |
| **Test Coverage** | >= 85% backend services; >= 80% frontend components | Vitest and Playwright CI test reports |
