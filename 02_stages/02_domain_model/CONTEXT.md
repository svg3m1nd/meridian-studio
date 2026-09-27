# Stage 02 — Domain Model

## Objective

Convert approved requirements into the canonical multi-tenant, multi-graph, multi-signal domain model.

## Inputs

- `01_references/DOMAIN_PRINCIPLES.md`
- `01_references/GLOSSARY.md`
- Active run `01_discovery/requirements.md`
- Approved decisions from active run `07_decisions/`

## Do not load

- UI mockups as data-model authority
- Implementation code
- Unapproved discovery notes

## Process

1. Define aggregate roots and tenant ownership.
2. Model graphs, subjects, edges, and provenance.
3. Model documents, passages, entities, claims, queries, runs, and results.
4. Define the signal registry and observation time series.
5. Define evidence layers, checks, findings, trust gates, mirrors, and actions.
6. Add lifecycle, uniqueness, retention, and authorization invariants.
7. Produce schema and example fixtures.

## Checkpoint

Human approves identity, tenancy, evidence semantics, and extensibility boundaries.

## Audit

- No client record lacks a workspace path.
- Raw evidence is not overwritten by interpretation.
- New signals and graph types can be added without core schema redesign.

## Outputs

- `02_domain_model/domain_model.md`
- `02_domain_model/schema.prisma`
- `02_domain_model/example_fixture.json`
- `02_domain_model/invariants.md`

## Handoff

Stage 03 receives only approved canonical artifacts.
