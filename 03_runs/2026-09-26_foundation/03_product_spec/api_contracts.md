# API and Job Contracts

## Conventions

- JSON over HTTPS under `/api/v1`.
- IDs are opaque strings; slugs are routing labels, never authorization inputs.
- Every workspace request derives organization and workspace scope from the authenticated membership.
- Mutations accept `Idempotency-Key` where repetition could duplicate work.
- List endpoints use cursor pagination and stable ordering.
- Errors use `{ code, message, fieldErrors?, requestId }` and never expose provider credentials or raw stack traces.
- Timestamps are ISO 8601 UTC.

## Resource endpoints

| Method and path | Purpose | Minimum role |
|---|---|---|
| `GET /organizations` | Accessible organizations | Viewer |
| `GET /organizations/{orgId}/workspaces` | Portfolio list | Viewer |
| `POST /organizations/{orgId}/workspaces` | Create client workspace | Admin |
| `GET /workspaces/{workspaceId}` | Workspace identity and capabilities | Viewer |
| `PATCH /workspaces/{workspaceId}` | Update allowed workspace metadata | Admin |
| `POST /workspaces/{workspaceId}/subjects/entities` | Create canonical business or competitor entity | Analyst |
| `POST /workspaces/{workspaceId}/queries` | Create query definition | Analyst |
| `GET /workspaces/{workspaceId}/layers` | Layer definitions and summary projection | Viewer |
| `GET /workspaces/{workspaceId}/layers/{layerKey}` | Layer topology, signals, states, and findings | Viewer |
| `POST /workspaces/{workspaceId}/imports/validate` | Validate an import without mutation | Analyst |
| `POST /workspaces/{workspaceId}/imports` | Create import and processing run | Analyst |
| `GET /workspaces/{workspaceId}/runs/{runId}` | Run and step status | Viewer |
| `POST /workspaces/{workspaceId}/runs/{runId}/retry` | Retry eligible failed work | Analyst |
| `GET /workspaces/{workspaceId}/observations` | Filtered observation/evidence log | Viewer |
| `GET /workspaces/{workspaceId}/evaluations/{evaluationId}` | Evaluation with evidence links | Viewer |
| `GET /workspaces/{workspaceId}/findings` | Filtered findings | Viewer |
| `PATCH /workspaces/{workspaceId}/findings/{findingId}/review` | Approve, reject, or supersede | Reviewer |
| `POST /workspaces/{workspaceId}/actions` | Create action from approved finding | Analyst |
| `PATCH /workspaces/{workspaceId}/actions/{actionId}` | Update owner, priority, due date, status | Analyst |
| `GET /workspaces/{workspaceId}/mirrors/{setId}` | Equivalent comparison projection | Viewer |
| `POST /workspaces/{workspaceId}/shares` | Publish approved read-only view | Reviewer |
| `DELETE /workspaces/{workspaceId}/shares/{shareId}` | Revoke share | Reviewer |

## Map projection

`GET /workspaces/{workspaceId}/map?asOf=&queryId=&surface=&competitorSetId=` returns:

```json
{
  "workspace": { "id": "...", "name": "..." },
  "context": { "asOf": "...", "queryId": "...", "surface": "..." },
  "layers": [
    {
      "key": "entity",
      "name": "Entity",
      "scoreLabel": "Understanding",
      "stateCounts": { "SUPPORTED": 4, "PARTIAL": 2, "CONFLICTING": 1, "ABSENT": 0, "UNMEASURABLE": 0 },
      "freshness": { "observedAt": "...", "isStale": false },
      "nodes": [{ "id": "...", "subjectId": "...", "label": "...", "kind": "ENTITY" }],
      "edges": [{ "id": "...", "sourceNodeId": "...", "targetNodeId": "...", "type": "SAME_AS" }],
      "findingCount": 3
    }
  ],
  "warnings": []
}
```

It never returns a universal aggregate score.

## Import contract

An import package declares:

- `schemaVersion`
- workspace-owned `sourceKey`
- query identity and observation context
- surface type: `RANKED_SEARCH` or `GENERATED_ANSWER`
- observation timestamp, locale, market, device/agent when known
- ranked results or generated answer
- citation locators
- optional raw artifact reference and content hash
- optional content type, wire encoding, transport encoding, compression, protobuf type/schema version, and original-byte hash

Validation returns accepted rows, warnings, rejected rows, stable row identifiers, and normalized preview. Submission creates one `ObservationRun` and returns `202 Accepted` with its status URL.

Known protobuf payloads are decoded only through allowlisted schemas. Base64 is a transport encoding: the service validates and decodes it before canonical storage, while retaining the original-byte hash and capture metadata.

## Multi-vector analysis contract

`POST /workspaces/{workspaceId}/information-gain/analyses` accepts a query/facet set, candidate subjects, baseline collection, embedding definition, and scoring definition. It returns `202 Accepted` and a run status URL.

`GET /workspaces/{workspaceId}/information-gain/analyses/{analysisId}` returns per-facet best passages, exact and approximate score labels, coverage, novelty, redundancy, contradiction/disambiguation contribution, evidence links, and algorithm/model versions. Approximate candidate-generation scores and exact re-ranking scores are never conflated.

## Job contract

```text
INGEST → NORMALIZE → RESOLVE → EXTRACT → EVALUATE → PROJECT
```

Each step records status, attempts, start/end timestamps, input/output hashes, worker version, cost, and safe error. Steps are idempotent. A later step cannot run until its declared dependencies succeed or are explicitly marked partial.

## Event contracts

- `observation.run.created`
- `observation.step.completed`
- `observation.run.completed`
- `evaluation.created`
- `finding.reviewed`
- `action.created`
- `share.published`
- `share.revoked`

Events include `eventId`, `eventVersion`, `organizationId`, `workspaceId`, aggregate ID, occurred time, actor, and correlation ID. Consumers must tolerate additive fields and deduplicate by `eventId`.

## Public share contract

Public routes use a random, hashed-at-rest token. The resolved share contains a frozen or explicitly live projection policy, permitted sections, branding snapshot, expiration, and revocation state. Public responses exclude internal notes, membership data, credentials, raw restricted artifacts, and unapproved findings.
