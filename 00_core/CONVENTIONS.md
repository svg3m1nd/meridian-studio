# Meridian Studio ICM Conventions

1. Numbered stage folders are the canonical sequence.
2. Each stage owns exactly one transformation.
3. Every stage has a `CONTEXT.md` contract with Inputs, Process, Checkpoints, Audit, and Outputs.
4. Stage context routes; references contain durable knowledge.
5. References stay under 200 lines; stage contracts stay under 80 lines.
6. Inputs flow forward. A stage never reads from a later stage.
7. Every run gets a unique date-prefixed folder under `03_runs/`.
8. Intermediate outputs are editable human checkpoints.
9. Mechanical work belongs in small scripts, not AI instructions.
10. Canonical facts have one owner file; other files link to them.
11. Raw captures are immutable and include source and capture time.
12. Decisions record options, rationale, owner, and date.
13. Failed validation routes work backward with a written rejection.
14. Product code lives in `04_app/`; ICM workflow context stays outside it.
15. Generated artifacts and secrets are excluded from context and version control.

## Stage contract template

Each stage contract must contain:

- **Objective:** one transformation only.
- **Inputs:** exact files or folders allowed.
- **Do not load:** explicit exclusions.
- **Process:** ordered actions.
- **Checkpoints:** decisions requiring a person.
- **Audit:** evidence the process ran correctly.
- **Outputs:** exact files produced.
- **Handoff:** next stage and readiness conditions.

## Naming

- Stage folders: `NN_noun_or_verb`
- Run folders: `YYYY-MM-DD_short-name`
- Decisions: `DEC-NNN_short-name.md`
- Output filenames: lowercase snake case
- IDs in data models: stable opaque IDs; labels are never identifiers

## Provenance rule

Every observation records who or what produced it, when it was produced, what source was inspected, the raw artifact location, and the transformation version. Inferences must be labeled as inferences.
