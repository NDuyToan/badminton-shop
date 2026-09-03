---
name: security-review
description: Run a focused security assessment of the current Badminton Shop implementation.
---

# Security Review Workflow

1. Inspect auth/guards/strategies.
2. Inspect admin authorization.
3. Inspect ownership checks.
4. Inspect DTO validation.
5. Inspect token handling and logging.
6. Inspect secrets/environment configuration.
7. Inspect upload handling.
8. Inspect order/cart price and stock validation.
9. Inspect Prisma queries for unsafe access patterns.
10. Run relevant tests.
11. Report findings by severity and give remediation steps.

Do not modify code unless explicitly requested.
