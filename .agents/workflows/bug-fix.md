---
name: bug-fix
description: Investigate, reproduce, fix, and verify a Badminton Shop bug without introducing unrelated changes.
---

# Bug Fix Workflow

1. Reproduce the bug if possible.
2. Inspect logs, stack traces, network calls, and relevant code.
3. Identify the root cause before editing.
4. Check whether the issue is frontend, API, database, infrastructure, or a combination.
5. Implement the smallest correct fix.
6. Add or update a regression test.
7. Run focused verification.
8. Run broader typecheck/lint/test when appropriate.
9. Browser-verify user-facing behavior.
10. Report root cause, fix, verification, and remaining risks.

Do not mask symptoms or weaken validation/security.
