# Badminton Shop — Fullstack Project Specification

> Project type: Fullstack E-commerce
> Domain: Badminton equipment
> Goal: Learn Backend with NestJS while building a real, deployable portfolio project for Junior/Middle Fullstack applications.
> Initial target: Complete MVP in ~1 month.
> Architecture: Modular Monolith.
> Realtime/WebSocket: Not required for MVP; optional later.

---

## 1. Project Overview

### Working name

**Badminton Shop**

A fullstack e-commerce website specializing in badminton products such as:

- Badminton rackets
- Shoes
- Shuttlecocks
- Grips
- Strings
- Bags
- Clothing
- Accessories

The project has two main areas:

1. Customer storefront
2. Admin management dashboard

### Main goal

The project should demonstrate that the developer can build a product end-to-end:

```text
UI
  ↓
Next.js
  ↓
REST API
  ↓
NestJS
  ↓
Business logic
  ↓
PostgreSQL
  ↓
Redis / Queue (later)
  ↓
Docker
  ↓
CI/CD
  ↓
Production VPS
```

The project should be intentionally scoped so that the MVP can be completed first. Advanced features are added only after the MVP is deployed.

---

# 2. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ (optional after MVP)
- JWT
- Swagger / OpenAPI
- Jest
- Supertest

## Infrastructure

- Docker
- Docker Compose
- Nginx
- Linux VPS
- GitHub or GitLab
- CI/CD

## External services

Potentially:

- Cloudinary or S3-compatible object storage for product images
- Email provider for transactional emails
- Payment provider later

---

# 3. Requirements

## 3.1 Customer Requirements

### Authentication

Customer can:

- Register
- Login
- Logout
- Refresh access token
- View profile
- Update profile
- Change password
- Forgot password
- Reset password

MVP authentication:

```text
Access Token
Refresh Token
```

### Product browsing

Customer can:

- View featured products
- View all products
- View product detail
- Search products
- Filter products
- Sort products
- Paginate products
- Browse products by category
- View product images
- View price
- View stock availability

### Shopping cart

Customer can:

- Add product to cart
- Update quantity
- Remove product
- Clear cart
- View cart
- View subtotal
- View total

Business rules:

- Quantity must be positive
- Quantity cannot exceed available stock
- Product must be active
- Price used for an order must be validated server-side

### Checkout

Customer can:

- Review cart
- Enter shipping information
- Select payment method
- Review order
- Place order

MVP payment methods:

- Cash on Delivery
- Mock online payment

Real payment integration is optional after MVP.

### Orders

Customer can:

- View own orders
- View order detail
- View order status
- Cancel order when allowed

Order statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

### Product images

Customer can:

- View product gallery
- View main image
- View additional images

---

# 4. Admin Requirements

## Admin authentication

Only ADMIN users can access admin APIs/pages.

## Product management

Admin can:

- Create product
- Update product
- Delete/deactivate product
- Upload product images
- Update stock
- Update price
- Assign category
- View product list

## Category management

Admin can:

- Create category
- Update category
- Delete/deactivate category
- View categories

## Order management

Admin can:

- View all orders
- View order detail
- Update order status
- View customer information
- View order items
- Cancel order when business rules allow

## User management

Admin can:

- View users
- View user detail
- Change user status
- View user orders

## Dashboard

Admin dashboard should show:

- Total users
- Total products
- Total orders
- Total revenue
- Recent orders

Advanced analytics are optional.

---

# 5. MVP Scope

## Must Have

- Customer registration/login
- JWT access + refresh token
- Role-based authorization
- Product CRUD
- Category CRUD
- Product listing
- Search
- Filter
- Sort
- Pagination
- Product detail
- Cart
- Checkout
- Order creation
- Order history
- Admin order management
- Stock validation
- Database transaction
- Validation
- Centralized error handling
- Swagger
- PostgreSQL
- Docker
- Production deployment
- CI/CD
- README

## Should Have

- Redis caching
- Refresh-token storage/session management with Redis
- Product image upload
- Email notification
- BullMQ background jobs
- Unit tests
- E2E tests
- Audit/activity logs

