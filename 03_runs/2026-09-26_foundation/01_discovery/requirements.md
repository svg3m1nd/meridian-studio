# Discovery Requirements Brief

## Product outcome

Meridian Studio must show how a business is represented, retrieved, cited, compared, and trusted across search and AI systems, while keeping each conclusion traceable to its source observations and evaluation rules.

## Evidence notation

- **D:** Direct product-owner requirement
- **P:** Supplied presentation or prototype evidence
- **I:** Product inference requiring checkpoint approval

## Users and jobs

| User | Job |
|---|---|
| Agency strategist | Manage multiple client workspaces and explain visibility gaps with defensible evidence |
| Search or brand analyst | Compare a business with competitors across multiple influence layers and retrieval surfaces |
| Content or communications lead | Find weak or conflicting entity, topical, authorship, trust, and citation evidence |
| Executive or client stakeholder | Consume a concise branded explanation and prioritized action plan |
| White-label partner | Present the same underlying analysis through tenant-specific identity and domains |

## Functional requirements

| ID | Requirement | Evidence |
|---|---|---|
| FR-001 | Support organizations containing multiple isolated client workspaces. | D |
| FR-002 | Apply tenant branding through configuration without application or schema forks. | D |
| FR-003 | Represent entities, documents, passages, claims, sources, queries, results, citations, people, places, reviews, competitors, and actions as connected, temporal records. | D, P |
| FR-004 | Keep graph topology, evidence evaluation, and measured signals as distinct planes. | D, I |
| FR-005 | Project observations into configurable ranking-influence layers, initially covering link, entity, salience, behavioral, identity, local/review, trust/spam, and citation concerns. | P, I |
| FR-006 | Allow one record or observation to support multiple influence layers without duplicating canonical facts. | P, I |
| FR-007 | Preserve raw observations immutably with retrieval time, surface, query, locale, device or agent context where available, and transformation version. | D, I |
| FR-008 | Classify evidence as supported, partial, conflicting, absent, or unmeasurable and retain the basis for that state. | P |
| FR-009 | Record source class and confidence so patents, official documentation, sworn testimony, research, leaks, reverse engineering, and practitioner data are not treated as equivalent. | P, I |
| FR-010 | Display raw signals and versioned normalization separately; do not claim hidden engine weights or manufacture a universal ranking score. | P |
| FR-011 | Support repeated observations so users can inspect freshness, stability, velocity, and change over time. | P, I |
| FR-012 | Compare the client with named competitors using the same definitions, observation conditions, and evidence rules. | D, P |
| FR-013 | Provide pattern histogram, layer detail, baseline, mirror comparison, evidence log, trust gate, and action-plan projections over canonical data. | P |
| FR-014 | Connect every finding and recommended action to affected layers, supporting observations, confidence, and expected outcome. | P, I |
| FR-015 | Treat ranked search results and generated answers as different output surfaces over related retrieval evidence. | P |
| FR-016 | Support human correction and review without overwriting the original observation or automated evaluation. | D, I |
| FR-017 | Enforce server-side membership and workspace scope for every client-owned aggregate and operation. | D |
| FR-018 | Export or share client-facing views with tenant branding and controlled access. | D |

## MVP workflow

The first testable workflow should let an agency operator:

1. Create an organization and client workspace.
2. Define the business identity, competitors, target topics, and query set.
3. Add or collect a bounded observation set from at least one ranked-search surface and one generated-answer surface.
4. Resolve sources, entities, passages, claims, citations, and relationships while preserving raw evidence.
5. Evaluate evidence and signals across the configured influence layers.
6. Inspect a baseline, layer detail, competitor mirror, and evidence log.
7. Produce a reviewed, prioritized action plan with provenance.
8. Share a branded read-only result.

The acquisition method—direct providers, imports, or both—remains an open product-spec decision.

## Non-functional requirements

- Tenant isolation must be testable and enforced below the UI layer.
- Collection and transformation jobs must be idempotent, retryable, observable, and cost-accounted.
- Raw evidence and derived results must have explicit retention and deletion behavior.
- Crawled content and model output must be treated as untrusted input.
- Evaluation rules and normalization must be versioned and reproducible.
- Failed collection must produce `UNMEASURABLE`, never silent absence.
- Public shares and custom domains must not weaken workspace authorization.

## First-release exclusions

- Autonomous publishing or remediation
- Claims that Meridian knows proprietary ranking weights
- A universal SEO or AI-visibility score
- Unreviewed strategic recommendations
- Arbitrary third-party code execution
- Complex billing beyond basic entitlements

## Discovery risks

1. Conflating explanatory influence layers with physical graph storage could create brittle architecture.
2. Provider limitations may prevent equivalent observations across engines.
3. Behavioral signals may be unavailable or only indirectly observable.
4. Source claims in the presentation vary materially in evidentiary strength.
5. White-label custom domains and client access can expand the MVP significantly.
6. A single composite score would create false precision and conflict with the product thesis.

## Discovery checkpoint

Approval is required for this brief, the source boundary, and the MVP workflow before Stage 02 begins.
