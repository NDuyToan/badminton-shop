# Database Rules — Prisma/PostgreSQL

- Prisma is the ORM.
- PostgreSQL is the primary database.
- Schema changes must be represented by Prisma migrations.
- Never edit production data manually as part of normal feature development.
- Never silently delete data that may be referenced by historical orders.
- Prefer deactivation for products/categories that have historical references.

## Core entities

users
categories
products
product_images
carts
cart_items
orders
order_items
payments

Potential later entities:
refresh_tokens, password_reset_tokens, wishlists, wishlist_items, reviews,
coupons, audit_logs, notifications.

## Relationships

- user 1:1 cart
- cart 1:N cart_items
- product 1:N cart_items
- category 1:N products
- product 1:N product_images
- user 1:N orders
- order 1:N order_items
- order 1:1 payment

## Historical correctness

Order items must store product snapshots. Historical orders must not change
when the current product name or price changes.

## Migration safety

Before changing a schema:
1. Inspect current schema.
2. Inspect relevant migrations.
3. Check existing data implications.
4. Identify destructive operations.
5. Explain risks for destructive changes.
6. Generate/apply migration using the project's established commands.
7. Verify generated Prisma client and affected code.

Do not reset or drop the database unless explicitly requested.
