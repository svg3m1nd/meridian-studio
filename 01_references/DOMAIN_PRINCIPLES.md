# Domain Modeling Principles

## Separate the three planes

### Graph plane

Stores topology: nodes and typed relationships among entities, claims, sources, passages, queries, results, competitors, audiences, and actions. A subject may participate in multiple graphs.

### Evidence plane

Stores evaluation: supported, partial, conflicting, absent, or unmeasurable. Evidence always points to observed material or a documented failed observation.

### Signal plane

Stores measurements: rank, similarity, citation presence, authority, frequency, sentiment, freshness, confidence, stability, velocity, and tenant-defined metrics. Raw values are canonical; normalization is versioned configuration.

## Canonical graph families

- Business/entity graph
- Claim/evidence graph
- Source/document/citation graph
- Query/intent/result graph
- AI retrieval/answer graph
- Local/review graph
- Competitive mirror graph
- Audience/journey graph

## Observation lifecycle

1. Define query, source, or check.
2. Schedule an observation run.
3. Preserve the raw response immutably.
4. Extract documents, passages, entities, claims, citations, and signals.
5. Resolve identity without discarding ambiguity.
6. Evaluate evidence with a versioned rule.
7. Present findings and suggested actions.
8. Permit human correction while retaining the original observation.

## Critical distinctions

- `ABSENT`: capture succeeded and expected evidence was not found.
- `UNMEASURABLE`: capture or evaluation could not validly complete.
- `CONFLICTING`: credible evidence disagrees; do not average it away.
- Claim confidence is not source authority.
- Retrieval rank is not relevance.
- Citation presence is not endorsement.
- Entity co-occurrence is not a relationship without an explicit edge rule.

## Time

Facts, graph edges, source versions, and observations are temporal. Preserve `observed_at`, validity windows where known, and transformation version. Never overwrite history to represent change.

## Tenant isolation

Every client-owned aggregate must be reachable through exactly one workspace. Authorization checks use stable IDs and server-side membership, never client-provided organization names or domains.
