# CodeDrill Backend Service (`codedrill-backend`)

REST API service for CodeDrill built with Node.js, Express, strict TypeScript, and MongoDB (Mongoose).

---

## 🚀 Setup & Local Installation

### Prerequisites
- Node.js >= 20.18.0 (LTS)
- MongoDB 7.0+ (Local daemon or MongoDB Atlas)
- Docker (for Judge0 sandbox)

### Installation
```bash
cd codedrill-backend
npm install
```

### Environment Configuration
Copy the sample environment file and configure your local settings:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment (`development`, `test`, `production`) | `development` |
| `PORT` | HTTP server port | `5000` |
| `CORS_ORIGIN` | Allowed client origin for CORS credentials | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/codedrill` |
| `JWT_ACCESS_SECRET` | 256-bit secret for signing access JWTs | *(Min 32 characters)* |
| `JWT_REFRESH_SECRET`| 256-bit secret for signing refresh JWTs | *(Min 32 characters)* |
| `JWT_ACCESS_EXPIRATION` | Lifetime of access token | `15m` |
| `JWT_REFRESH_EXPIRATION`| Lifetime of refresh token | `7d` |
| `EXECUTION_SANDBOX_TYPE`| Code runner adapter (`judge0`, `piston`, `mock`) | `judge0` |
| `JUDGE0_API_URL` | Base URL for Judge0 CE API | `http://localhost:2358` |
| `RATE_LIMIT_WINDOW_MS` | Global rate limit window | `60000` (1 min) |
| `RATE_LIMIT_MAX_REQUESTS`| Max general API calls per window | `120` |
| `CODE_EXECUTION_MAX_PER_MINUTE`| Max code executions per user per minute | `15` |

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the API server with auto-reloading via `tsx watch`.
- `npm run build`: Compiles TypeScript to `dist/` with zero emission on type errors.
- `npm start`: Runs the production compiled server (`node dist/server.js`).
- `npm run test`: Executes unit and integration tests with `vitest`.
- `npm run test:coverage`: Generates test coverage report via Vitest v8 coverage.
- `npm run lint`: Checks source files against ESLint 9 rules.
- `npm run format`: Formats code using Prettier.
- `npm run seed`: Seeds database with 60+ initial Java Collections and DSA questions.

---

## 🏛️ Architecture Overview
The backend follows a strict inverted domain-layered architecture:
`Routes -> Zod Validation -> Controllers -> Services -> Models / Sandbox Adapters`

For full technical specifications, read [BACKEND_SPEC.md](file:///e:/Programing/JAVA%20Collection%20practice/docs/BACKEND_SPEC.md) and [API_SPEC.md](file:///e:/Programing/JAVA%20Collection%20practice/docs/API_SPEC.md).
