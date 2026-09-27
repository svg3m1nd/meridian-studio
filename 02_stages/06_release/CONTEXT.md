# Stage 06 — Release

## Objective

Package an approved release candidate with deployment, migration, rollback, and operating evidence.

## Inputs

- Active run `05_verification/release_candidate.md`
- Active run implementation migration notes
- Deployment configuration relevant to the target environment

## Do not load

- Rejected candidates
- Secrets
- Unreleased future work

## Process

1. Confirm environment, entitlement, data migration, and provider readiness.
2. Produce deployment and rollback steps.
3. Run migrations with preflight and postflight checks.
4. Deploy application and workers.
5. Verify health, tenant routing, custom domains, queues, and telemetry.
6. Record release version, evidence, known issues, and ownership.

## Checkpoint

Production deployment, destructive migration, or domain cutover requires explicit human authorization.

## Audit

- Rollback is practical and tested where possible.
- Migration state is recorded.
- Tenant isolation smoke tests pass after deployment.
- Operational owners and alerts are named.

## Outputs

- `06_release/release_plan.md`
- `06_release/release_record.md`
- `06_release/rollback_plan.md`

## Handoff

Release evidence becomes input to the next run only when explicitly referenced.
