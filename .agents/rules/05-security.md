# Security Rules

Treat security as a first-class requirement.

Required controls where applicable:
- password hashing with bcrypt or Argon2
- JWT expiration
- refresh token expiration/revocation strategy
- role-based authorization
- DTO validation
- rate limiting on authentication endpoints
- CORS configuration
- security headers/Helmet where appropriate
- secrets in environment variables
- never commit .env or credentials
- validate uploaded file type and size
- server-side stock validation
- server-side price/total validation
- transaction-safe checkout

Never:
- log passwords, tokens, refresh tokens, or secrets
- return passwordHash
- trust role/userId sent by the client
- trust client-side price/total
- expose stack traces or raw database errors in production responses
- weaken authorization to make an E2E test pass
