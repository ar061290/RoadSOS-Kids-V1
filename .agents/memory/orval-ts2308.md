---
name: Orval TS2308 collision fix
description: Operations with both path params AND query params cause TS2308 duplicate identifier errors in generated code
---

## Rule
In `lib/api-spec/openapi.yaml`, never put query parameters on operations that also have path parameters. The Orval codegen generates a `{OperationId}Params` type in both `generated/api.ts` AND `generated/types/` which causes TS2308 "cannot be compiled under isolatedModules" collision.

**Why:** Orval emits the params type twice — once inline in api.ts and once in the types barrel — when both path and query params exist on the same operation.

**How to apply:** If `pnpm --filter @workspace/api-spec run codegen` produces TS errors mentioning `Params` duplicate identifiers, find the offending operationId in the spec and remove its query parameters (move filtering logic server-side instead).
