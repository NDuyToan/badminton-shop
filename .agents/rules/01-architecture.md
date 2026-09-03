# Architecture Rules

- Prefer the existing Modular Monolith structure.
- Keep domain modules cohesive: auth, users, categories, products, cart, orders, payments.
- Controllers should be thin.
- Business logic belongs in services/domain-level code.
- Prisma access belongs behind the established data-access pattern.
- Reuse common guards, decorators, pipes, filters, interceptors, and utilities.
- Do not create duplicate abstractions when an existing abstraction is sufficient.
- Do not introduce a library for a problem already solved by the current stack.
- Do not perform broad refactors while implementing an unrelated feature.
- Keep public API contracts explicit and versioned under `/api/v1` when that convention
  is present in the project.
- Preserve backward compatibility when changing an API already consumed by a client.
- Before architectural changes, explain trade-offs and impact.

## Request flow

For protected APIs, preserve the project's equivalent of:

HTTP → middleware → guards → interceptors/pipes → controller → service → Prisma → DB.

## Feature boundaries

A feature that spans frontend and backend should be implemented in vertical slices:
contract → backend → frontend → tests → browser verification.
