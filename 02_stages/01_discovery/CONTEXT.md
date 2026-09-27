# Stage 01 — Discovery

## Objective

Transform source material and stakeholder input into a verified requirements brief.

## Inputs

- `01_references/PRODUCT.md`
- `01_references/GLOSSARY.md`
- `01_references/SOURCES.md`
- Active run `00_inputs/`

## Do not load

- Later-stage outputs
- Application code
- Prior runs unless explicitly cited

## Process

1. Inventory sources and label direct evidence, inference, and open question.
2. Identify users, jobs, pains, decisions, outputs, and review gates.
3. Map prototype screens to user jobs rather than copying interface details.
4. Define MVP, later scope, non-goals, risks, and assumptions.
5. Record unresolved questions that materially alter architecture or scope.

## Checkpoint

Human approves the requirements brief and source boundary.

## Audit

- Every requirement points to a source or an explicit decision.
- No inferred behavior is presented as confirmed.
- MVP fits one testable end-to-end workflow.

## Outputs

- `01_discovery/requirements.md`
- `01_discovery/source_inventory.md`
- `01_discovery/open_questions.md`

## Handoff

Stage 02 may start only when the requirements brief is approved.
