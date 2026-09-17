---
name: Glacier Civic
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006399'
  on-secondary: '#ffffff'
  secondary-container: '#7bc2ff'
  on-secondary-container: '#004f7b'
  tertiary: '#00628d'
  on-tertiary: '#ffffff'
  tertiary-container: '#007cb1'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#cde5ff'
  secondary-fixed-dim: '#94ccff'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004b74'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4.25rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an ultra-clean, transparent, and authoritative interface tailored for civic technology, public infrastructure, and sovereign digital governance. It pairs institutional dignity with modern civilian convenience, projecting institutional trust, total clarity, and effortless access for all demographics.

### Design Philosophy
The visual language merges **Minimalism** with an **Architectural Glass & Tonal Layering** approach. Interfaces must remain airy, luminous, and uncluttered. Visual noise is aggressively eliminated so that critical public information, citizen services, and statutory processes remain immediately discoverable and legible. The mood is calm, crystalline, reliable, and respectful of diverse user fluencies, assistive technologies, and varying network environments.

### Core Principles
- **Uncompromised Accessibility First:** Every contrast ratio, target size, and semantic structure exceeds WCAG 2.1 AA mandates, treating digital equity as a foundational requirement rather than an afterthought.
- **Atmospheric Clarity:** Interfaces leverage cool glacial tints, pristine white canvas planes, and deep maritime blue typography to prevent fatigue while ensuring long-form readability.
- **Legitimate Authority Without Rigidity:** Structural clarity replaces bureaucratic density. System states are declared unambiguously through dual-encoded cues, crisp borders, and purposeful hierarchy.

## Colors

The color architecture is built around crisp glacial hues, anchored by authoritative marine accents and high-legibility dark slate typography. All text-to-background combinations achieve a minimum 4.5:1 contrast ratio, with critical UI elements and interactive affordances maintaining at least 3:1 against their canvas.

### Color Roles & Implementation
- **Primary Glacier Blue (`#0284c7`):** Primary actions, interactive focal points, active navigation states, and primary brand indicators. Provides an approachable yet formal voice.
- **Deep Marine Sovereign Accent (`#0369a1`):** High-importance calls-to-action, active tab indicators, key metric values, and primary headings requiring elevated authoritative presence.
- **Vibrant Glacier (`#0ea5e9`):** Accent highlights, focus rings, progress milestones, and active data visualization series.
- **Deep Slate Text Base (`#0f172a`):** Primary body text, labels, and table values (achieves 13.5:1 on pure white). Secondary body text uses `#334155` (7.1:1 contrast).
- **Background & Canvas Surfaces:**
  - Base Canvas: `#f8fafc` (Slate 50) creates subtle ambient depth beneath elevated panels.
  - Surface Pure: `#ffffff` for cards, document readers, tables, and modal dialogues.
  - Glacial Tint: `#f0f9ff` (Sky 50) and `#e0f2fe` (Sky 100) for interactive table hover bands, subtle card callouts, and system notification surfaces.
- **Semantic Feedback (Civic Calibrated):**
  - Success: `#047857` (Emerald 700) on `#ecfdf5` (Emerald 50).
  - Attention/Pending: `#b45309` (Amber 700) on `#fffbeb` (Amber 50).
  - Critical/Error: `#b91c1c` (Red 700) on `#fef2f2` (Red 50).
  - Neutral Notice: `#0369a1` (Sky 700) on `#f0f9ff` (Sky 50).

## Typography

The typographical pairing unites **Plus Jakarta Sans** for structural headlines with **Inter** for microcopy, data arrays, and long-form legal or citizen texts.

### Type Hierarchy & Usage Rules
- **Display & Headlines:** Plus Jakarta Sans introduces humanistic warmth with geometric balance, avoiding sterile corporate austerity while retaining state-level formality. Letter spacing is subtly tightened at display scales to enforce visual cohesion.
- **Body & Data:** Inter provides neutral clarity, prominent x-height, and unmistakable tabular figures, vital for civic registration numbers, identity certificates, and statutory records.
- **Accessibility Guidance:**
  - Paragraph width should strictly avoid exceeding 72 characters per line for optimal reading ease.
  - Text colors must never fall below `#334155` on light surfaces. Never use pure `#000000` text to prevent visual vibration against pure `#ffffff`.
  - Leading across all body types is preserved at or above 1.5× the font size to accommodate citizen readers of all ages and visual abilities.

## Layout & Spacing

This design system uses a strict 8pt structural rhythm combined with a 12-column responsive fluid grid centered inside max-width viewports.

### Grid Anatomy & Breakpoints
- **Mobile (< 640px):** 4-column layout, `margin-mobile` (1rem / 16px), `gutter-mobile` (1rem / 16px). Content flows into a single-column linear hierarchy. Secondary utility columns collapse beneath main citizen tasks.
- **Tablet (640px – 1024px):** 8-column layout, `margin` (2rem / 32px), `gutter` (1.5rem / 24px). Accommodates dual-pane application review and document preview panels.
- **Desktop (1024px – 1440px):** 12-column layout, `margin-desktop` (3rem / 48px), `gutter` (1.5rem / 24px), capped at a max-content width of `1280px` for high-density administrative dashboards and `896px` for standard procedural workflows.

### Spacing Philosophy
- Component-internal paddings rely strictly on `space-sm` (8px) and `space-md` (16px) to maintain a compact, deliberate density.
- Card groupings and form sections utilize `space-lg` (24px) to guarantee optical independence between distinct questions or data groups.
- Major page partitions employ `space-xl` (40px) to give citizens clarity during complex sovereign submissions.

## Elevation & Depth

