# Canonical Domain Model

## Purpose

Define the stable concepts beneath Meridian Studio's interactive layered map. This is a logical model, not yet a commitment to UI components or physical database optimization.

## Model at a glance

```text
Organization
  ├── Membership ── User
  ├── BrandProfile / CustomDomain
  └── Workspace
        ├── Subject ── Entity | Document | Passage | Claim | Person | Place | Query
        ├── GraphDefinition ── GraphNode / GraphEdge
        ├── Source ── ObservationRun ── Observation
        ├── SignalDefinition ── SignalMeasurement
        ├── LayerDefinition ── LayerRule ── EvidenceCheck ── Finding
        ├── CompetitorSet ── WorkspaceSubject
        ├── Action
        └── Share
```

## Tenancy and identity

### Organization

Commercial tenant and security boundary. Owns memberships, brand configuration, custom domains, layer presets, signal definitions, and workspaces.

### Workspace

One client, brand, or research environment. Every client-owned record resolves to exactly one workspace. A workspace may represent the organization itself.

### User and Membership

A user has a global identity. Membership grants a role within an organization; optional workspace grants narrow access further. Initial roles are `OWNER`, `ADMIN`, `ANALYST`, `REVIEWER`, and `VIEWER`.

### BrandProfile and CustomDomain

Organization configuration for product identity, colors, assets, support identity, report presentation, and verified domain routing. Branding never changes data ownership.

## Canonical subject model

### Subject

Stable workspace-scoped identity that can participate in graphs, receive signals, support findings, or become an action target. A subject has a typed kind and points to one typed detail record.

Initial kinds: `WORKSPACE`, `ENTITY`, `PERSON`, `PLACE`, `DOCUMENT`, `PASSAGE`, `CLAIM`, `QUERY`, `RESULT`, `ANSWER`, `SOURCE`, and `ACTION`.

### Entity

A resolved real-world thing with a canonical name, type, aliases, external identifiers, and resolution status. Ambiguous candidates remain explicit; resolution never destroys the original mention.

### Document and DocumentVersion

`Document` is canonical identity; `DocumentVersion` is immutable observed content at a URI or source position. Versions retain capture, content hash, publication date when known, and object-storage reference.

### Passage

Addressable segment of one document version. Stores offsets, extraction version, and content hash so citations and claims can point to exact evidence.

### Claim

Normalized assertion with subject, predicate, object or literal value, validity window, confidence, and provenance. Contradictory claims coexist.

### Query

Canonical information need with intent, audience, locale, market, and variants. Query text alone is not its identity.

## Graph plane

### GraphDefinition

Named, versioned graph projection such as entity, source/citation, query/result, local/review, or competitive mirror. Definitions declare allowed node and edge types.

### GraphNode

Participation of a canonical subject in a graph version. It does not duplicate the subject.

### GraphEdge

Typed, directed relationship between nodes. Stores confidence, optional raw weight, validity, derivation method, and provenance links. Parallel and conflicting edges are allowed when supported by distinct observations.

## Observation plane

### Source

Configured origin: website, search engine, answer engine, business profile, review platform, uploaded file, dataset, or API.

### ObservationPlan

Repeatable configuration describing what to collect, against which sources, with schedule, query set, locale, agent, and policy constraints.

### ObservationRun

One execution of a plan or manual import. Tracks immutable parameters, status, cost, attempts, timing, and transformation versions.

### Observation

One raw captured response or documented failed attempt. Holds an object-storage reference, content hash, response metadata, and outcome. Failed capture is evidence of `UNMEASURABLE`, not `ABSENT`.

### RawArtifact

Immutable captured bytes associated with an observation. Records content type, wire format, transport encoding, compression, known protobuf message type/schema version, raw and decoded hashes, object-storage locations, decoder version, and decoding outcome. Base64 is decoded at the boundary and is never treated as the canonical stored representation.

### RetrievalResult and GeneratedAnswer

