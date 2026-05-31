# RoadSoS Kids

A pediatric emergency response ecosystem that connects child wearable sensors to parents and first responders in real time.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (`artifacts/roadsos`, preview at `/`)
- API: Express 5 (`artifacts/api-server`, serves at `/api`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Generated hooks: `lib/api-client-react`; Generated Zod schemas: `lib/api-zod`
- Animations: Framer Motion; Charts: Recharts

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/index.ts` — Drizzle DB schema (children, incidents, vitals, hospitals, ambulances, messages, timeline_events)
- `artifacts/roadsos/src/pages/` — ChildWatchPage, ParentDashboardPage, ResponderDashboardPage
- `artifacts/api-server/src/routes/` — incidents, vitals, children, hospitals, ambulances, messages, timeline, dashboard, sensor
- `artifacts/roadsos/src/index.css` — global dark theme variables and Tailwind base

## Architecture decisions

- **Contract-first API**: OpenAPI spec in `lib/api-spec` drives codegen for both React hooks (Orval + TanStack Query) and Zod schemas. Never hand-write fetch calls.
- **URL alias routes**: The OpenAPI spec paths are canonical. If spec says `/dashboard/timeline/{id}`, the server must handle that path (or provide an alias) regardless of how the route file is organized.
- **Orval TS2308 workaround**: Operations with both path params AND query params generate `{Op}Params` in both `api.ts` and `types/` causing a TS2308 collision. Fix: remove query params from those path-param operations in the spec.
- **DB seeding**: Seeded via `executeSql` in code_execution sandbox (not scripts package) due to workspace dep resolution issues in bare scripts.
- **Single-artifact frontend**: All three views (child watch, parent, responder) live as React Router routes within one Vite artifact at `/`.

## Product

Three role-based dashboards served at:
- `/child-watch` — Smartwatch UI simulator: normal idle state, impact-detected alert (pulsing red), confirmation flow, help-coming reassurance. Backed by live incident data.
- `/parent` — Parent Command Center: incident list sidebar, live map with child/ambulance/hospital pins, live vitals bars, incident timeline, secure messaging with responders.
- `/responder` — Emergency Response Dashboard: alert card with status stepper (Advance button), Recharts vitals sparkline, AI hospital recommendation with confidence %, patient medical history and allergy badges.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Import `zod/v4`** not `zod` in api-server — must add `zod` explicitly to api-server's `dependencies` with `"catalog:"` entry.
- **Orval URL mismatches**: After codegen, grep `return \`/api` in the generated file and cross-check every path against the actual Express routes. Mismatches cause silent 404s in the browser.
- **Timeline route**: spec path `/dashboard/timeline/{incidentId}` → server alias in `routes/timeline.ts`; actual data route at `/incidents/:incidentId/timeline`.
- **Messages route**: spec path `/messages/{incidentId}` → server alias in `routes/messages.ts`; actual data route at `/incidents/:incidentId/messages`.
- **Sensor route**: spec path `/innerwear/sensor-data` → server alias in `routes/sensor.ts` sharing the same handler.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
