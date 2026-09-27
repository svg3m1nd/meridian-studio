# DEC-005 — Preferred Supabase Deployment Foundation

- **Date:** 2026-09-26
- **Status:** Accepted for deployment planning; not yet provisioned
- **Decision owner:** User

## Decision

Use Supabase as Meridian Studio's preferred managed foundation when deployment begins:

- PostgreSQL for canonical transactional data
- Supabase Storage for initial raw artifacts and exports
- `pgvector` for bounded searchable embeddings
- Supabase Queues/`pgmq` for durable job coordination
- Separate projects for development, staging, and production

Retain Prisma for migrations, Auth.js for initial authentication, Meridian's server-side authorization layer, PostgreSQL RLS, and separately deployed analysis workers.

## Explicit boundaries

1. Meridian organizations and workspaces are tenants; Supabase projects are environments.
2. The service-role key never reaches a browser or public share.
3. Object storage receives its own backup, retention, and deletion plan.
4. Tenant custom domains are implemented at the web-hosting layer.
5. Large multi-vector sets and FDEs may use object storage while PostgreSQL retains versioned metadata.
6. Final pricing, regions, compliance, connection limits, and extension availability are rechecked immediately before provisioning.

## Deployment trigger

Provision infrastructure only when the application needs persistent integration testing or a staging environment. Before applying the initial migration, review generated SQL, RLS policies, authentication identity mapping, backup policies, and secret management.
