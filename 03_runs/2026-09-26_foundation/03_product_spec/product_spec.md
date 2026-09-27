# Meridian Studio MVP Product Specification

## Product job

Enable an agency analyst to turn a bounded set of search and answer-engine observations into a defensible, branded multi-graph assessment for one client and selected competitors.

## MVP boundary

The MVP supports one complete workflow:

1. Sign in and select an organization.
2. Create a client workspace.
3. Define the business entity, competitors, topics, and queries.
4. Import structured observations from one ranked-search surface and one generated-answer surface.
5. Run deterministic extraction and evidence evaluation.
6. Compute query-facet coverage and explainable marginal information gain from multi-vector representations.
7. Explore The Map, layer detail, evidence, and mirror comparison.
8. Review findings and convert them into actions.
9. Publish a revocable, branded, read-only share.

Direct provider collection, schedules, custom domains, billing, and tenant-defined evaluation rules follow after the import-first workflow is proven.

## Roles

| Role | MVP capability |
|---|---|
| Owner | Organization, branding, members, every workspace, shares |
| Admin | Members, workspaces, configuration, observations, shares |
| Analyst | Workspace setup, imports, evaluations, findings, actions |
| Reviewer | Approve/reject findings and actions; publish shares |
| Viewer | Read approved workspace views and evidence allowed by policy |

All routes re-authorize organization membership and workspace access server-side.

## Information architecture

```text
Organization switcher
├── Portfolio
│   └── Client workspaces
├── Workspace
│   ├── Overview — The Map
│   ├── Layers
│   │   └── Layer detail
│   ├── Evidence
│   │   ├── Observations
│   │   ├── Findings
│   │   └── Evidence log
│   ├── Compare — Mirror
│   ├── Actions
│   └── Configure
│       ├── Business identity
│       ├── Competitors
│       ├── Topics and queries
│       ├── Sources and imports
│       └── Members
└── Organization settings
    ├── Brand
    ├── Members
    └── Security
```

## Primary journeys

### J1 — Create a client baseline

An Admin creates a workspace, enters canonical business identity and aliases, selects locale, adds up to five competitors, and defines topics and queries. The system shows setup completeness without calling it a ranking score.

### J2 — Import observations

An Analyst downloads the import template, supplies ranked results and generated answers with citations, previews validation, fixes row-level errors, and submits an idempotent import. Processing exposes step status: ingest, normalize, resolve, extract, evaluate, project.

### J3 — Explore The Map

The overview opens with eight stacked graph planes and a graph/score legend. Each row and plane are the same selection control. Selecting a layer highlights its topology and opens a summary with evidence-state distribution, material signals, top findings, and freshness. No composite ranking score is displayed.

### J4 — Trace evidence

From any node, edge, signal, or finding, the user opens an evidence drawer showing the source, captured content, passage or locator, observation conditions, rule version, confidence, and review history.

### J5 — Compare competitors

An Analyst selects the client plus competitors and an equivalent query/surface/window. Meridian shows layer-by-layer differences and labels non-equivalent or missing observations. A comparison cannot silently mix incompatible contexts.

### J6 — Review and act

The system proposes findings. A Reviewer approves, rejects, or supersedes them. Approved findings can become actions with owner, priority, due date, affected layers, evidence, and expected outcome.

### J7 — Share a report

A Reviewer chooses approved sections, previews tenant branding, sets expiration, and publishes a revocable read-only link. Raw restricted evidence and internal notes are excluded by default.

## Screen contracts

### Portfolio

- Lists accessible workspaces, last successful observation, evidence freshness, open actions, and processing failures.
- Empty state creates the first workspace.
- Organization switching invalidates workspace selection and reloads authorization context.

### The Map

- Uses the supplied layered visual as the primary composition: multiplex planes left, numbered layer legend right.
- Supports keyboard and pointer selection of the eight layers.
- Encodes evidence state and freshness without relying on color alone.
- A selected layer updates the summary; it does not navigate until the user chooses “Open layer.”
- Loading retains the shell and announces progress; empty state routes to baseline setup; stale state shows the observation date.

### Layer detail

- Shows definition, score label, graph nodes/edges, evidence distribution, signals, findings, and source coverage.
- Filters by time window, query, surface, subject, and competitor.
- Every derived value has a provenance action.

### Evidence log

- Chronological, append-only view of observations, evaluations, human reviews, and corrections.
- Failed collection is visibly `UNMEASURABLE`; successful searches with no evidence may be `ABSENT`.

### Mirror

- Compares only declared-equivalent contexts.
- Shows “not comparable” rather than fabricating zeroes.
- Supports a client plus up to five competitors in MVP.

### Actions

- Board and list projections over the same action records.
- Only reviewed findings may produce accepted actions.
- MVP actions are tracking records; no external publishing occurs.

## Visual and interaction direction

- Dark, editorial analytical canvas inspired by the supplied “The Map” slide.
- Cyan and magenta distinguish graph families and selection; semantic evidence states use accessible patterns and labels.
- Dense information is progressively disclosed through selection and evidence drawers.
- The product should feel like an investigative studio, not a generic admin dashboard.
- Tenant branding may alter logo, type treatment, and palette within accessibility constraints; information hierarchy and evidence semantics remain stable.

## Import-first provider decision

MVP acquisition uses versioned CSV/JSON import contracts plus fixture data. This proves canonical ingestion without committing the product to unstable or prohibited scraping. Direct collectors are later adapters and must produce the same observation contract.

The ingestion boundary is also protobuf/Base64-aware. Known encoded payloads may be accepted by allowlisted adapters, but the MVP user-facing import remains JSON/CSV. Original bytes and decoded canonical content are preserved separately.

## Multi-vector information gain

- Query intent is represented as an explicit set of facets and vectors.
- Documents retain passage or semantic-unit vector sets instead of only one page embedding.
- MVP uses exact multi-vector comparison on bounded datasets and stores per-facet best matches.
- Information gain reports new facet coverage, entity/claim coverage, novelty, redundancy, and contradiction or disambiguation value.
- MUVERA-style FDE retrieval is an optional scale accelerator after benchmarking; exact scoring remains the explainable re-ranking reference.
- Multi-vector measurements inform Salience, Entity, Citation, and Trust layers without becoming a hidden universal score.

## Operational behavior

- Every long-running job displays queued, running, succeeded, partial, failed, or canceled state.
- Failed steps expose a safe error, attempt count, and retry action.
- Retry reuses the idempotency key where appropriate and never duplicates canonical results.
- Costs are recorded per run even when the initial value is zero or manually supplied.

## Accessibility

- WCAG 2.2 AA target.
- Complete keyboard navigation for map layers, tables, drawers, and dialogs.
- Evidence states never depend on color alone.
- Graph content has a synchronized tabular representation.
- Motion respects reduced-motion preferences.
- Focus returns predictably after drawers and dialogs close.

## Deferred after MVP

- Scheduled direct collection
- Verified custom domains
- Client self-service onboarding
- Tenant-authored layer rules
- Complex billing and entitlements
- Automated external remediation
