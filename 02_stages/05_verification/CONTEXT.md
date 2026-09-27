# Stage 05 — Verification

## Objective

Prove an implemented slice meets functional, tenant-isolation, usability, accessibility, and recovery requirements.

## Inputs

- Active run Stage 03 acceptance criteria
- Active run Stage 04 handoff
- Relevant application code and tests

## Do not load

- Unapproved desired behavior
- Later release plans
- Unrelated application modules

## Process

1. Trace each acceptance criterion to executable or documented evidence.
2. Test happy path, empty state, invalid input, partial failure, retry, and cancellation.
3. Test role and tenant isolation, including hostile workspace IDs.
4. Test keyboard, focus, contrast, responsive layout, and screen-reader semantics.
5. Verify provenance and audit records survive recomputation.
6. Record pass, conditional pass, or rejection.

## Checkpoint

Rejected work returns to Stage 03 for contract defects or Stage 04 for implementation defects.

## Audit

- Evidence is reproducible.
- No failure is hidden by optimistic UI.
- No output depends on unavailable local state.

## Outputs

- `05_verification/verification_report.md`
- `05_verification/defects.md`
- `05_verification/release_candidate.md`

## Handoff

Only a passing release candidate enters Stage 06.
