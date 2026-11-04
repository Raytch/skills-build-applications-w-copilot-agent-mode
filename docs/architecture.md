# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- Presentation tier decision: Use React 19, Vite, React Router, and Bootstrap, with the shared API client calling relative `/api` paths through Vite's proxy.
- Logic tier decision: Implement API behavior in Express and TypeScript routes/services, validate inputs, and return deliberate 4xx responses for invalid or missing resources.
- Data tier decision: Persist users, teams, and activities with Mongoose models in MongoDB, using seeded records for the API and tests.
- Activity tracking approach: Validate `userId` and `teamId` formats and confirm both records exist before creating an activity with the submitted references, type, minutes, computed points, and occurrence time.
- Team management approach: List and create teams with members, preserve submitted names and mascots, and reject a missing name with `400`.
- Leaderboard approach: Sum activity points per team, sort totals highest first, and return each team's name, total points, and 1-based rank.
- Workout suggestions approach: Match the requested email to a seeded user, base recommendations on their goal or recent activity, explain the first suggestion, and return a 4xx when no user matches.

## Test plan

Execution status: These commands were not run in this editing session; no pass/fail results are available. A failure generally means:

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend` — data/model/seed behavior failed, or the test database/setup is unavailable.
- API command: `npm run test:api --prefix octofit-tracker/backend` — an API behavior/contract test failed, or the backend test setup is unavailable.
- Frontend command: `npm test --prefix octofit-tracker/frontend` — a frontend test failed, or the frontend test setup is unavailable.
- Backend build command: `npm run build --prefix octofit-tracker/backend` — TypeScript compilation or backend build configuration failed.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend` — frontend compilation/bundling or build configuration failed.
