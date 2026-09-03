---
name: security-review
description: Performs a focused security review of Badminton Shop authentication, authorization, validation, secrets, uploads, and e-commerce business boundaries.
---
# Security Review

Check:
- JWT expiration and refresh-token handling
- password hashing
- credential/token leakage
- RBAC
- IDOR/ownership checks
- admin-only routes
- DTO validation
- rate limiting for auth
- CORS/security headers
- file upload validation
- secret management
- client-trusted prices/totals
- stock manipulation
- order ownership
- raw error leakage

Classify findings Critical/High/Medium/Low.
Do not weaken security controls to make a feature work.
