# Memory — Setu Project Context

Working memory for anyone (human or Claude) picking this project back up. Keep this current as decisions are made.

## One-liner
Setu ("bridge") aggregates citizen infrastructure requests (voice/SMS/chat) across BRICS nations, fuses them with demographic/infra/budget data, and gives policymakers an explainable, ranked list of what to fund next — built as an open-source Digital Public Good.

## Companion docs
- `prd.md` — what we're building and why
- `Architecture.md` — how it's built, incl. ADR log
- `Rules.md` — hard constraints (governance, privacy, AI, security, a11y)
- `Design.md` — design tokens, screens, Stitch prompts

## Glossary
| Term | Meaning |
|---|---|
| BRICS | Brazil, Russia, India, China, South Africa (+ expanded members) |
| DPG | Digital Public Good — open, reusable, standards-based software for public benefit |
| DPI | Digital Public Infrastructure (e.g., India Stack, Brazil's gov.br) |
| ASR | Automatic Speech Recognition (voice → text) |
| IVR | Interactive Voice Response (phone call menu system) |
| PII | Personally Identifiable Information |
| Demand signal | A clustered, deduplicated group of citizen reports about the same underlying issue |
| Priority score | Explainable ranking combining demand, demographics, infra deficit, and budget fit |
| Federated deployment | One sovereign instance per nation, shared open-source core, no cross-border raw data |

## Key decisions so far (see `Architecture.md` for full ADRs)
- ADR-001: Kafka over managed cloud pub/sub — portability for a DPG.
- ADR-002: Batch server-side ASR for MVP, not real-time edge inference.
- ADR-003: Federated per-nation data plane — no centralized citizen data store.
- License: Apache-2.0 for the core platform.
- Name: **Setu** — chosen for cross-BRICS legibility of "bridge" as a concept.

## Stakeholders / personas
Citizen (reporter), Local official (triage), National policymaker (decision-maker), Civil-society auditor (transparency), Platform integrator (a second adopting nation).

## Current phase
MVP scoping (hackathon stage) — see `prd.md` §7 Phased Roadmap.

## Open questions
- Which BRICS nation is the reference pilot for MVP?
- Which 3 languages ship first, and who validates ASR accuracy for them?
- Who is the human sign-off authority for funding recommendations (per `Rules.md` §3)?
- Do we need a bilateral data agreement before any opt-in cross-nation aggregate benchmark ships?

## Next actions
- [ ] Confirm pilot nation + first 3 languages
- [ ] Stand up Kafka + gateway skeleton per `Architecture.md` §2
- [ ] Build citizen home + status tracker screens from `Design.md` §6 Stitch prompts
- [ ] Run first accessibility pass against `Design.md` §4 checklist
- [ ] Draft the public "how prioritization works" methodology page (transparency requirement, PRD §6)
