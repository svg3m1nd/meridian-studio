# DEC-006 — Separate Migration and Runtime Database Roles

- **Date:** 2026-09-26
- **Status:** Accepted
- **Decision owner:** User

## Decision

Use separate PostgreSQL identities for Meridian schema administration and application traffic:

- `meridian_migrate` uses `DIRECT_URL`, may bypass RLS, and exists only for reviewed migrations and controlled administration.
- `meridian_runtime` uses `DATABASE_URL`, cannot bypass RLS, and is the only database identity available to the Vercel web application.

The runtime connection uses Supavisor transaction mode for serverless traffic. Migration commands use a session or direct connection. Tenant context remains transaction-local so it is compatible with transaction pooling.

## Rationale

Supabase's Prisma setup uses a privileged role for migrations. Reusing that identity at runtime would bypass Meridian's PostgreSQL row-level security and reduce tenant isolation to application code alone. Separate credentials preserve least privilege and allow live RLS tests to represent actual production behavior.

## Consequences

1. Vercel receives `DATABASE_URL` but never `DIRECT_URL`.
2. Local migration operators and protected CI environments may receive both URLs.
3. Runtime grants are applied explicitly after migrations.
4. Readiness checks use the runtime identity.
5. Password rotation is independent for application and migration access.
6. A Supabase service-role or `postgres` connection is never substituted for the runtime URL.

## Verification

- Query `pg_roles` and prove `meridian_runtime.rolbypassrls = false`.
- Run the cross-tenant RLS suite through `meridian_runtime`.
- Confirm Vercel has no `DIRECT_URL` or service-role secret.
- Confirm `/api/ready` succeeds with the runtime transaction-pooler URL.
