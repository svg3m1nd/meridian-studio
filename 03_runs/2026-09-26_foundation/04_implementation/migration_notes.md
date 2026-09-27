# Database Migration Notes

Subsequent reviewed migrations:

- `20260927080000_workspace_owner_returning_rls` - authorize organization owners/admins directly during Prisma workspace `INSERT ... RETURNING`, while delegated users continue through explicit workspace grants.
- `20260927090000_workspace_archive` - add audited, non-destructive workspace lifecycle support through `archivedAt` and an organization/archive lookup index.

The Supabase development project was provisioned, with the initial migrations applied on 2026-09-26 and four reviewed migrations applied in total by 2026-09-27:

- `20260926182700_initial` — 13 application and Auth.js tables, constraints, and indexes
- `20260926182800_rls` — transaction-context helpers, 20 policies, and forced RLS on nine tenant tables

The validated initial schema defines organizations, users, memberships, workspaces, workspace grants, and immutable audit events. The pre-application review confirmed:

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

This checkpoint prevented an unreviewed physical schema from being applied to the external database.

The application sets `app.user_id`, `app.organization_id`, and `app.workspace_id` with transaction-local `set_config` calls before tenant access. Live execution through `meridian_runtime` confirmed the expected owner, analyst, viewer, outsider, missing-context, cross-tenant, and immutable-audit behavior. The automated test also confirmed nine forced-RLS tables, 20 policies, no Data API role grants, and complete synthetic-fixture cleanup.

Deployment hardening now separates `DIRECT_URL` for the privileged migration role from `DATABASE_URL` for a `NOBYPASSRLS` runtime role. The Vercel application must never use the migration, `postgres`, or service-role credential. Provisioning steps and runtime grants are recorded in `supabase_provisioning.md` and `04_app/prisma/supabase_runtime_grants.sql`.
