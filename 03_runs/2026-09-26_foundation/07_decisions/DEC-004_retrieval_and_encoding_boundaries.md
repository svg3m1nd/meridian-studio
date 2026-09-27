# DEC-004 — Retrieval and Encoding Boundaries

- **Date:** 2026-09-26
- **Status:** Accepted
- **Decision owner:** User

## Decision

1. Multi-vector information gain is a first-class Meridian capability.
2. MUVERA-style FDE retrieval is treated as an optional candidate-generation accelerator; exact multi-vector scoring remains available for explanation and benchmarking.
3. Protobuf and Base64 are supported at provider-ingestion boundaries without becoming the canonical domain model.
4. Original bytes, decoded content, schema/decoder versions, and independent hashes are preserved.
5. The amended Stage 03 MVP specification is approved and implementation may begin with Slice 0.

## Consequences

- Stage 02 and 03 artifacts include the new contracts.
- Slice 0 must expose stable adapter interfaces even though provider-specific decoders and vector engines arrive in later slices.
- User-facing MVP imports remain JSON/CSV.