Visual hierarchy is communicated via **Tonal Stacking** paired with ultra-diffused, cool-tinted **Ambient Glacial Shadows** and razor-sharp border boundaries. Heavy drop shadows and dark cast shadows are prohibited to preserve a clean, luminous aesthetic.

### Surface Elevation System
- **Level 0 (Canvas Base):** `#f8fafc`. Root plane across all backdrops and administrative sidebars.
- **Level 1 (Card & Content Panels):** `#ffffff` resting on Canvas. Outlined with a soft low-contrast border: `1px solid #e2e8f0`. Shadow: `0 1px 3px 0 rgba(2, 132, 199, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Interactive Floating Elements, Dropdowns, Flyouts):** `#ffffff`. Outlined with `1px solid #cbd5e1`. Shadow: `0 4px 12px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.06)`.
- **Level 3 (Modals & Sovereign Dialogues):** `#ffffff`. Shadow: `0 20px 25px -5px rgba(3, 105, 161, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`. Accompanied by a frosted glacial backdrop overlay (`rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(4px)`).

### Focus & Accessibility Rings
All focus-visible states must project an outer ring of `2px solid #0ea5e9` with an intentional `2px` offset (`#ffffff` spacing gap), guaranteeing immediate discoverability for switch-access and keyboard-only operators.

## Shapes

The design system maintains a **Soft** shape profile (`roundedness: 1`), projecting stability, order, and crisp institutional structure without appearing harsh or brutalist.

### Radii Application Map
- **Base Components (`rounded`, 0.25rem / 4px):** Checkboxes, small tag badges, table cell action menus, code snippets, and micro-toggles.
- **Medium Components (`rounded-lg`, 0.5rem / 8px):** Buttons, form inputs, select triggers, cards, notification banners, and data preview cells.
- **Large Panels (`rounded-xl`, 0.75rem / 12px):** Primary document containers, authentication containers, modals, and slide-over side drawers.
- **Pill Exception (`rounded-full`, 9999px):** Strictly reserved for dual-encoded status badges (e.g., "Verified", "Action Required") and circular avatar glyphs. Interactive buttons must strictly retain the 0.5rem radius to prevent confusion with status badges.

## Components

### Buttons
- **Primary:** Solid `#0284c7` background, white bold text, `0.5rem` radius, padding: `0.625rem 1.25rem`. Hover: `#0369a1`. Active: `#075985`. Focus: `2px` offset with `#0ea5e9` ring.
- **Secondary (Glacial Tint):** Background `#f0f9ff`, text `#0369a1`, border `1px solid #bae6fd`. Hover: background `#e0f2fe`, border `#7dd3fc`.
- **Tertiary / Ghost:** Transparent background, text `#334155`. Hover: background `#f1f5f9`, text `#0f172a`.
- **Minimum Target Rule:** Every button maintains a minimum touch boundary of `44px × 44px` regardless of visual label size.

### Dual-Encoded Civic Status Badges
Status indicators must never communicate state solely via color; they pair an SVG icon with high-contrast text.
- **Verified / Approved:** Pill shaped. Background `#ecfdf5`, text `#065f46`, border `1px solid #a7f3d0`. Preceded by a checkmark icon.
- **Pending / In Review:** Background `#fffbeb`, text `#92400e`, border `1px solid #fde68a`. Preceded by a clock icon.
- **Revoked / Action Urgent:** Background `#fef2f2`, text `#991b1b`, border `1px solid #fecaca`. Preceded by an alert triangle icon.
- **Informational / Sovereign Notice:** Background `#f0f9ff`, text `#0369a1`, border `1px solid #bae6fd`. Preceded by an information circle icon.

### Form Inputs & Select Controls
- Surface `#ffffff`, border `1px solid #cbd5e1`, border radius `0.5rem`, padding `0.625rem 0.875rem`. Text: `1rem` Inter (`#0f172a`), placeholder text `#64748b`.
- **Active / Focus:** Border shifts to `#0284c7` with an exterior glow ring (`0 0 0 3px rgba(14, 165, 233, 0.25)`).
- **Error State:** Border shifts to `#dc2626` accompanied by an inline helper text block prefixed with an explicit error icon and `aria-live="polite"` binding.

### Checkboxes & Radio Buttons
- Width and height: `20px × 20px`. Border `1.5px solid #94a3b8`, background `#ffffff`.
- Selected state: background `#0284c7`, border `#0284c7`, displaying an inverted crisp white glyph. Focus outlines display a `2px` offset ring in `#0ea5e9`.

### Cards & Sovereign Dossiers
- Background `#ffffff`, border `1px solid #e2e8f0`, radius `0.5rem`, interior padding `1.5rem`.
- Features an optional Glacier Accent line: a `3px` top border in `#0284c7` to designate authentic sovereign certification or primary workflow focus.

### Lists & Data Registers
- Data tables use alternating zebra striping using `#ffffff` and `#f8fafc` with subtle `1px solid #f1f5f9` dividers.
- Hover state highlights rows with an ice tint (`#f0f9ff`) and an accent bar on the leftmost edge (`2px solid #0ea5e9`), keeping deep registry data easily trackable during long sessions.

### Additional Civic Components
- **Identity / Verification Callout:** A specialized ice-blue container (`#f0f9ff`) with a deep marine left border (`4px solid #0369a1`), housing national ID credentials, timestamp confirmations, or non-repudiation cryptographic signatures.
- **Stepwise Progress Ribbon:** Linear workflow indicators for permit, legal, and certificate processes. Active steps display `#0284c7` filled badges; complete steps render `#0369a1` with check icons; upcoming steps use muted slate outlines (`#cbd5e1`) with `#64748b` text.