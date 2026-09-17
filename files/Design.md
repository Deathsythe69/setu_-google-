# Design — Setu

Design language for a voice-first, multilingual, trust-critical civic platform. Screens below are written as ready-to-paste prompts for **Google Stitch** (labs.google.com/stitch) — paste a block under "Generate in Stitch" to get a first-pass UI, then run it through the critique + accessibility checklists here before handoff.

## 1. Design Principles
1. **Voice- and low-literacy-first** — icons + color carry meaning before text does; every text label has a matching universally-recognizable icon.
2. **Trust through transparency** — status, source, and "why this was prioritized" are always visible, never hidden behind a tooltip.
3. **Script-agnostic** — layouts must not break under Devanagari, Cyrillic, Han, or Arabic (RTL) text at 200% zoom.
4. **Consistency over creativity** — one shared token set and component library across the citizen app, dashboard, and public portal.

## 2. Design Tokens

| Category | Tokens |
|---|---|
| Color (semantic) | `color-primary` (trust blue), `color-success` (project funded/green), `color-warning` (pending/amber), `color-critical` (urgent/red), `color-neutral-{50…900}` |
| Typography | `font-family-latin`, `font-family-devanagari`, `font-family-cjk`, `font-family-arabic` (each mapped to a variable font with wide Unicode coverage); scale: `text-xs…text-3xl`; line-height ≥ 1.5 for body text (non-Latin scripts need more) |
| Spacing | 4px base scale: `space-1(4px) … space-8(64px)` |
| Radius | `radius-sm(4px)`, `radius-md(8px)`, `radius-full` (pill, for voice-record button) |
| Elevation | `elevation-0…3` (cards, modals) |
| Motion | `duration-fast(120ms)`, `duration-base(200ms)`, standard ease-out |

Hardcoded hex/px values are not allowed outside the token file (see `Rules.md` §4 — code review gate).

## 3. Core Screens (by persona)

| Screen | Persona | Key components |
|---|---|---|
| Report an issue (voice-first home) | Citizen | Big pill "Record" button, category icon grid, language switcher |
| Submission confirmation + status tracker | Citizen | Status timeline (Received → Clustered → Under Review → Funded), plain-language copy |
| Hotspot map | Policymaker | Choropleth/heatmap, filter by sector/region, cluster drill-down |
| Priority queue | Policymaker | Ranked list, explainable score chip ("why #1"), scenario toggle |
| Project detail | Policymaker | Evidence trail (linked demand signals), budget-vs-demand chart, impact indicators |
| Public transparency portal | Citizen/Auditor | Anonymized aggregate map, funded-project status, methodology link |

### Component: Voice-Record Button
| State | Visual | Behavior |
|---|---|---|
| Default | Large primary pill, mic icon | Tap/tap-and-hold to start |
| Recording | Pulsing ring, waveform, timer | Tap to stop, auto-stop at 90s |
| Processing | Spinner + "Understanding your report…" | Non-blocking, can navigate away |
| Error | Critical color, retry icon | Clear one-line reason, retry action |

**Accessibility:** role=`button`, `aria-pressed` for recording state, min touch target 56×56px (exceeds the 44×44 AA minimum given older/feature-phone-adjacent users), visible focus ring, screen reader announces state changes ("Recording started", "Recording stopped, processing").

## 4. Accessibility Checklist (WCAG 2.1 AA — apply to every screen before build)

| # | Criterion | Check |
|---|---|---|
| 1.4.3 | Contrast ≥ 4.5:1 body text, ≥ 3:1 large text | Verify against dark/light theme both |
| 1.4.11 | Non-text UI contrast ≥ 3:1 | Icons, chart lines, focus rings |
| 2.1.1 | Full keyboard operability | Dashboard and portal, not just citizen app |
| 2.5.5 | Touch target ≥ 44×44px | 56×56 for primary voice/report actions |
| 2.4.7 | Visible focus indicator | Especially on dark map/hotspot backgrounds |
| 3.3.2 | Labels/instructions on every input | Include in every supported language, not just English |
| 4.1.2 | Name, role, value for custom components | Voice button, status timeline, score chips |

## 5. Design Critique Heuristics (run before every screen ships)
1. **First impression (2s):** does the primary action (report / review priority) draw the eye first?
2. **Usability:** can a first-time, low-literacy user complete the task without reading instructions?
3. **Visual hierarchy:** does urgency (color/size) match actual urgency, not just visual weight?
4. **Consistency:** same icon/color always means the same thing across citizen app, dashboard, and portal.
5. **Accessibility:** contrast, touch targets, alt text, screen-reader flow (checklist above).

## 6. Generate in Stitch

Paste each block into Google Stitch to generate a first-pass screen, then run it through §4 and §5 above.

**Citizen home / report screen:**
> "Mobile-first civic app home screen for reporting local infrastructure problems (roads, water, power). Large circular microphone 'record' button as primary action, secondary icon grid for categories (road, water, electricity, sanitation, transit), language switcher in top bar, warm trustworthy blue palette, generous touch targets, supports Devanagari and Latin script, minimal text, works for low-literacy users."

**Status tracker:**
> "Simple vertical status timeline screen for a citizen tracking their submitted infrastructure report: steps Received → Clustered with similar reports → Under policymaker review → Funded/In progress → Completed. Plain language, icons over text, progress highlighted in green, calm and reassuring tone."

**Policymaker hotspot dashboard:**
> "Government policymaker dashboard, dark-mode-friendly, national map with color-coded infrastructure demand hotspots, left sidebar filter by sector and region, right panel showing a ranked list of recommended projects with an explainability chip showing why each is ranked, professional data-dense but uncluttered style."

**Project detail / evidence view:**
> "Detail panel for a single recommended infrastructure project: header with project name, region, and priority score breakdown shown as a small stacked bar (demand, demographic need, infra deficit, budget fit), below it a chart comparing allocated budget vs. demand, and a scrollable list of linked citizen demand-signal clusters as evidence."

**Public transparency portal:**
> "Public-facing transparency web page: anonymized national map of aggregated citizen demand (no personal data), list of funded projects with status badges, a short 'how prioritization works' explainer section, clean civic-tech aesthetic, high contrast, multilingual toggle."
