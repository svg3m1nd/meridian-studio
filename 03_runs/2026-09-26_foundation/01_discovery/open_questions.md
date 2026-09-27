# Open Questions

## Resolved discovery decisions

1. The deck's eight named graphs are the default client-facing framework; future system or tenant definitions may extend it.
2. The proposed MVP workflow in `requirements.md` is approved as the first end-to-end slice.
3. Presentation claims require independent verification before they appear as factual statements in Meridian's interface or client reports.

Recorded in `07_decisions/DEC-002_discovery_checkpoint.md`.

## Decisions for the product-spec stage

1. Which retrieval surfaces are MVP requirements: Google organic, local/maps, Bing, ChatGPT, Gemini, Perplexity, Copilot, or uploaded result sets?
2. Should Meridian collect observations directly, accept imports, or support both in the first release?
3. Who is the first paying user: Fusion Vine internally, another agency, or a direct enterprise customer?
4. Does the first release require client logins, or agency-only access with shared reports?
5. Is public custom-domain white labeling required for MVP or the next release?
6. Which actions may the system execute versus only recommend?

## Modeling questions for Stage 02

1. Should a ranking-influence layer be a system definition, a tenant-configurable definition, or both?
2. Can a single evidence evaluation contribute to multiple layers with different weights or rules?
3. Which behavioral signals can Meridian legitimately observe, import, or infer?
4. Should formal scholarly citations and answer-engine citations share a base edge type with different subtypes?
5. What constitutes an equivalent observation when comparing different search and answer engines?

The presentation is no longer a missing input. The questions above define the remaining discovery checkpoint and affect provider choices, domain boundaries, and MVP scope.
