# Slice 0 Migration Notes

No database migration was executed. Two reviewable migrations now exist:

- `20260926182700_initial` — 13 application and Auth.js tables, constraints, and indexes
- `20260926182800_rls` — transaction-context helpers, 20 policies, and forced RLS on nine tenant tables

The validated initial schema defines organizations, users, memberships, workspaces, workspace grants, and immutable audit events. Before the first migration:

1. Select the managed PostgreSQL environment.
2. Confirm authentication-provider identity mapping.
3. Add database row-level security policies.
4. Review deletion behavior and audit-event retention.
5. Generate and review the migration SQL before applying it.

## Preferred deployment target

Supabase is the accepted preferred deployment foundation. At deployment time:

1. Create separate development, staging, and production projects.
2. Configure pooled application and direct migration connection strings separately.
3. Enable required extensions only after recording their versions and schemas.
4. Apply reviewed Prisma migrations with a direct database connection.
5. Add and test workspace-scoped RLS policies before loading client data.
6. Configure Storage buckets, lifecycle rules, and an independent backup process.
7. Create private `pgmq` queues and deploy external workers with least-privilege credentials.
8. Keep Auth.js secrets and Supabase service-role credentials in managed server-side secret storage.

This checkpoint prevents an unreviewed physical schema from being applied to an external database.

The application now sets `app.user_id`, `app.organization_id`, and `app.workspace_id` with transaction-local `set_config` calls before tenant access. Live RLS execution tests remain pending because Docker is unavailable and no development Supabase project has been provisioned.