## Nice to Have / Later

- Real payment gateway
- Coupon
- Wishlist
- Product reviews
- Ratings
- WebSocket
- Realtime notifications
- Chat
- Advanced analytics
- Elasticsearch
- Recommendation system
- Multi-vendor marketplace
- Microservices

Do NOT implement advanced features before MVP is deployed.

---

# 6. Pages

## 6.1 Customer Pages

### Public

```text
/
```

Homepage

Sections:

- Hero/banner
- Featured products
- Popular products
- Categories
- Promotional section

```text
/products
```

Product listing

Features:

- Search
- Category filter
- Price filter
- Sort
- Pagination

```text
/products/[slug]
```

Product detail

Sections:

- Product image gallery
- Product name
- Price
- Stock
- Description
- Category
- Quantity selector
- Add to cart

```text
/categories/[slug]
```

Category product listing.

```text
/login
/register
/forgot-password
/reset-password
```

Authentication pages.

```text
/cart
```

Shopping cart.

```text
/checkout
```

Checkout.

```text
/orders
```

Customer order history.

```text
/orders/[id]
```

Order detail.

```text
/profile
```

Profile management.

---

# 7.2 Admin Pages

```text
/admin
```

Dashboard.

```text
/admin/products
/admin/products/create
/admin/products/[id]/edit
```

Product management.

```text
/admin/categories
```

Category management.

```text
/admin/orders
/admin/orders/[id]
```

Order management.

```text
/admin/users
/admin/users/[id]
```

User management.

---

# 8. User Flow

## 8.1 Browse Product

```text
Home
 ↓
Products
 ↓
Search / Filter / Sort
 ↓
Product Detail
 ↓
Add to Cart
```

## 8.2 Register

```text
Register
 ↓
Validate input
 ↓
Check email
 ↓
Hash password
 ↓
Create user
 ↓
Login / issue tokens
 ↓
Customer homepage
```

## 8.3 Login

```text
Login
 ↓
Validate credentials
 ↓
Verify password
 ↓
Issue access token
 ↓
Issue refresh token
 ↓
Authenticated user
```

## 8.4 Shopping Cart

```text
Product Detail
 ↓
Add to Cart
 ↓
Cart
 ↓
Update Quantity
 ↓
Remove / Continue Shopping
 ↓
Checkout
```

## 8.5 Checkout

```text
Cart
 ↓
Checkout
 ↓
Validate cart
 ↓
Validate product status
 ↓
Validate stock
 ↓
Calculate server-side prices
 ↓
Create order + order items
 ↓
Decrease stock
 ↓
Commit transaction
 ↓
Clear cart
 ↓
Order success
```

The order creation and stock update should use a database transaction.

## 8.6 Order

```text
Order created
 ↓
PENDING
 ↓
CONFIRMED
 ↓
PROCESSING
 ↓
SHIPPED
 ↓
DELIVERED
```

Alternative:

```text
PENDING
 ↓
CANCELLED
```

## 8.7 Admin Product Management

```text
Admin Login
 ↓
Admin Dashboard
 ↓
Products
 ↓
Create / Update / Deactivate
 ↓
Upload Images
 ↓
Save
```

## 8.8 Admin Order Management

```text
Admin Dashboard
 ↓
Orders
 ↓
Order Detail
 ↓
Update Status
 ↓
Customer sees updated status
```

---

# 9. Database ERD

Initial database entities:

```text
users
categories
products
product_images
carts
cart_items
orders
order_items
payments
```

Potential later entities:

```text
refresh_tokens
password_reset_tokens
wishlists
wishlist_items
reviews
coupons
audit_logs
notifications
```

## Relationship diagram

