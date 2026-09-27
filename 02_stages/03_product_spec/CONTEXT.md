# Stage 03 — Product Specification

## Objective

Translate the domain model into testable UX, API, workflow, and operational contracts.

## Inputs

- `01_references/PRODUCT.md`
- `01_references/TECHNICAL_BASELINE.md`
- Active run approved Stage 01 and Stage 02 outputs

## Do not load

- Unapproved exploratory models
- Prior implementation experiments

## Process

1. Define information architecture and role-specific journeys.
2. Specify organization, workspace, membership, and white-label behavior.
3. Specify onboarding, EAV baseline, sources, queries, observations, evidence, mirrors, and actions.
4. Define API/resource boundaries and job contracts.
5. Write acceptance criteria, empty/error/loading states, and accessibility requirements.
6. Record build slices in dependency order.

## Checkpoint

Human approves MVP scope, UX flows, provider decisions, and acceptance criteria.

## Audit

- Every screen reads/writes canonical domain objects.
- Every long-running action exposes status and recovery.
- Tenant switching and authorization are specified explicitly.

## Outputs

- `03_product_spec/product_spec.md`
- `03_product_spec/api_contracts.md`
- `03_product_spec/acceptance_criteria.md`
- `03_product_spec/build_slices.md`

## Handoff

Stage 04 implements one approved slice at a time.
