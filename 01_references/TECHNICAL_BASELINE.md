# Technical Baseline

## Application

- TypeScript web application using a server-rendered React framework
- PostgreSQL as the canonical transactional store
- Object storage for immutable raw captures and exports
- Vector extension or service only as a retrieval accelerator
- Durable queue and isolated workers for crawling, retrieval, extraction, and evaluation
- Tenant-aware server data-access layer with database row-level security before production

## Service boundaries

- Web/API: authentication, workspace UI, configuration, read models
- Scheduler: recurring observation plans and retries
- Collectors: websites, search engines, AI engines, local/review sources
- Extractors: documents, passages, entities, claims, citations, links
- Evaluators: evidence states and trust gates
- Projection builders: histograms, mirrors, reports, action candidates

## Security

- Encrypt provider credentials with managed KMS
- Treat crawled text and model output as untrusted
- Sign worker callbacks and isolate queues by environment
- Log administrative/data mutations immutably
- Use short-lived public share tokens
- Verify custom domains before routing tenant content
- Prevent workspace IDs from becoming authorization mechanisms

## Operational requirements

- Idempotent jobs
- Per-step status and retry history
- Dead-letter handling
- Source throttling and robots/policy controls
- Cost and token accounting per run/workspace
- Capture retention policies
- Export/delete workflows
- Health, latency, failure, and backlog telemetry

## Deferred choices

Specific hosting, auth, queue, object storage, vector, billing, and AI providers remain replaceable until the product spec stage records a decision.

## Preferred deployment foundation

When Meridian is ready to deploy, use Supabase as the preferred managed foundation for PostgreSQL, object storage, `pgvector`, and Postgres-native queues, subject to a final production-readiness and pricing review.

- Use separate Supabase projects for development, staging, and production—not one project per Meridian tenant.
- Keep Prisma as schema and migration authority.
- Keep Auth.js as the initial authentication boundary, storing its records in PostgreSQL.
- Enforce tenancy in Meridian's server data-access layer and PostgreSQL row-level security.
- Keep service-role credentials server-only.
- Run crawling, decoding, extraction, embedding, and MUVERA workloads in isolated workers; queues coordinate but do not execute the workload.
- Back up object storage separately because database backups do not include stored objects.
- Route tenant-facing custom domains through Meridian's frontend hosting layer; a Supabase API custom domain does not provide per-tenant white labeling.
- Preserve standard PostgreSQL and object-storage interfaces so another provider can replace Supabase without changing the canonical domain.