```text
┌──────────────┐
│    users     │
├──────────────┤
│ id           │
│ email        │
│ passwordHash │
│ role         │
│ status       │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:1
       ↓
┌──────────────┐
│    carts     │
├──────────────┤
│ id           │
│ userId       │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│  cart_items  │
├──────────────┤
│ id           │
│ cartId       │
│ productId    │
│ quantity     │
└──────┬───────┘
       │
       │ N:1
       ↓
┌──────────────┐
│   products   │
├──────────────┤
│ id           │
│ categoryId   │
│ name         │
│ slug         │
│ description  │
│ price        │
│ stock        │
│ status       │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ N:1
       ↓
┌──────────────┐
│  categories  │
├──────────────┤
│ id           │
│ name         │
│ slug         │
│ description  │
│ status       │
│ createdAt    │
│ updatedAt    │
└──────────────┘

products 1:N product_images
products 1:N cart_items

users 1:N orders

┌──────────────┐
│    orders    │
├──────────────┤
│ id           │
│ userId       │
│ orderNumber  │
│ status       │
│ subtotal     │
│ shippingFee  │
│ total        │
│ paymentMethod│
│ shippingName │
│ shippingPhone│
│ shippingAddr │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│ order_items  │
├──────────────┤
│ id           │
│ orderId      │
│ productId    │
│ productName  │
│ unitPrice    │
│ quantity     │
│ subtotal     │
└──────────────┘

orders 1:1 payments
```

## Important database design decisions

### Order items store product snapshot

`order_items` should store:

- productId
- productName
- unitPrice
- quantity
- subtotal

Do not rely only on the current product price.

Reason:

```text
Product price today = 500,000
Order created = 500,000
Product price next month = 600,000

Old order must still display 500,000.
```

### Money

Do not use floating-point values for money.

PostgreSQL should use `DECIMAL/NUMERIC` or an integer smallest currency unit, depending on the chosen design.

### Product status

Recommended:

```text
ACTIVE
INACTIVE
```

Deactivation is generally safer than physically deleting products that may already exist in order history.

---

# 10. API Design

Base URL:

```text
/api/v1
```

---

## 10.1 Auth

```http
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/me
```

---

## 10.2 Users

```http
GET    /users/me
PATCH  /users/me
PATCH  /users/me/password
```

Admin:

```http
GET    /users
GET    /users/:id
PATCH  /users/:id/status
```

---

## 10.3 Categories

Public:

```http
GET    /categories
GET    /categories/:slug
```

Admin:

```http
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
```

---

## 10.4 Products

Public:

```http
GET    /products
GET    /products/:id
GET    /products/slug/:slug
```

Query parameters:

```text
?page=1
&limit=12
&search=racket
&category=rackets
&minPrice=100000
&maxPrice=3000000
&sortBy=price
&sortOrder=asc
```

Admin:

```http
POST   /products
PATCH  /products/:id
DELETE /products/:id
PATCH  /products/:id/status
```

Images:

```http
POST   /products/:id/images
DELETE /products/:id/images/:imageId
```

---

# 10.5 Cart

```http
GET    /cart
POST   /cart/items
PATCH  /cart/items/:itemId
DELETE /cart/items/:itemId
DELETE /cart
```

Example:

```json
{
  "productId": "product-id",
  "quantity": 2
}
```

---

# 10.6 Orders

Customer:

```http
POST   /orders
GET    /orders
GET    /orders/:id
POST   /orders/:id/cancel
```

Admin:

```http
GET    /admin/orders
GET    /admin/orders/:id
PATCH  /admin/orders/:id/status
```

---

# 10.7 Payments

MVP:

```http
POST   /payments/mock
GET    /payments/:id
```

Later:

```text
Stripe / VNPay / another real provider
```

Payment implementation should not block the initial MVP.

---

# 11. NestJS Modules

Initial module structure:

```text
src/
├── app.module.ts
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   └── exceptions/
│
├── config/
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
│
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
│
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│
├── cart/
│   ├── cart.module.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── dto/
│
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── dto/
│
├── payments/
│   ├── payments.module.ts
│   ├── payments.controller.ts
│   └── payments.service.ts
│
└── redis/
    ├── redis.module.ts
    └── redis.service.ts
```

Later:

```text
queue/
mail/
uploads/
audit-log/
notifications/
```

---

# 12. NestJS Request Flow

For a normal protected API:

