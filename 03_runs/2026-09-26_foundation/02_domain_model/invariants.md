# Domain Invariants

## Tenancy and authorization

1. Every client-owned aggregate has exactly one immutable `workspace_id`.
2. Every workspace belongs to exactly one organization.
3. Access is authorized by stable membership and grant IDs, never submitted organization names, domains, or workspace slugs.
4. Cross-workspace relationships are prohibited in the MVP; comparisons use references or copied public subjects with provenance.
5. White-label domains select presentation context only and never confer data access.

## Provenance and time

6. Raw observations, document versions, signal measurements, and evaluations are append-only.
7. Every derived record identifies its source observation or upstream derivation records and transformation version.
8. Corrections create superseding records; they do not rewrite captured evidence.
9. Every temporal record includes `observed_at`; validity windows are separate when known.
10. Content-addressed hashes detect duplicate captures without erasing repeated observations.

## Graph semantics

11. A graph node references one canonical subject; it does not copy subject identity.
12. An edge type declares valid source and target subject kinds.
13. Co-occurrence becomes an edge only through an explicit, versioned derivation rule.
14. Conflicting or parallel edges may coexist when their provenance differs.
15. Client-facing influence layers are projections and are not required to map one-to-one to stored graphs.

## Evidence and signals

16. Evidence state is limited to `SUPPORTED`, `PARTIAL`, `CONFLICTING`, `ABSENT`, or `UNMEASURABLE`.
17. `ABSENT` requires a successful, applicable observation; failed or invalid collection produces `UNMEASURABLE`.
18. Raw signals remain available after normalization; normalization records its cohort, window, and version.
19. Claim confidence, source authority, retrieval rank, relevance, and citation presence remain distinct signals.
20. Meridian never labels an aggregate as a proprietary engine ranking weight or universal ranking score.

## Comparison and action

21. Mirror comparisons declare query, surface, locale, time window, and rule versions; non-equivalent comparisons are labeled.
22. Findings cite evaluations and evidence; actions cite findings.
23. Automated findings and recommendations require an explicit review state.
24. MVP actions cannot publish or mutate client-controlled external systems.

## Operations and retention

25. Observation jobs use idempotency keys and retain attempt history.
26. Deletion and retention operate at the workspace boundary and include derived projections and stored objects.
27. Public shares are revocable, scoped, expiring where appropriate, and contain no provider credentials or raw restricted evidence.
28. Projection records are safe to rebuild from canonical data.

## Multi-vector and encoded payloads

29. Every embedding set records model, model version, dimension, segmentation version, and source subject.
30. FDE or other approximate retrieval scores are labeled separately from exact multi-vector re-ranking scores.
31. Information gain exposes facet coverage, novelty, redundancy, and contradiction/disambiguation components; it is never an unexplained scalar.
32. Vector similarity alone cannot create a factual entity, claim, or relationship.
33. Original payload bytes are hashed before transport decoding or decompression.
34. Base64 content is decoded at ingestion and is not the canonical binary store.
35. Protobuf decoding requires a known, allowlisted schema or descriptor and records message type and decoder version.
36. Raw-byte identity and normalized-content identity use separate hashes; reserialized protobuf bytes are never assumed canonical.
