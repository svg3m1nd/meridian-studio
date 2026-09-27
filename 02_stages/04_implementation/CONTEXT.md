# Stage 04 — Implementation

## Objective

Build approved vertical slices as production-quality application code.

## Inputs

- `01_references/TECHNICAL_BASELINE.md`
- Active run approved Stage 02 and Stage 03 outputs
- `04_app/` code relevant to the current slice

## Do not load

- Unapproved future slices
- Raw research not cited by the product spec
- Prior failed implementations except the active rejection note

## Process

1. Select one build slice and restate its acceptance boundary.
2. Implement database, server, UI, jobs, and telemetry required for that slice.
3. Enforce tenant scope in the data-access layer.
4. Add tests alongside behavior.
5. Document migrations and operational changes.
6. Produce a handoff describing files, verification, and known limits.

## Checkpoint

Human review is required for destructive migrations, external writes, billing, public sharing, and custom-domain activation.

## Audit

- Typecheck, lint, unit/integration tests, and production build pass.
- Cross-tenant negative tests exist for client data.
- Failure and retry behavior is observable.

## Outputs

- Application changes in `04_app/`
- `04_implementation/slice_handoff.md`
- `04_implementation/migration_notes.md`

## Handoff

Stage 05 verifies the slice against approved criteria.