```text
HTTP Request
     ↓
Middleware
     ↓
Guard
     ↓
Interceptor
     ↓
Pipe / Validation
     ↓
Controller
     ↓
Service
     ↓
Prisma
     ↓
PostgreSQL
     ↓
Service
     ↓
Controller
     ↓
Interceptor
     ↓
HTTP Response
```

For example:

```text
POST /api/v1/orders
        ↓
JWT Guard
        ↓
Role/Authorization
        ↓
Validation Pipe
        ↓
OrdersController
        ↓
OrdersService
        ↓
Validate Cart
        ↓
Validate Stock
        ↓
Calculate Total
        ↓
Prisma Transaction
        ├── Create Order
        ├── Create Order Items
        ├── Decrease Stock
        └── Clear Cart
        ↓
Response
```

---

# 13. Error Handling

All APIs should eventually use a consistent response format.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error:

```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": []
}
```

Potential business error codes:

```text
EMAIL_ALREADY_EXISTS
INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
PRODUCT_NOT_FOUND
PRODUCT_OUT_OF_STOCK
INVALID_QUANTITY
CART_EMPTY
ORDER_NOT_FOUND
ORDER_CANNOT_BE_CANCELLED
```

Do not expose raw database errors to clients.

---

# 14. Redis Strategy

Redis should be introduced after the core MVP works.

Use cases:

### Product cache

```text
products:list:{queryHash}
product:{id}
```

### Refresh token/session

```text
refresh_token:{userId}
```

### Queue

```text
email queue
```

When product/category data changes, invalidate relevant cache.

---

# 15. Background Jobs

Optional after MVP.

```text
Order Created
      ↓
BullMQ
      ↓
Redis
      ↓
Email Worker
      ↓
Send Confirmation Email
```

Possible jobs:

```text
SEND_ORDER_CONFIRMATION
SEND_PASSWORD_RESET
SEND_ORDER_STATUS_UPDATE
```

---

# 16. Security Requirements

At minimum:

- Password hashing with bcrypt or Argon2
- Never return passwordHash
- JWT expiration
- Refresh token expiration
- Role-based authorization
- DTO validation
- Rate limiting on authentication endpoints
- CORS configuration
- Helmet/security headers where appropriate
- Environment variables for secrets
- Never commit `.env`
- Validate uploaded file types and size
- Never trust client-side price/total
- Server-side stock validation
- Database transactions for critical order operations

---

# 17. Testing Strategy

Do not attempt 100% coverage.

Prioritize business-critical areas.

## Unit tests

Test:

```text
AuthService
ProductsService
CartService
OrdersService
```

## E2E tests

Important flows:

```text
Register
Login
Create product
Add to cart
Checkout
Create order
Cancel order
Admin update order status
```

---

# 18. Docker

Development services:

```text
frontend
backend
postgres
redis
```

Example architecture:

```text
docker-compose
├── frontend
├── backend
├── postgres
└── redis
```

Production may use:

```text
Nginx
Frontend container
Backend container
PostgreSQL
Redis
```

---

# 19. CI/CD

Target flow:

```text
git push
    ↓
CI
    ├── install
    ├── lint
    ├── typecheck
    ├── unit tests
    ├── e2e tests
    └── build
          ↓
       Docker image
          ↓
         CD
          ↓
         VPS
          ↓
   docker compose pull
          ↓
   docker compose up -d
```

CI/CD implementation details can be decided later based on whether GitHub or GitLab is used.

---

# 20. 30-Day Suggested Roadmap

## Week 1 — Foundation

### Day 1

- Create repository
- Setup Next.js
- Setup NestJS
- Setup Docker
- Setup PostgreSQL
- Setup Prisma

### Day 2

- Prisma schema
- Migrations
- Seed data
- Basic NestJS architecture

### Day 3

- Register
- Password hashing
- Login

### Day 4

- Access token
- Refresh token
- Logout
- Auth guard

### Day 5

- Roles
- Admin guard
- Validation
- Global exception handling

### Day 6–7

- Category module
- Product module

---

## Week 2 — Storefront

### Day 8–9

- Product listing
- Search
- Filter
- Sort
- Pagination

### Day 10

- Product detail
- Product images

### Day 11–12

- Cart API
- Cart UI

