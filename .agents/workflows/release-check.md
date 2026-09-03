---
name: release-check
description: Prepare the Badminton Shop for production deployment.
---

# Release Check Workflow

1. Inspect Docker/Compose configuration.
2. Inspect CI/CD configuration.
3. Inspect environment variables and secret references.
4. Verify Prisma migration strategy.
5. Run lint/typecheck/tests/build.
6. Verify production container startup.
7. Verify frontend → API connectivity.
8. Verify Nginx/reverse proxy assumptions.
9. Verify database/Redis dependencies.
10. Verify health and rollback procedures.
11. Report blockers, warnings, and deployment steps.

Never execute destructive production commands without explicit approval.
