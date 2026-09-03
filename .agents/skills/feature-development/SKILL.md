---
name: feature-development
description: Implements a Badminton Shop feature as a verified vertical slice across API, database, frontend, tests, and browser flow.
---
# Feature Development

Use when implementing a new feature that crosses application layers.

## Process

1. Read relevant rules and project specification.
2. Inspect repository structure and existing patterns.
3. Clarify acceptance criteria.
4. Produce a short implementation plan.
5. Identify database/API/frontend impacts.
6. Implement the backend contract and business rules.
7. Implement database changes/migration if needed.
8. Implement frontend integration.
9. Add focused tests.
10. Run typecheck, lint, tests, and build as appropriate.
11. Verify the main user flow in the browser when possible.
12. Review the final diff for unrelated changes.
13. Summarize:
   - what changed
   - files changed
   - tests run
   - browser flow verified
   - known limitations

## Guardrails

- Do not add future-scope features.
- Do not invent API contracts if an existing contract can be inspected.
- Do not trust client prices/stock/authorization.
- Do not claim verification without running it.