### Day 13

- Checkout UI

### Day 14

- Order creation
- Transaction
- Stock handling

---

## Week 3 — Admin + Orders

### Day 15

- My Orders

### Day 16

- Order detail
- Cancel order

### Day 17–18

- Admin dashboard
- Product management

### Day 19

- Category management

### Day 20

- Order management

### Day 21

- User management
- UI polish

---

## Week 4 — Production

### Day 22

- Redis

### Day 23

- Cache products

### Day 24

- File upload

### Day 25

- Email / BullMQ if time permits

### Day 26

- Unit tests

### Day 27

- E2E tests

### Day 28

- Docker production setup
- Nginx

### Day 29

- CI/CD
- VPS deployment

### Day 30

- Fix bugs
- README
- Architecture diagram
- Screenshots
- CV project description

If a feature takes too long, skip it and protect the Day 29–30 deployment target.

---

# 21. Definition of Done

The MVP is considered complete when a real user can:

```text
Open website
    ↓
Register
    ↓
Login
    ↓
Browse badminton products
    ↓
Search/filter
    ↓
View product
    ↓
Add to cart
    ↓
Checkout
    ↓
Create order
    ↓
View order
```

And an admin can:

```text
Login
    ↓
Dashboard
    ↓
Create product
    ↓
Update product
    ↓
Manage stock
    ↓
View orders
    ↓
Update order status
```

The project must also be:

```text
Dockerized
    ↓
Tested at least for critical flows
    ↓
Documented
    ↓
Deployed to a real VPS
    ↓
Accessible through a public domain
```

---

# 22. Future Versions

After MVP:

## v1.1

- Redis caching
- Email
- BullMQ
- Better tests
- Audit logs

## v1.2

- Wishlist
- Reviews
- Ratings
- Coupon
- Discount

## v1.3

- Real payment
- Payment webhook
- Payment reconciliation

## v1.4

- WebSocket
- Realtime notifications

## v2

- Elasticsearch
- Recommendation
- Advanced analytics
- Inventory management

Microservices are NOT planned unless there is a strong learning reason later.

---

# 23. CV Positioning

Potential CV project title:

**Badminton Shop — Fullstack E-commerce Platform**

Possible description:

> Built a full-stack badminton e-commerce platform using Next.js, NestJS, PostgreSQL and Redis, implementing authentication, role-based authorization, product management, shopping cart, checkout and order management.

Backend-focused bullet:

> Designed RESTful APIs with NestJS and Prisma, implementing JWT authentication, refresh tokens, RBAC, validation, centralized exception handling and transactional order processing.

Infrastructure bullet:

> Containerized the application with Docker and implemented CI/CD deployment to a Linux VPS using Nginx.

Only include Redis, BullMQ, testing, payment, etc. in the CV after they are actually implemented.

---

# 24. Project Working Rules

These rules should guide future implementation discussions.

1. MVP first, advanced features later.
2. Prefer simple production-friendly architecture over unnecessary complexity.
3. No microservices for MVP.
4. No WebSocket for MVP.
5. Do not add a technology just for CV keywords.
6. Every important business rule must be enforced on the backend.
7. Client-side validation is not a replacement for backend validation.
8. Prices and order totals must be calculated/validated server-side.
9. Stock changes during checkout must be transaction-safe.
10. Do not expose internal database errors.
11. Never commit secrets.
12. Deploy the MVP before starting large advanced features.
13. When implementing a feature, understand the reason behind the architecture rather than copying code.
14. When asking for help in a future conversation, provide this file plus the current implementation/status so the discussion can continue from the correct project state.

---

# 25. Current Project Status

Status: **Planning**

Current phase:

```text
Requirements → Pages → User Flow → ERD → API → NestJS Modules
```

Next recommended implementation step:

```text
1. Finalize database schema
2. Initialize Git repository
3. Create Next.js project
4. Create NestJS project
5. Setup Docker Compose
6. Setup PostgreSQL + Prisma
7. Create initial migration
8. Create seed data
9. Start Authentication module
```

This document is the project's high-level source of truth. Update it when major architectural or scope decisions change.
