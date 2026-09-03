---
name: verify
description: Verify the current Badminton Shop implementation using automated checks and critical browser flows.
---

# Verification Workflow

1. Inspect project scripts to determine the correct commands.
2. Run typecheck.
3. Run lint.
4. Run focused unit tests.
5. Run E2E tests if configured.
6. Run build when appropriate.
7. Start the application if needed.
8. Browser-verify:
   - public product browsing
   - login
   - add to cart
   - checkout/order flow
   - admin authorization
   - admin order management
9. Fix failures only when requested or when this workflow is being used as a repair workflow.
10. Report exactly what passed/failed.
