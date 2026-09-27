# Meridian Studio — ICM Router

## Where am I?

This is Meridian Studio, a multi-tenant retrieval-intelligence SaaS for observing how businesses are represented across search, AI retrieval, local, review, source, entity, claim, and competitive graphs.

## Operating method

This workspace follows Jake Van Clief and David McDermott's Interpretable Context Methodology (ICM): folder structure provides orchestration, markdown carries context and state, numbered stages define sequence, and scripts perform deterministic work.

## Routing

1. Read `CONTEXT.md`.
2. Identify the current run in `03_runs/ACTIVE_RUN.md`.
3. Enter only the requested stage in `02_stages/`.
4. Read that stage's `CONTEXT.md` before any stage action.
5. Load only the references and prior outputs named by the stage contract.
6. Write outputs to the current run's matching stage folder.
7. Stop at a required human checkpoint.

## Global rules

- One stage, one job.
- Do not skip stages or invent missing inputs.
- Preserve sources, timestamps, and provenance.
- Keep graph topology, evidence state, and signals distinct.
- Never replace an observation with a synthetic score.
- Tenant scope is mandatory on every client-owned record.
- Product behavior must support white-label presentation without code forks.
- Every stage output must remain human-readable and editable.

## Stage map

| Stage | Job |
|---|---|
| `01_discovery` | Convert source material into verified product and user requirements |
| `02_domain_model` | Define canonical entities, graphs, signals, evidence, tenancy, and provenance |
| `03_product_spec` | Turn approved domain truth into UX, API, and acceptance contracts |
| `04_implementation` | Build the application in vertical slices |
| `05_verification` | Test correctness, isolation, usability, and recovery behavior |
| `06_release` | Package deployment, operations, migration, and release evidence |

## Never load by default

- All historical run folders
- All source captures
- Every stage at once
- Generated dependencies or build output
- Secrets or local environment files
