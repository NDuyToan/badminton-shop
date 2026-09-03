# Testing Rules

Do not optimize for 100% coverage.

Prioritize business-critical behavior.

## Unit-test priority

- AuthService
- ProductsService
- CartService
- OrdersService
- critical business rules

## E2E priority

- register
- login
- product browsing
- add to cart
- checkout
- order creation
- order cancellation
- admin order status update
- admin authorization

## Verification loop

After meaningful changes:
1. Run focused tests.
2. Run typecheck.
3. Run lint.
4. Run broader tests/build when appropriate.
5. Use browser verification for user-facing flows.
6. Fix failures rather than hiding them.
7. Report what was actually verified.

Never claim a test passed if it was not run.
