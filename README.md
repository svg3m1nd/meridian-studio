# Meridian Studio

Meridian Studio is a multi-tenant, white-label retrieval-intelligence SaaS organized with Interpretable Context Methodology (ICM).

## Start here

1. Read `CLAUDE.md` for routing.
2. Read `CONTEXT.md` for workspace boundaries.
3. Follow `03_runs/ACTIVE_RUN.md` to the current work.
4. Enter only the active numbered stage.

## Product idea

Modern search and AI retrieval are multi-graph and multi-signal. Meridian Studio connects business truth, sources, passages, entities, claims, queries, results, citations, competitors, evidence states, and actions while retaining provenance.

## Project structure

```text
meridian_studio/
├── CLAUDE.md
├── CONTEXT.md
├── 00_core/
├── 01_references/
├── 02_stages/
│   ├── 01_discovery/
│   ├── 02_domain_model/
│   ├── 03_product_spec/
│   ├── 04_implementation/
│   ├── 05_verification/
│   └── 06_release/
├── 03_runs/
└── 04_app/
```

The `04_app/` directory is reserved for the production web application after the discovery, domain-model, and product-spec gates are approved.

## ICM lineage

This project applies the open-source Interpretable Context Methodology created by Jake Van Clief and documented with David McDermott. See `01_references/SOURCES.md` for canonical sources and attribution.
