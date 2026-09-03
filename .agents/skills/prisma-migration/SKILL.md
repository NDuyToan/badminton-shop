---
name: prisma-migration
description: Safely changes the Badminton Shop Prisma/PostgreSQL schema and migration history while protecting existing data and historical orders.
---
# Prisma Migration

1. Inspect schema, migrations, and affected code.
2. Explain data impact.
3. Check relations, uniqueness, nullability, indexes, and historical data.
4. Make the smallest safe schema change.
5. Generate the migration using the project's normal workflow.
6. Verify Prisma client generation.
7. Run affected tests/typecheck.
8. Never reset/drop the database unless explicitly requested.
9. If a migration is destructive, stop and ask for confirmation unless the user explicitly approved it.
