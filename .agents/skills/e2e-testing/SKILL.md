---
name: e2e-testing
description: Creates and executes risk-based end-to-end verification for Badminton Shop customer and admin flows.
---
# E2E Testing

Prioritize:
1. Register
2. Login
3. Product browsing
4. Add to cart
5. Checkout
6. Order creation
7. Order cancellation
8. Admin login/authorization
9. Admin product management
10. Admin order status management

Include negative cases:
- invalid credentials
- unauthorized admin access
- inactive product
- out-of-stock product
- quantity beyond stock
- empty cart
- invalid order cancellation

Use browser verification for UI flows when available.