Typed projections from an observation. A ranked result stores position and retrieved document identity. A generated answer stores answer text/version and cited results or passages. They share run context but retain different semantics.

## Signal plane

### SignalDefinition

Versioned metric contract: key, value type, unit, valid subject kinds, directionality, collection method, and normalization policy. System definitions may be inherited by tenants; tenants may add definitions within safe types.

### SignalMeasurement

Raw value attached to a subject or edge at an observation time, with source observation, confidence, and collection version. Raw values are immutable.

### SignalNormalization

Versioned transformation producing a comparable value for a defined cohort and window. Normalized values never replace raw measurements.

### EmbeddingSet

Versioned multi-vector representation attached to a query, passage, document, claim, or entity. Records embedding model/version, segmentation method/version, dimension, vector count, storage reference, and optional fixed-dimensional encoding reference. Original vector sets remain available when an FDE is used for candidate generation.

### InformationGainAssessment

Explainable comparison of a candidate subject against a declared baseline and query-facet set. Stores facet coverage, novelty, redundancy, contradiction/disambiguation value, exact multi-vector similarity, retrieval method, and evidence links. Information gain is a decomposable Meridian measurement, not a native MUVERA score.

## Evidence plane

### LayerDefinition

Client-facing analytical layer. The eight system defaults are Link, Entity, Salience, Behavioral, Identity, Review, Trust, and Citation. A layer is a projection and may use multiple graph families and signals.

### LayerRule

Versioned mapping from graph patterns, signals, and evidence checks into a layer. Rules describe inclusion and interpretation; they do not purport to reproduce a search engine's hidden weighting.

### EvidenceCheck

Versioned question evaluated against a defined subject, observation set, and rule version—for example, “Is the business resolvable to one canonical entity across authoritative sources?”

### Evaluation

Execution record for one check. State is `SUPPORTED`, `PARTIAL`, `CONFLICTING`, `ABSENT`, or `UNMEASURABLE`. Stores rationale, confidence, evaluator, and evidence links.

### Finding

Human-facing interpretation derived from one or more evaluations. Findings have severity, status, review state, and affected layers. Automated findings remain distinguishable from reviewed findings.

### TrustGate

Critical set of checks whose failure can halt downstream interpretation or route work to remediation. Gate results never delete underlying results.

## Competition and action

### CompetitorSet

Named set of workspace subjects representing the client and selected competitors. Comparisons require equivalent query, surface, locale, window, and evaluation versions.

### Mirror

Rebuildable projection comparing equivalent observations and evaluations. It is not a separate source of truth.

### Action

Human-owned remediation or opportunity linked to findings, target subjects, affected layers, evidence, priority rationale, owner, due date, and lifecycle. MVP actions recommend and track; they do not autonomously publish.

## Primary projections

- **The Map:** layered graph topology plus graph/score legend and coverage state.
- **Layer Detail:** nodes, edges, signals, checks, findings, and provenance for one layer.
- **Pattern Histogram:** distribution of evidence states or signals across a selected cohort.
- **EAV Baseline:** current entity-authority-visibility evidence snapshot; the acronym remains a presentation label until product terminology is confirmed.
- **Mirror Comparison:** equivalent client/competitor observations.
- **Evidence Log:** chronological observations, evaluations, corrections, and decisions.
- **Action Plan:** reviewed findings converted into owned work.

## Extension boundaries

- Add subject, edge, graph, signal, source, and layer types through registries and versioned definitions.
- Multi-vector retrieval may use MUVERA-style fixed-dimensional encodings for candidate generation and exact Chamfer-style re-ranking; the algorithm and parameters are versioned.
- Vector similarity may propose candidate relationships but cannot establish a factual graph edge without an explicit derivation rule and provenance.
- Do not add a table per graph or signal.
- Tenant-defined layers may compose approved signals and checks but cannot execute arbitrary code.
- Provider adapters translate external payloads into canonical observations without becoming canonical models themselves.
