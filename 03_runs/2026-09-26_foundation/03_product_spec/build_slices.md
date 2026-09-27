# Dependency-Ordered Build Slices

Each slice must be demonstrable, tested, and deployable. Later slices may not bypass earlier authorization or provenance contracts.

## Slice 0 — Runtime foundation

**Outcome:** A reproducible local and hosted application shell.

- TypeScript server-rendered React application
- PostgreSQL and Prisma migration baseline
- Authentication adapter and session handling
- Organization/workspace request context
- Object-storage and job-run interfaces with local adapters
- Structured logs, request IDs, health endpoints, test harness, CI

**Exit:** A seeded user can sign in and reach an empty authorized organization shell; cross-tenant access tests pass.

## Slice 1 — Multi-client portfolio and baseline setup

**Outcome:** An agency can create and configure a client.

- Organization switcher and role enforcement
- Workspace CRUD
- Client entity, aliases, locale, competitors, topics, and queries
- Setup completeness projection
- Audit records for mutations

**Exit:** J1 passes end to end with two tenants and no leakage.

## Slice 2 — Import and observation pipeline

**Outcome:** Real bounded evidence enters the canonical model.

- Versioned CSV/JSON templates
- Validation preview and row errors
- Idempotent import submission
- Run/step state machine
- Raw artifact persistence
- Encoded-payload metadata, original/decoded hashes, and allowlisted decoder interface
- Ranked result, answer, and citation normalization
- Retry and partial-failure UI

**Exit:** The fixture plus one user import produces reproducible canonical observations.

## Slice 3 — Evaluation and provenance

**Outcome:** Evidence becomes reviewable findings.

- Eight system layer definitions
- Versioned checks and deterministic rule evaluator
- Evidence states and evidence links
- Signals with raw/normalized separation
- Versioned query-facet and passage embedding sets
- Exact bounded multi-vector scoring and explainable information-gain components
- Optional FDE/MUVERA adapter boundary for later scale benchmarking
- Evidence drawer and chronological log
- Finding review workflow

**Exit:** Every generated finding can be traced to immutable evidence and reproduced from its versions.

## Slice 4 — The Map

**Outcome:** The approved visual concept becomes the primary analytical experience.

- Layered multiplex visualization
- Synchronized graph/score legend
- Accessible table equivalent
- Selection, filters, freshness, evidence distribution, and top findings
- Layer detail route
- Empty, loading, stale, partial, and error states

**Exit:** J3 and J4 meet accessibility and provenance criteria without an aggregate ranking score.

## Slice 5 — Mirror and action plan

**Outcome:** Analysts can compare and act.

- Competitor sets and equivalence contract
- Mirror projection and not-comparable states
- Finding-to-action workflow
- Ownership, priority, due date, status, and audit trail

**Exit:** J5 and J6 work for one client and up to five competitors.

## Slice 6 — Branded sharing

**Outcome:** Agencies can deliver approved results.

- Brand profile editor
- Share section selection and preview
- Hashed, revocable, expiring share tokens
- Public read-only presentation
- Export-ready projection boundary

**Exit:** J7 publishes a branded report with no restricted or unapproved data.

## Post-MVP slices

1. Direct collection adapters and scheduling
2. Verified custom domains
3. Client self-service access
4. Tenant-defined layer/check configuration
5. Billing and entitlement automation
6. Advanced vector and graph retrieval assistance

## Recommended implementation order

Begin with Slice 0 and Slice 1. Do not start the polished Map visualization until real canonical observations and evidence can drive it; use the fixture for early visual prototyping only.
