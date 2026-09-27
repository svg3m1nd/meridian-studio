# DEC-003 — Domain Model Checkpoint

- **Date:** 2026-09-26
- **Status:** Accepted
- **Decision owner:** User

## Decision

Approve the Stage 02 logical model, tenancy boundary, evidence semantics, signal separation, and extensibility rules as the basis for product specification.

## Consequences

- Stage 03 may define user journeys, screens, APIs, acceptance criteria, and delivery slices.
- Physical schema details may evolve during implementation, but changes must preserve the approved invariants.
- The eight visible layers remain projections over canonical records rather than separate databases.
