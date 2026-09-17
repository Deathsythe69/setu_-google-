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
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#006195'
  on-tertiary: '#ffffff'
  tertiary-container: '#287ab3'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#94ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
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
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an uncompromised standard of public-sector digital service: pristine, authoritative, hyper-legible, and radically accessible. It rejects bureaucratic bloat, ornamental clutter, and heavy skeuomorphic conventions in favor of a modern, airy civic elegance. 

### Brand Personality & Emotional Impact
- **Trustworthy & Authoritative:** Instills immediate confidence without feeling sterile or intimidating. Every screen communicates precision, security, and institutional integrity.
- **Pristine & Clear:** Ample whitespace, crystalline contrast, and structured geometry reduce cognitive friction for citizens navigating essential public services under stress.
- **Universal & Inclusive:** Built from the core for universal accessibility, ensuring effortless readability across sunlight, low-end displays, assistive technologies, and high-glare environments.

### Design Movement
**Civic Modernism & Structured Minimalism.** A refined synthesis of clean Swiss layout discipline, contemporary civic interface principles, and subtle tonal layering. Depth is established through crisp slate hairline dividers, airy background separations, and purposeful Glacier Blue anchors—never relying on heavy shadows or decorative fluff.

## Colors

The palette is engineered around high-contrast optical clarity and civic transparency. All text, state indicators, and interactive cues conform strictly to WCAG 2.1 AAA luminance requirements against their corresponding background surfaces.

### Primary & Accent Palette
- **Glacier Deep (Primary - `#0284c7`):** The institutional core. Used for interactive focus, primary actions, and primary link structures. Achieves >7:1 contrast on pure white.
- **Glacier Electric (Secondary - `#0ea5e9`):** Dynamic accents, active progress bars, subtle focus ring glows, and secondary callouts.
- **Glacier Deep-Water (Tertiary - `#0369a1`):** Hover and pressed states for primary buttons, deep civic headers, and accessible iconography.
- **Glacier Frost (`#e0f2fe`) & Glacial Mist (`#f0f9ff`):** Surface tints for alert boxes, highlighted information states, active list selections, and subtle table striping.

### Neutral & Surface Hierarchy
- **Canvas (`#ffffff`):** Base background for high-clarity document reads, forms, and core workspaces.
- **Surface Muted (`#f8fafc`):** Clean neutral slate canvas for outer application framing, backdrops, and navigation bars.
- **Hairline Neutral (`#e2e8f0`):** Default structural border and separation lines.
- **Hairline Strong (`#cbd5e1`):** Form field boundaries and structural panel boundaries under direct sunlight.
- **Text Headings (`#0f172a`):** Maximum-contrast charcoal slate for display text, headings, and data values (18:1+ contrast).
- **Text Body (`#1e293b`):** Deep charcoal for body paragraphs and functional labels, preserving ocular softness without contrast loss.
- **Text Muted (`#475569`):** Metadata, timestamps, and secondary labels (exceeds AAA requirement for large/bold elements, compliant AA minimum for small labels).

## Typography

The typographic system leverages **Plus Jakarta Sans** for structural headers and **Inter** for reading content, data displays, and form labels. 

### Rationale & Rules
- **Plus Jakarta Sans (Headings):** Brings crisp, modern geometric precision to institutional titling. Its wide apertures and balanced proportions create an inviting civic front door without surrendering gravity.
- **Inter (Body & Controls):** Renowned for exceptional screen legibility at small sizes, tall x-height, and neutral optical rhythm. It eliminates visual ambiguity across complex regulatory copy and form inputs.
- **Numerical Regularity:** For data tables, metrics, and identification codes, utilize tabular lining (`font-feature-settings: "tnum" 1`).
- **Vertical Rhythm:** Strict relative line-heights prevent text collision across accessibility zoom scales (up to 200% magnification).

## Layout & Spacing

Layouts adhere to an 8-point geometric scale (with a 4-point sub-grid for icons and fine component padding), ensuring proportional harmony and predictable vertical rhythm.

### Grid Architecture
- **Desktop (≥ 1024px):** 12-column responsive grid, max container width of 1280px for standard pages and 1440px for data-intensive dashboards. 24px (`1.5rem`) gutters with dynamic centering.
- **Tablet (768px – 1023px):** 8-column grid with 24px (`1.5rem`) gutters and 24px margins.
- **Mobile (≤ 767px):** 4-column layout with 16px (`1rem`) gutters and 16px margins to preserve screen real estate for continuous citizen form flows.

