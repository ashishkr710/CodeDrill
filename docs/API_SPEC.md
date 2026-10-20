# CodeDrill — REST API Specification & Developer Guide

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**OpenAPI Specification:** [openapi.yaml](file:///e:/Programing/JAVA%20Collection%20practice/docs/openapi.yaml)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Global API Standards

### 1.1 Content Negotiation & Encoding
- All endpoints accept and return `application/json; charset=utf-8`.
- Date and time representations conform to **ISO-8601 UTC** (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Keys are formatted in **camelCase**.

### 1.2 Unified Success Envelope
All successful HTTP 2xx responses wrap domain payloads inside a standard envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation",
  "timestamp": "2026-10-20T16:15:30.123Z"
}
```

### 1.3 Unified Error Envelope
All error responses (4xx, 5xx) follow RFC 7807 problem details semantics wrapped in a predictable format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid submission payload.",
    "details": [
      {
        "field": "code",
        "issue": "Code content cannot exceed 64KB"
      }
    ]
  },
  "timestamp": "2026-10-20T16:15:30.123Z"
}
```

#### Standard Error Codes:
| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Missing, malformed, or expired access token |
| `FORBIDDEN` | 403 | Insufficient permissions or token replay detected |
| `NOT_FOUND` | 404 | Requested entity does not exist |
| `VALIDATION_ERROR` | 422 | Zod schema validation failed on body/query/params |
| `RATE_LIMIT_EXCEEDED`| 429 | Too many requests; retry after specified backoff |
| `SANDBOX_UNAVAILABLE`| 503 | Execution worker cluster unreachable or saturated |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception |

### 1.4 Pagination Conventions
List endpoints support limit-offset pagination with metadata headers and body attributes:
- `page` (default: `1`, min: `1`)
- `limit` (default: `20`, min: `1`, max: `100`)

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 2. Authentication & Authorization

### 2.1 Token Pair Mechanics
- **Access Token:** Short-lived JWT (15 minutes). Sent in client requests via the HTTP header:  
  `Authorization: Bearer <accessToken>`
- **Refresh Token:** Long-lived cryptographically signed token (7 days). Stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie named `refreshToken`.
- **Token Rotation & Replay Defense:** Each refresh generates a new token pair and revokes the predecessor. If an invalidated refresh token is ever presented, the backend immediately terminates the entire user token family, protecting against stolen credential replay attacks.

---

## 3. Endpoints Detailed Specification

### 3.1 Authentication (`/auth`)

#### `POST /auth/register`
Creates a new learner account.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "engineer@codedrill.dev",
    "password": "StrongPassword123!",
    "displayName": "JavaNinja"
  }
  ```
- **Response (201 Created):** Sets `refreshToken` cookie and returns:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOi...",
      "user": {
        "id": "65e01234567890abcdef0001",
        "email": "engineer@codedrill.dev",
        "displayName": "JavaNinja",
        "role": "user",
        "streak": { "currentStreak": 1, "longestStreak": 1 }
      }
    }
  }
  ```

#### `POST /auth/login`
- **Access:** Public
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200 OK):** Sets `refreshToken` cookie and returns `{ success: true, data: { accessToken, user } }`.

#### `POST /auth/refresh`
- **Access:** Public (Requires `refreshToken` cookie)
- **Response (200 OK):** Returns `{ success: true, data: { accessToken: "new_jwt" } }`.

#### `POST /auth/logout`
- **Access:** Authenticated
- **Response (200 OK):** Clears cookie and invalidates session token.

---

### 3.2 Curriculum & Learning Content (`/tracks`, `/topics`)

#### `GET /tracks`
Lists the two main tracks: `java-collections` and `dsa`.
- **Access:** Public

#### `GET /topics?trackSlug=java-collections`
Returns all topics in hierarchical sequence for the track.
- **Access:** Public
- **Response Items:**
  ```json
  {
    "id": "65e000000000000000000005",
    "trackSlug": "java-collections",
    "slug": "hashmap-internals",
    "title": "HashMap Internals & Hashing Mechanics",
    "description": "Deep-dive into table buckets, treeification threshold, load factor, and resizing.",
    "estimatedReadTimeMinutes": 12,
    "displayOrder": 3
  }
  ```

