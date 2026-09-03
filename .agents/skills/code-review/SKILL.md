---
name: code-review
description: Reviews Badminton Shop changes for correctness, security, data integrity, business rules, architecture, performance, and test quality.
---
# Code Review

Do not edit code during review.

Check:
- business correctness
- auth/RBAC
- ownership/IDOR
- input validation
- client-trusted values
- stock and transaction safety
- money precision
- historical order snapshots
- error exposure
- Prisma query quality
- React/Next rendering
- accessibility
- performance
- test coverage of critical behavior

Return findings by severity with file/area and recommended fix.
