# PRD — Setu: BRICS Citizen-to-Infrastructure Intelligence Platform

**Setu** (Sanskrit/Hindi: "bridge") — an AI platform that bridges citizen voice and national infrastructure planning.

**Status:** Draft v1.0 · **Theme:** BRICS Innovation Challenge · **Owner:** Product/Eng

---

## 1. Problem

Citizen development requests (broken roads, water shortage, unsafe transit, power outages) enter through disconnected channels — local calls, paper petitions, scattered apps — and never reach a form policymakers can act on. Result: infrastructure spend misaligned with real demand, gaps that never surface nationally, and no way to measure whether public investment actually reduced the problem it targeted.

## 2. Goals

| # | Goal |
|---|------|
| G1 | Let any citizen report a development need by **voice, SMS, or chat app**, in their own language |
| G2 | Turn raw reports into structured, deduplicated, geotagged demand signals at national scale |
| G3 | Fuse demand signals with demographic, infrastructure-index, and budget data to surface **priority hotspots** |
| G4 | Give policymakers a ranked, explainable list of recommended projects — not a black box score |
| G5 | Close the loop: citizens can see status and measured impact of what they reported |
| G6 | Ship as a **Digital Public Good (DPG)**: open source, interoperable, reusable by any BRICS (and non-BRICS) nation |

### Non-Goals (v1)
- Not a payments or benefits-disbursement system.
- Not a general-purpose government CRM — scope is limited to infrastructure/development requests.
- Not making autonomous funding decisions — the system recommends, humans decide (see `Rules.md` §3).

## 3. Users & Personas

| Persona | Need | Primary Channel |
|---|---|---|
| **Citizen** | Report an issue fast, in own language/script, low literacy or low bandwidth ok | IVR voice call, WhatsApp/Telegram, SMS, PWA |
| **Local official** | Triage, verify, and route reports for their ward/district | Web console |
| **National policymaker** | See ranked, explainable investment recommendations across regions | Dashboard |
| **Civil-society / auditor** | Verify spend matches demand, track impact | Public transparency portal |
| **Platform integrator** (another nation) | Deploy the DPG in their own country/language | Docs + Helm chart |

## 4. Core Features

**Ingestion**
- Multilingual IVR (voice) with ASR + intent detection
- WhatsApp/Telegram/SMS bot with structured + free-text capture
- Lightweight PWA for smartphone users, works offline-first
- Photo/geotag attachment where available

**Intelligence**
- Speech-to-text + translation for 15+ regional languages/scripts at launch
- Deduplication & clustering of near-identical reports into a single "demand signal"
- Category/entity extraction (roads, water, power, sanitation, transit, health infra…)
- Sentiment & urgency scoring

**Prioritization**
- Fusion engine combining: demand volume/urgency + demographic weight (population density, vulnerability index) + existing infrastructure-deficit index + available budget envelope
- Explainable priority score (every ranked project shows *why*, not just a number)
- Scenario simulator: "what if we fund X instead of Y"

**Policymaker Tools**
- National/regional hotspot map
- Ranked project recommendation queue with drill-down evidence
- Budget-vs-demand alignment view
- Impact tracking after funding (before/after indicators)

**Transparency & Trust**
- Public portal: aggregate (anonymized) demand map + funded-project status
- Status tracker for citizens on their own submissions

## 5. Success Metrics (KPIs)

| Metric | Target (Year 1) |
|---|---|
| Reports successfully classified without human correction | ≥ 85% |
| Median time from report → visible on policymaker dashboard | < 24 hours |
| Languages/scripts supported at launch | ≥ 10 |
| % of funded projects traceable to an aggregated demand signal | ≥ 70% |
| Citizen status-check return rate (proxy for trust) | ≥ 30% of submitters check back |
| Platform reused by a second BRICS nation within 12 months | 1+ nation |

## 6. Digital Public Good Requirements

Must meet the **DPG Standard** (Digital Public Goods Alliance) at launch:
1. Relevance to UN SDGs (SDG 9, 11, 16)
2. Open license (see `Rules.md` §1)
3. Clear ownership + documentation (this doc set)
4. Platform independence — no single cloud vendor lock-in
5. Do-No-Harm by design (privacy, misinformation, exclusion review — see `Rules.md`)
6. Uses open data standards where possible (e.g., GovStack building blocks, open geospatial standards)

## 7. Phased Roadmap

| Phase | Scope |
|---|---|
| **MVP (Hackathon)** | 1 nation, 3 languages, WhatsApp + web intake, manual-assisted clustering, static priority dashboard |
| **Phase 2** | Voice/IVR + SMS, ML clustering & scoring, 1 additional BRICS pilot nation, public transparency portal |
| **Phase 3** | Full multi-nation federation, budget/impact feedback loop, open DPG release + reference deployment docs |

## 8. Risks

| Risk | Mitigation |
|---|---|
| Low trust / fear of surveillance | Anonymized aggregation by default, opt-in for status tracking, open-source auditability |
| Language/dialect coverage gaps | Human-in-the-loop review queue for low-confidence transcriptions |
| Gaming the system (spam/duplicate reports) | Rate limits, dedup, phone/identity risk scoring (not hard KYC) |
| Political misuse of prioritization | Explainable scores + published methodology + independent audit hooks |
| Data residency conflicts across nations | Federated, per-nation sovereign data plane (see `Architecture.md`) |

## 9. Out of Scope (v1)
Grievance redressal/legal escalation workflows, direct fund disbursement, cross-border data pooling without explicit bilateral agreement.
