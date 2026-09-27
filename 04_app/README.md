# Meridian Studio Application

Slice 0 establishes the production runtime: Next.js/TypeScript, PostgreSQL/Prisma tenancy, authorization context, storage and job ports, health checks, structured logs, and cross-tenant tests.

```bash
npm install
npm run typecheck
npm test
npm run build
npm run db:validate
```

Copy `.env.example` to `.env`; Prisma CLI loads this file for migration commands and Next.js also loads it locally. No collector, decoder, embedding provider, billing provider, or public share is active in this slice.

`DATABASE_URL` is the constrained application connection. `DIRECT_URL` is reserved for migrations and must not be added to the Vercel runtime. `/api/health` reports process liveness; `/api/ready` verifies database connectivity.

After provisioning a development database, run `npm run test:rls` to execute the destructive-safe synthetic tenant-isolation suite. It creates uniquely named fixtures and removes them in a `finally` block; never point this command at staging or production.
