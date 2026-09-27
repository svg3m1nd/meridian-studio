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

## Verification

- Prisma generation and schema validation passed
- TypeScript passed
- 11 unit tests passed
- Production build passed
- npm audit reports zero vulnerabilities
- Static migration inventory confirmed 13 tables, 20 policies, and nine forced-RLS tables
- Vercel production build succeeded from the GitHub `main` branch

## Remaining before Slice 1 approval

- Provision the development PostgreSQL environment
- Review and apply the prepared migrations
- Execute the RLS integration-test plan against PostgreSQL
- Register OAuth credentials
- Add database integration tests for creation, isolation, audit events, and baseline replacement
- Add organization switching when a user belongs to multiple organizations