#### `GET /topics/:slug`
Fetches complete study guide with markdown notes, code snippets, and complexity cheat sheets.
- **Access:** Public

---

### 3.3 Practice & Questions (`/questions`, `/practice`)

#### `GET /questions`
Filterable questions bank.
- **Query Parameters:**
  - `trackSlug`: `java-collections` | `dsa`
  - `topicId`: MongoDB ObjectId
  - `difficulty`: `easy` | `medium` | `hard`
  - `type`: `mcq` | `output_prediction` | `fill_in_the_blank` | `coding` | `interview_short_answer`
  - `status`: `unattempted` | `attempted` | `solved`
  - `companyTag`: string (e.g., `Amazon`)
  - `page`: integer
  - `limit`: integer
- **Access:** Authenticated (injects user-specific `userStatus` and `isBookmarked`).

#### `GET /questions/:id`
Retrieves practice payload for a single question. Ground-truth solutions and hidden test cases are stripped out.

#### `POST /practice/submissions`
Evaluates non-coding questions (MCQ, Output Prediction, Fill-in-the-blank, Interview).
- **Request Body:**
  ```json
  {
    "questionId": "65e01234567890abcdef0001",
    "responsePayload": {
      "selectedOptionIds": ["opt-2"]
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "submissionId": "sub_981247",
      "isCorrect": true,
      "score": 1.0,
      "verdict": "ACCEPTED",
      "explanation": "Calling it.remove() updates expectedModCount = modCount, preventing ConcurrentModificationException.",
      "nextReviewDate": "2026-10-23T16:00:00.000Z"
    }
  }
  ```

---

### 3.4 Sandboxed Code Execution (`/practice/code`)

#### `POST /practice/code/run`
Runs user code against sample test cases in an ephemeral sandbox.
- **Request Body:**
  ```json
  {
    "questionId": "65e01234567890abcdef0009",
    "language": "java",
    "code": "class Solution { public int[] twoSum(int[] nums, int target) { ... } }"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "verdict": "ACCEPTED",
      "testCases": [
        {
          "input": "nums = [2,7,11,15], target = 9",
          "expectedOutput": "[0,1]",
          "actualOutput": "[0,1]",
          "passed": true,
          "executionTimeMs": 142
        }
      ]
    }
  }
  ```

#### `POST /practice/code/submit`
Executes code against the comprehensive hidden test suite, writes to `submissions`, and updates `user_progress`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "submissionId": "sub_code_00192",
      "verdict": "ACCEPTED",
      "score": 1.0,
      "runtimeMs": 198,
      "memoryKb": 42100,
      "testCaseSummary": {
        "passed": 35,
        "total": 35
      }
    }
  }
  ```

---

### 3.5 Spaced Repetition & Revision Queue (`/revision`)

#### `GET /revision/queue`
Retrieves all cards whose `dueDate <= now()` ordered by urgency.

#### `POST /revision/:id/review`
Submits active recall feedback rating (0 = Blackout, 3 = Pass with effort, 5 = Instant perfect recall). Recalculates new interval using SM-2 algorithm.
- **Request Body:** `{ "qualityScore": 4 }`

---

### 3.6 Bookmarks & Notes (`/bookmarks`)

- `GET /bookmarks`: Returns list of saved questions with user markdown notes.
- `POST /bookmarks`: Saves bookmark with note `{ "questionId": "...", "noteMarkdown": "Remember fail-fast checks modCount!" }`.
- `DELETE /bookmarks/:questionId`: Unbookmarks question.

---

### 3.7 Administration & Bulk Import (`/admin`)
- `POST /admin/questions`: Create single question.
- `POST /admin/questions/import`: Bulk import array of question JSON objects with dry-run validation option.
- `PUT /admin/questions/:id`: Update question.
- `DELETE /admin/questions/:id`: Soft-delete question.
