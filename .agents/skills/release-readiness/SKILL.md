---
name: release-readiness
description: Checks whether a Badminton Shop release is safe to deploy to a Linux VPS with Docker, Nginx, PostgreSQL, and CI/CD.
---
# Release Readiness

Verify:
- environment variables documented
- no secrets committed
- migrations are deployable
- Docker build works
- services have correct networking/ports
- health checks or equivalent verification exist
- API/frontend build succeeds
- lint/typecheck/tests pass
- critical browser flow works
- Nginx/domain assumptions are documented
- rollback steps are known
- production logs do not expose secrets

Report blockers separately from warnings.
