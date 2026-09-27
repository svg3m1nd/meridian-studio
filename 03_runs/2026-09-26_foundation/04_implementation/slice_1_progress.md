# Slice 1 Progress — Portfolio and Baseline Setup

## Implemented

- Auth.js database sessions with GitHub OAuth adapter
- Protected client portfolio
- Organization-authorized workspace creation
- Workspace grant and immutable audit-event creation
- Tenant-scoped baseline setup for canonical business identity, aliases, locale, market, competitors, topics, and queries
- Central server-side workspace authorization DAL
- Transaction-scoped PostgreSQL tenant context for every protected read and write
- Zod validation and bounded list inputs
- Reviewable initial migration with 13 tables
- Twenty RLS policies with forced RLS on nine tenant tables
- RLS integration-test plan
- Vercel staging deployment with automatic GitHub builds
- Separate runtime and migration database connection contracts
- Supabase provisioning and least-privilege runtime grant runbook
- Database readiness endpoint and GitHub CI workflow
- Provisioned Supabase development PostgreSQL with separate migration/runtime roles
- Repeatable live two-tenant RLS regression test with automatic fixture cleanup

## Verification

- Prisma generation and schema validation passed
- TypeScript passed
- 13 unit tests passed
- Production build passed
- npm audit reports zero vulnerabilities
- Static migration inventory confirmed 13 tables, 20 policies, and nine forced-RLS tables
- Vercel production build succeeded from the GitHub `main` branch
- Both reviewed Prisma migrations applied successfully to Supabase development
- Live runtime-role checks confirmed nine forced-RLS tables, 20 policies, no Data API grants, tenant isolation, role enforcement, audit immutability, and fixture cleanup
- Vercel production readiness probe returned HTTP 200 with the constrained Supabase runtime connection

## Remaining before Slice 1 approval

- Register OAuth credentials
- Add database integration tests for full creation and baseline-replacement flows
- Add organization switching when a user belongs to multiple organizations
