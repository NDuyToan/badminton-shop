# Frontend Rules — Next.js

## General

- Follow the repository's current Next.js version and App Router conventions.
- Prefer Server Components by default where appropriate.
- Use Client Components only for interactivity/browser-only behavior.
- Do not add `"use client"` without a reason.
- Reuse existing UI components and design tokens.
- Do not introduce a second UI system unless explicitly requested.
- Keep page components focused on composition.
- Put reusable data/API behavior in the project's established data-access layer.
- Avoid duplicating business rules in the client.

## Data and forms

Preferred project stack:
- TanStack Query for server state
- React Hook Form for forms
- Zod for client-side schema validation when already configured

Client validation improves UX but does not replace backend validation.

## E-commerce UX

Product pages should clearly represent:
- product name
- price
- stock availability
- images
- description
- category
- quantity
- add-to-cart action

Cart and checkout must handle loading, empty, error, unavailable/out-of-stock,
and success states.

## Auth

Do not expose access/refresh tokens unnecessarily to client-side code.
Follow the repository's existing secure token/session architecture.

## Accessibility

Interactive controls need accessible labels, keyboard usability, visible states,
and sensible semantic HTML.

## Performance

Avoid unnecessary client-side rendering, excessive requests, duplicate fetching,
and large client bundles. Use pagination for product/order lists.