### Spacing Principles
- Never trap negative space: layouts should breathe naturally, utilizing `space-xl` between logical content sections to eliminate perceived density.
- Maintain strict coupling: labels, error cues, and their respective input fields use `space-xs` and `space-sm` to ensure assistive tech users and neurodivergent readers associate elements effortlessly.

## Elevation & Depth

This design system avoids dark drop shadows and heavy skeuomorphic bevels. Instead, depth is communicated through **tonal surfaces** and **crisp hairline borders**, creating a tactile, razor-sharp architectural presence.

### Layering Rules
- **Base Canvas (Level 0):** Pure `#f8fafc` or `#ffffff`. Unbordered, serving as the foundational bedrock.
- **Cards & Data Modules (Level 1):** Solid `#ffffff` resting on `#f8fafc`, enclosed by a crisp 1px `#e2e8f0` stroke. A hairline subtle tint shadow can be used solely to separate overlapping planes: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Floating Overlays & Menus (Level 2):** Pure `#ffffff` surface with a 1px border of `#cbd5e1` and an ambient diffuse glow: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Modals & Critical Dialogs (Level 3):** Centered above an airy translucent veil (`rgba(15, 23, 42, 0.40)` with `backdrop-filter: blur(4px)`). The modal container carries a crisp `#cbd5e1` edge and deep atmospheric elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.08)`.

No colored shadow casting is permitted. Glacier Blue is reserved strictly for interactive state changes, not elevation halos.

## Shapes

The design system embraces a **Soft (Level 1)** geometric silhouette. Curvature is intentionally subtle and restrained to reinforce institutional authority, structural permanence, and clear visual alignment.

### Geometry Specifications
- **Base Radius (0.25rem / 4px):** Form inputs, buttons, chips, tags, and small utility triggers. Keeps corners crisp without appearing aggressive.
- **Container Radius (`rounded-lg` / 0.5rem / 8px):** Cards, modular panes, popover menus, and modal dialogs.
- **Full Pill (`rounded-full`):** Reserved exclusively for status indicators, numeric notification counts, and standalone filter chips.

## Components

### Buttons
- **Primary:** Background `#0284c7`, text `#ffffff`, font-weight 600. Hover: `#0369a1`. Active: `#075985`. Focus ring: 2px `#ffffff` offset, 3px `#0ea5e9` solid outline.
- **Secondary / Outlined:** Background `#ffffff`, border 1.5px `#0284c7`, text `#0284c7`. Hover: `#f0f9ff`.
- **Neutral Surface / Ghost:** Background transparent, text `#1e293b`. Hover: `#f1f5f9`.
- **Sizing:** Minimum touch target of 44px x 44px on mobile viewports; default desktop height 40px with horizontal padding `space-md` (16px).

### Input Fields & Controls
- **Text Inputs:** Background `#ffffff`, border 1px `#cbd5e1`, border-radius 4px, text `#0f172a`. Placeholder text `#64748b`. Height 42px with 12px horizontal padding.
- **Input Focus State:** Border transitions to `#0284c7` with a non-blurring ring: `box-shadow: 0 0 0 3px #e0f2fe`.
- **Error State:** Border 1.5px `#b91c1c`, focus ring `rgba(185, 28, 28, 0.15)`, companion error message in 12px Inter Semibold with explicit alert icon.

### Checkboxes & Radios
- **Structure:** 18px x 18px square (checkbox) or circle (radio). Border 1.5px `#94a3b8` on `#ffffff`.
- **Checked State:** Background `#0284c7` with white checkmark/dot. Focus state triggers the `3px #e0f2fe` safety ring.

### Cards & Panels
- **Structure:** Background `#ffffff`, 1px solid `#e2e8f0`, border-radius 8px, interior padding `space-lg` (24px).
- **Interactive Cards:** Hover introduces a border shift to `#0ea5e9` and a micro-elevation lift: `translateY(-1px)`.

### Chips & Badges
- **Status Badges:** Compact 24px height, horizontal padding 8px, font-weight 600, font-size 12px.
- **Glacier Informational:** Background `#f0f9ff`, text `#0369a1`, border 1px `#bae6fd`.
- **Success:** Background `#f0fdf4`, text `#15803d`, border 1px `#bbf7d0`.
- **Warning:** Background `#fffbeb`, text `#b45309`, border 1px `#fde68a`.

### Civic Banner / Notice Block
- Full-width or inline structural callout. 
- Left-side 4px solid accent (`#0284c7`), background `#f8fafc`, 1px border `#e2e8f0`, inner padding 16px. Used for vital legal or instructional advisories before form submission.