---
name: Orval URL mismatches
description: Generated client URLs are derived from OpenAPI spec paths, not Express route file organization — mismatches cause silent 404s
---

## Rule
After any codegen run, grep `return \`/api` in the generated file (`lib/api-client-react/src/generated/api.ts`) and cross-check every path against the registered Express routes. Mismatches cause silent 404s with no console error beyond the network tab.

## Fix pattern
Add alias routes on the server side (faster than changing spec + re-running codegen):
- Spec `/dashboard/timeline/{incidentId}` → alias in `routes/timeline.ts`, real handler at `/incidents/:id/timeline`
- Spec `/messages/{incidentId}` → alias in `routes/messages.ts`, real handler at `/incidents/:id/messages`
- Spec `/innerwear/sensor-data` → alias in `routes/sensor.ts` sharing the same handler function

**Why:** The spec is the contract the client uses. Moving the spec path to match the server is also valid but requires a codegen re-run; adding a server alias is zero-risk and instant.

**How to apply:** Any time a page loads but shows "No data" / "No events" unexpectedly, check the generated URL for that hook against the registered routes before debugging React state.
