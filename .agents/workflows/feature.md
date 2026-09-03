---
name: feature
description: Implement a Badminton Shop feature end-to-end and verify it.
---

# Feature Workflow

## Step 1 — Understand
- Read relevant project rules.
- Inspect the repository.
- Identify existing patterns.
- Read the relevant product requirements.
- State acceptance criteria.

## Step 2 — Plan
Create a concise plan covering:
- database
- API
- backend business rules
- frontend
- tests
- browser verification

Do not code yet if the requirements or architecture are materially ambiguous.

## Step 3 — Implement
Implement the smallest vertical slice:
database → API → frontend → tests.

Reuse existing abstractions.

## Step 4 — Verify
Run:
- focused tests
- typecheck
- lint
- build when appropriate

Then verify the primary user flow in the browser when possible.

## Step 5 — Review
Check:
- no unrelated changes
- no secrets
- authorization
- server-side price/stock validation
- transaction safety
- responsive/accessibility behavior

## Step 6 — Report
Return:
- summary
- changed files
- tests/commands run
- browser flow verified
- known issues
