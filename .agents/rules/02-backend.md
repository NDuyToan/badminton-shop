# Backend Rules — NestJS

## General

- TypeScript strictness is preferred.
- Follow NestJS conventions already used by the repository.
- Keep controllers thin.
- Put business rules in services.
- Use DTOs for request validation.
- Never trust client-provided prices, totals, stock, roles, or ownership.
- Never return password hashes or sensitive credentials.
- Do not expose raw Prisma/database errors to API consumers.

## Validation and errors

Use the project's established validation mechanism. If none exists, use NestJS
validation with DTOs and class-validator/class-transformer only if already
available or explicitly approved.

Use stable business error codes where the project defines them, such as:
EMAIL_ALREADY_EXISTS, INVALID_CREDENTIALS, UNAUTHORIZED, FORBIDDEN,
PRODUCT_NOT_FOUND, PRODUCT_OUT_OF_STOCK, INVALID_QUANTITY, CART_EMPTY,
ORDER_NOT_FOUND, ORDER_CANNOT_BE_CANCELLED.

## Authentication / authorization

- Access token + refresh token are the MVP model.
- Admin APIs/pages require ADMIN authorization.
- Reuse the existing public-route decorator/guard strategy if present.
- Never bypass authorization because a route is being called from the admin UI.

## Orders

Order creation must:
1. Validate authenticated user.
2. Validate cart.
3. Validate product active status.
4. Validate stock.
5. Calculate authoritative prices server-side.
6. Create order and order items.
7. Decrease stock.
8. Clear cart as appropriate.
9. Commit all critical operations atomically using a database transaction.

Order items must preserve product snapshots such as productName, unitPrice,
quantity, and subtotal.

## Money

Never use floating-point arithmetic for monetary business logic. Follow the
database schema's NUMERIC/DECIMAL or integer-smallest-unit design.

## API

Target API base path: `/api/v1`.

Maintain consistent success/error response envelopes if they already exist.
Document public/admin APIs through Swagger when the project uses Swagger.
