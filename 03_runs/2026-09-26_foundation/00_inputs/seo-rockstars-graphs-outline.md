# SEO Rockstars — "Overlapping Graphs" Slide Deck Outline

**Working talk:** Graph Engineering for SEO — How Overlapping Graphs Determine Prominence, Authority, and Trust
**Speaker:** Brian Kato, Fusion Vine
**Status:** Draft outline for review (Step 2 of 3)

---

## Title options

Pick one:
1. **"Eight Graphs, One Ranking: How Modern Retrieval Really Works"**
2. "Things, Not Strings: The Overlapping Graphs Behind Every Ranking"
3. "The Multiplex Web: Why You Were Only Ever Optimizing One Graph"
4. "Prominence Is a Multi-Graph Problem"

(Recommendation: #1 — it makes the talk's structure explicit and promises a concrete, countable reveal.)

---

## Talk arc (one-liner)

> You've spent your career optimizing ONE graph. Every retrieval system that matters — Google, Bing, Perplexity, ChatGPT, and every serious AI retrieval pipeline — runs EIGHT, layered on top of each other. This talk maps each graph, shows the math that fuses them, and turns that map into an 8-part operating playbook.

**Runtime assumption:** 30–40 min talk. ~32 slides below; trim the two optional slides if the slot is 25 min.

---

## SECTION 1 — OPENING (Slides 1–3)

### Slide 1 — Title slide
- Title + name + Fusion Vine branding
- **Visual:** A single thin graph on the left, exploding into 8 layered graphs on the right.

### Slide 2 — The provocation
- "How many graphs does Google use to rank a page?"
- Poll the room / pause. Most will say one (PageRank), some will say two (links + entities).
- **Speaker note:** "The real answer is at least eight. And the scary part is the math that combines them was published a decade ago, in a biology journal."

### Slide 3 — Why this matters beyond Google
- Thesis statement: nearly ALL modern retrieval systems use the same trick — search engines and AI systems alike.
- Preview the three acts: the graphs (Google), the fusion math (multiplex theory), the same pattern in AI.

---

## SECTION 2 — THE SINGLE-GRAPH MYTH (Slides 4–6)

### Slide 4 — PageRank: the graph we all know
- 1998: web = directed graph of pages and links, random-surfer scoring.
- Original patent assigned to Stanford, **expired Jan 2019** — but Google kept patenting the link graph: US9165040B1 (distance-based PageRank, valid to 2027), US8972329B2 (random-surfer ranking).
- **Visual:** tiny 5-node link graph with a random walk animation.

### Slide 5 — 2012: "things, not strings"
- Singhal launches the Knowledge Graph: *"an intelligent model — in geek-speak, a 'graph' — that understands real-world entities and their relationships: things, not strings."*
- 500M objects, 3.5B facts at launch (last official count).
- The moment the web stopped being one graph.

### Slide 6 — The mental model most SEOs still run
- One axis: "more links = more authority."
- **The pivot line:** "Links are one layer. The ranking you see is the interference pattern of eight of them overlapping — like moiré patterns, or like frequencies in a Fourier transform."
- **Visual:** two overlapping grid layers producing a moiré pattern.

---

## SECTION 3 — THE EIGHT GRAPHS (Slides 7–15)

One slide per graph. Each follows the same rhythm: **what it is → one piece of hard evidence → what it scores.** Keep these fast (45–60s each). Evidence is drawn from patents, sworn testimony, and official docs — not blog folklore.

### Slide 7 — Graph 1: The Link Graph (authority)
- Pages + hyperlinks; PageRank-family random walks.
- Evidence: US9165040B1 + DOJ trial — the "Quality" signal = PageRank + **link distance from trusted seed sites**.
- Scores: **authority**.

### Slide 8 — Graph 2: The Entity/Knowledge Graph (understanding)
- Real-world entities + typed relationships; query → "pinpoints nodes within a knowledge graph" (US11762933B2, 2023); US11256866 (KG in the answering path).
- Scores: **what the query and the page are actually about**.

### Slide 9 — Graph 3: The Topical Salience Graph (depth)
- Bipartite document↔entity edges, weighted by **salience** — how central an entity is to a document.
- Evidence: Cloud NL API `analyzeEntities` returns salience + KG `mid` for every entity — a live window into the mechanism.
- DOJ "ABC" signals: Anchors/Body/Clicks → Topicality. Anchors are a graph edge distinct from PageRank.
- Scores: **topical depth**.

### Slide 10 — Graph 4: The Behavioral Graph (satisfaction)
- Bipartite user↔document edges from clicks, dwell, Chrome visits — Navboost/Glue, running since ~2005 on 13 months of click data.
- Evidence: **sworn DOJ testimony** — Pandu Nayak: Navboost is "one of the important signals"; Eric Lehman: *"Pretty much everyone knows we're using clicks in rankings."* Corroborated by the 2024 leaked API docs (goodClicks, badClicks, lastLongestClicks).
- Scores: **satisfaction**. **(This is the graph most SEOs deny exists — and it's the one confirmed under oath.)**

### Slide 11 — Graph 5: The Authorship/Identity Graph (provenance)
- Person nodes → document edges: 2007 Agent Rank patent (author "digital signatures" as ranking signal) → 2011 rel=author → 2020 "Author Vectors" patent (algorithmic author ID from writing + behavioral patterns).
- The arc: explicit markup → dropped → **inferred identity**. E-E-A-T is this graph with a human-readable name.
- Scores: **provenance**.

### Slide 12 — Graph 6: The Local/Review Graph (prominence)
- Business↔place↔reviewer edges; Google's official trio: Relevance, Distance, **Prominence** (reviews, citations, brand reputation).
- Evidence: Search Atlas (3,269 businesses, Sept 2025) — review-count influence rises **19% → 26% in top-ten local results**; the review graph differentiates at the top.
- Scores: **prominence**.

### Slide 13 — Graph 7: The Trust/Spam Graph (safety)
- The link graph **re-walked** with teleportation restricted to human-verified seed sets (TrustRank, US7603350B1, US7533092B2); reliability decays with graph distance from seeds; Anti-Trust Rank runs in reverse from spam seeds.
- Same graph, different random walk. "PageRank and TrustRank are the same graph with different teleportation distributions."
- Scores: **trust**.

### Slide 14 — Graph 8: The Citation Graph (scholarly echo)
- Garfield's citation analysis → PageRank → Google Scholar. The scholarly sibling — mention it to complete the map, then move on (60s max).
- Scores: **scholarly authority**.

### Slide 15 — The map (RECAP SLIDE)
- Table: 8 graphs × what it scores (authority / understanding / depth / satisfaction / provenance / prominence / trust / scholarly).
- **Visual:** the same nodes, 8 overlapping translucent edge-layers. This is the slide people will photograph.

---

## SECTION 4 — HOW THE GRAPHS FUSE (Slides 16–21)

### Slide 16 — The production pipeline: Superroot
- Layered cascade (from antitrust disclosures):
  1. Candidate retrieval across **web index + KG + specialist indexes**
  2. First-pass scoring (PageRank, Q*, BM25-style)
  3. Navboost/Glue re-rank (behavioral graph)
  4. DeepRank/RankBrain/RankEmbed re-rank
  5. Twiddlers
  6. AI Overview generation (RAG over the ranked set)
- Early fusion → late fusion → ML fusion. Each stage is a different graph's signal.

### Slide 17 — The formal statement: Multiplex PageRank
- Halcão, Gómez, Arenas, Boccaletti, PLOS ONE 2013:
  > *"The centrality a node has in one layer affects the centrality the node can obtain in another layer."*
- One layer's scores **bias the random jumps in another layer**. This sentence is the thesis of the talk in math form.
- **Visual:** random walker hopping between layers.

### Slide 18 — Why fusion beats any single graph
- Chen (2022): global search on the multiplex beats any single layer in isolation (mean-first-passage-time result).
- Translation for SEOs: **a site strong on 5 graphs at 70% beats a site strong on 1 graph at 100%.** That's why "great links, mediocre everything else" keeps losing.

### Slide 19 — Heterogeneous Information Networks (the schema answer)
- Sun & Han: typed nodes, typed links, **meta-paths** (e.g., author→paper→venue→paper) compose layers into similarity and ranking measures.
- In Google terms: PageRank/TrustRank = same-layer different walks; Navboost = walk on the user–document bipartite graph; KG traversed at query understanding; learning-to-rank fuses late.

### Slide 20 — The False Precision slide ⭐
- The fusion **weights are not public**. The 2024 leak shows which attributes exist, not how they're weighted.
- "Anyone who tells you 'links are 23% of the algorithm' is selling you a number they cannot have. The graphs are real. The weights are not. Build for all eight; don't optimize for a number."
- *(Ties directly to Brian's 'False Precision' thesis from the UK SEO Summit talk.)*

### Slide 21 — Section recap
- Rankings = interference pattern of 8 overlapping graphs, fused in a cascade. This is proven machinery, not speculation — patents, testimony, and the math all agree.

---

## SECTION 5 — AI USES THE SAME TRICK (Slides 22–26)

### Slide 22 — RAG's founding pattern (Lewis et al., 2020)
- Generator + non-parametric memory: **dense vector index = a similarity graph** (nearest-neighbor edges) over ~21M Wikipedia passages.

### Slide 23 — GraphRAG: the KG gets layered on
- Microsoft GraphRAG (Edge et al., 2024): LLM builds an **entity knowledge graph** from source docs → Leiden communities → local/global search. Big gains over flat vector RAG.
- LightRAG (2024): dual-level retrieval fusing **graph structure + vector representations**.
- ACM TOIS 2025 survey: graph-based indexing → graph-guided retrieval → graph-enhanced generation.

### Slide 24 — Every pipeline fuses the same three graphs
- (a) **vector-similarity graph** + (b) **entity/knowledge graph** + (c) **document/citation graph**.
- Same three-layer shape as Google's index/KG/behavioral stack. Different century, same math.

### Slide 25 — The answer engines run multi-graph retrieval too
- **Perplexity:** 5-stage intent→retrieval→assessment→L1–L3 rerank→selection, with an engagement feedback loop that drops poor sources within ~a week — its own behavioral graph. (Reverse-engineered; flag as such.)
- **ChatGPT Search:** Bing-powered retrieval + hidden cached index + query fan-out; only **~15% of retrieved pages get cited** — retrieval gate, then citation gate (Sept 2026 study of 894 citations).
- **Bing Satori:** RDF/SPARQL entity engine; mines search logs to fuse the behavioral graph with the entity graph — same pattern as Google.
- **Gemini grounding stack:** Google Search + Google Maps + Vertex AI Search RAG, combinable — Google's official multi-graph tethering.

### Slide 26 — What this means
- "SEO" and "AI visibility" are not two disciplines. They're the same multi-graph game with a different final stage (ranked list vs. generated answer with citations). The 8-graph playbook applies to both.

---

## SECTION 6 — THE MULTI-GRAPH PLAYBOOK (Slides 27–33)

One workstream per graph — the "so what" for practitioners. Each: **do this** (1–2 concrete actions) + **why** (which graph it feeds).

### Slide 27 — Authority engineering (link + trust graphs)
- Build links from **seed-adjacent, editorially real** sources; proximity to trusted seeds beats raw volume. `siteAuthority` (leak) = quality metrics + content signals + link diversity.

### Slide 28 — Entity establishment (knowledge graph)
- Become resolvable: Wikipedia/Wikidata presence, consistent naming/NAP, schema.org `Organization`/`Person` with `sameAs`; aliases resolve to canonical `/m/` IDs — consistency across sources IS the mechanism of recognition.

### Slide 29 — Entity-dense topical content (salience graph)
- Mention target entities as **central to the document**, not passing mentions; topical clusters reinforce which entities a site "owns." Write extractable, definition-led sentences for AI citation.

### Slide 30 — Earn the click and the stay (behavioral graph)
- Navboost learns from 13 months of clicks/dwell: title/meta craft, SERP-feature capture, genuinely satisfying content, brand/navigational search behavior.

### Slide 31 — Consistent, verifiable authorship (identity graph)
- Named bylines + credentialed author pages + the **same author identity across domains** (the modern rel=author). Multi-domain publication histories and byline+expertise pages show higher AI citation rates.

### Slide 32 — Prominence as a campaign (review + mention graphs)
- Reviews (quantity, recency, keyword relevance, responses), citations, NAP consistency — review count's influence rises to 26% in top-ten local results.
- **Entity chains across the web:** brands are ~6.5× more likely to be cited via **third-party mentions** than from their own domain (practitioner data — flag as directional).

### Slide 33 — Pass the AI gates (citation graph)
- Technical gates first: Bing indexation, crawler access (OAI-SearchBot/ChatGPT-User), recency — 53% of AI-cited content was updated within 6 months (practitioner data — flag as directional).
- Then the citation gate: extractable evidence, freshness, per-engine formats.

---

## SECTION 7 — CLOSE (Slides 34–35)

### Slide 34 — The one-slide takeaway
- "Stop asking which graph matters most. Start asking which graph you're neglecting."
- Show the 8-graph map again with a simple self-audit checklist.

### Slide 35 — Closing quote + CTA
- Halcão et al.: *"The centrality a node has in one layer affects the centrality the node can obtain in another layer."*
- "Your brand is a node in eight graphs. Act like it."
- CTA: Fusion Vine / contact / slides link.

---

## APPENDIX — speaker notes & delivery

- **Pacing:** Sections 3 (the 8 graphs) is the longest — keep each graph to ~60s of hard evidence. Section 4 is the intellectual peak; slow down for Slide 17.
- **The two "wow" beats:** Slide 10 (Navboost confirmed under oath — "the graph most SEOs deny") and Slide 20 (False Precision — the weights are unknowable, so stop pretending).
- **Audience interaction:** Slide 2 poll ("how many graphs?"); Slide 34 self-audit ("which graph are YOU neglecting?").
- **Visuals to commission:** layered-graph hero visual (Slide 1/15/34), random-walker-between-layers animation (Slide 17), moiré interference visual (Slide 6).

## SOURCES (condensed from research report)

Patents: US9165040B1, US8972329B2, US7603350B1, US7533092B2, US8595225B1, US11762933B2, US11256866.
Testimony/docs: DOJ v. Google trial (Nayak, Lehman); 2024 Content Warehouse API leak; Cloud NL API docs; Vertex AI grounding docs; Singhal 2012 KG launch post.
Papers: Halcão et al. 2013 (Multiplex PageRank); Chen 2022; Sun & Han HIN; Lewis et al. 2020 (RAG); Edge et al. 2024 (GraphRAG); Guo et al. 2024 (LightRAG); Gyöngyi et al. 2004 (TrustRank); ACM TOIS 2025 GraphRAG survey.
Studies (practitioner — flag as directional on slides): Search Atlas local (Sept 2025); ChatGPT citations study (Sept 2026); GEO practitioner datasets (6.5×, 3×, 53% figures).
Full research report with ~60 sources: available in workspace research notes on request.

## OPEN QUESTIONS / things I could not fully verify

- Exact fusion weights inside Google's production ranker are not public — stated openly in Slide 20, so this is a feature, not a gap.
- Perplexity pipeline details (L1–L3, 0.7 threshold) are reverse-engineered, not official.
- GEO statistics (6.5×, 3×, 53%, 54% vs 29%) come from practitioner datasets, not peer-reviewed studies — mark as directional on the slide.
- Do NOT cite the ahrefs "1.6T facts / 54B entities" KG figure — it lacks a primary source. Use Google's 2012 official count only.
