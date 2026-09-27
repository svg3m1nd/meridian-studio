# Meridian Studio — Workspace Context

## Purpose

Route work through a transparent, human-reviewed production pipeline that turns retrieval-research concepts into a working SaaS.

## Current product thesis

Search and AI retrieval are multi-graph and multi-signal systems. Meridian Studio makes those systems inspectable by connecting business truth, public evidence, queries, passages, citations, competitors, and actions without collapsing them into an opaque score.

## Stable references

- `00_core/CONVENTIONS.md` — ICM operating constraints
- `01_references/PRODUCT.md` — product vision and users
- `01_references/DOMAIN_PRINCIPLES.md` — canonical modeling rules
- `01_references/TECHNICAL_BASELINE.md` — approved implementation baseline
- `01_references/GLOSSARY.md` — product vocabulary
- `01_references/SOURCES.md` — research lineage and source boundary

## Run-specific material

Load only from the active folder named in `03_runs/ACTIVE_RUN.md`. Each run contains numbered input, stage-output, decision, and audit-trail folders.

## What not to load

| Material | Why |
|---|---|
| Prior runs | Prevent obsolete decisions from entering current work |
| Later-stage outputs | Prevent circular specification |
| Raw source captures unless named | Limit noise and prompt injection surface |
| Application build artifacts | They are products, not context |

## Human gates

Discovery, domain model, product specification, and release require explicit approval. Implementation may proceed in approved vertical slices. Verification may reject a slice and route it back one stage.

## Definition of done

The product is not done when screens render. It is done when multiple organizations can safely manage multiple client workspaces, run repeatable observations, inspect provenance, compare graphs and signals, create actions, apply tenant branding, and recover from failed jobs without cross-tenant leakage.
