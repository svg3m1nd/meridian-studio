# MVP Acceptance Criteria

## Organization and workspace

- Given a user belongs to two organizations, switching organizations shows only that organization's workspaces and clears any prior workspace context.
- A user without workspace access receives the same authorization failure whether or not the workspace ID exists.
- An Admin can create a workspace with a unique organization-scoped slug.
- Tenant branding changes presentation but never changes record ownership or authorization.

## Baseline setup

- An Analyst can define one canonical client entity, aliases, locale, topics, queries, and up to five competitors.
- Ambiguous entity resolution remains visible and does not silently merge candidates.
- Empty setup explains the minimum data needed to run the first assessment.

## Import and processing

- CSV and JSON imports are validated before mutation and report errors by stable row identifier.
- Repeating a submission with the same idempotency key does not duplicate the run or observations.
- A submitted import exposes all six processing steps and updates without a full page reload.
- A failed step shows a safe explanation and eligible retry action.
- Captured raw artifacts and measurements are append-only.
- Base64 payloads are validated and decoded at ingestion; the original-byte and decoded-content hashes are both retained.
- Protobuf payloads without an allowlisted descriptor fail safely and do not produce canonical observations.
- Failed capture yields `UNMEASURABLE`; a successful applicable check with no evidence may yield `ABSENT`.

## Multi-vector information gain

- A query can contain multiple named facets, each retaining its own vector representation.
- A document or passage collection can retain multiple vectors with model and segmentation versions.
- The analysis identifies the best supporting passage for every query facet.
- Results expose facet coverage, novelty, redundancy, and contradiction/disambiguation components.
- Approximate candidate retrieval and exact multi-vector re-ranking are labeled separately.
- Re-running with identical inputs and versions produces the same stored analysis result.
- Vector similarity cannot independently create an approved fact or graph relationship.

## The Map

- The overview renders eight default planes and a synchronized numbered legend: Link/Authority, Entity/Understanding, Salience/Depth, Behavioral/Satisfaction, Identity/Provenance, Review/Prominence, Trust/Safety, and Citation/Citability.
- Selecting a plane selects the matching legend row and vice versa.
- Keyboard users can traverse and select every layer and reach its detail view.
- Selection exposes evidence distribution, freshness, top findings, and relevant topology.
- The screen does not display or imply a proprietary composite ranking score.
- When no successful baseline exists, the page shows a setup action instead of an empty visualization.

## Evidence and provenance

- Every finding opens evidence showing source, observation conditions, locator, rule/evaluator version, confidence, and review history.
- Raw observation text is rendered as untrusted content and cannot execute scripts or inject application instructions.
- Human correction creates a superseding record while the original remains available to authorized users.
- Evidence state is communicated with text and non-color visual treatment.

## Mirror comparison

- Comparison requires declared query, surface, locale, window, and evaluation version.
- Missing or incompatible evidence displays `Not comparable`, not zero or absent.
- Client and competitors use the same layer definitions and filters within one comparison.

## Findings and actions

- Automated findings begin as `UNREVIEWED`.
- A Reviewer can approve, reject, or supersede a finding with an audit entry.
- An action retains a link to its finding, evidence, affected layers, rationale, owner, priority, due date, and lifecycle.
- No MVP action can publish to an external client system.

## Sharing and white label

- A Reviewer can preview and publish a branded read-only share containing only approved sections.
- A revoked or expired link stops resolving immediately.
- Public shares never expose raw restricted artifacts, credentials, internal notes, or unapproved findings.
- Contrast remains AA-compliant for supported tenant palettes or the system substitutes accessible semantic colors.

## Operations and quality

- Job attempts, latency, failure, backlog, and recorded cost are observable by administrators.
- Workspace deletion/export behavior includes canonical records, derived projections, and stored objects according to policy.
- Automated tests prove cross-tenant reads and writes are denied.
- Critical flows pass current desktop and mobile viewport tests.
- All interactive controls have accessible names, visible focus, and error association.
