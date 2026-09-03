# Badminton Shop — Antigravity Agent Pack

This `.agents` pack is tailored to the Badminton Shop project specification.

## Structure

- `rules/` — persistent project constraints
- `agents/` — specialist custom agents
- `skills/` — focused reusable capabilities
- `workflows/` — repeatable `/workflow-name` processes

## Core principle

MVP first. Keep the architecture simple and production-friendly. Do not introduce
advanced features merely for CV keywords.

## Suggested first commands

- `/feature` — implement a complete feature end-to-end
- `/bug-fix` — investigate and fix a bug safely
- `/review` — review current changes
- `/verify` — run critical verification
- `/security-review` — security-focused review
- `/release-check` — production-readiness check

## Suggested custom agents

- `architect` — architecture and implementation planning
- `backend` — NestJS API/domain implementation
- `frontend` — Next.js UI/data-flow implementation
- `database` — Prisma/PostgreSQL/schema/migration work
- `qa` — tests and browser verification
- `reviewer` — senior code review
- `devops` — Docker/CI/CD/Nginx/VPS work

## Important

The project specification says the project is currently in Planning status.
The agents must inspect the actual repository before assuming a module, file,
library, or implementation exists.

If the current code differs from the specification, treat the current code as
the implementation source of truth and the specification as the product target.
Do not silently reconcile conflicts; explain them and ask when the decision
affects architecture or business behavior.
