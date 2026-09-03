# Badminton Shop — Project Context

## Product

Badminton Shop is a fullstack e-commerce platform focused on badminton equipment:
rackets, shoes, shuttlecocks, grips, strings, bags, clothing, and accessories.

The two primary areas are:
- Customer storefront
- Admin management dashboard

## Goal

Build a real, deployable portfolio project while learning backend engineering
with NestJS.

## Architecture

- Modular Monolith
- REST API
- Next.js frontend(s)
- NestJS backend
- PostgreSQL + Prisma
- Redis is optional after MVP
- BullMQ is optional after MVP
- Docker / Docker Compose
- Nginx
- Linux VPS
- CI/CD

Do NOT introduce microservices or WebSockets for MVP.

## Source of truth

When implementing:
1. Inspect the repository first.
2. Inspect package.json files and existing conventions.
3. Inspect the Prisma schema and migrations.
4. Inspect existing modules/components before creating new ones.
5. Preserve existing working patterns unless there is a concrete reason to change them.
6. If the specification and current implementation disagree, report the discrepancy.

## Scope discipline

MVP comes before advanced features.

MVP includes:
- authentication
- JWT access + refresh tokens
- RBAC
- product/category CRUD
- product browsing/search/filter/sort/pagination
- product detail
- cart
- checkout
- order creation/history/admin order management
- stock validation
- database transactions
- validation
- centralized error handling
- Swagger
- PostgreSQL
- Docker
- deployment
- CI/CD
- README

Do not start wishlist, reviews, coupons, real payments, WebSockets, Elasticsearch,
recommendations, or microservices before MVP deployment unless explicitly requested.

## Business invariants

Backend enforcement is mandatory for:
- product active status
- stock availability
- quantity > 0
- order price/total calculation
- authorization
- order cancellation rules
- transaction-safe stock changes

Client validation is UX only; it is never the security boundary.
