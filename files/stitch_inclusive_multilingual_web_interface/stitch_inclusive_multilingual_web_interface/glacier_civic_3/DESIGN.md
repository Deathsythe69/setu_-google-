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
  tertiary: '#006387'
  on-tertiary: '#ffffff'
  tertiary-container: '#007da9'
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
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-xl:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: 2rem
    letterSpacing: -0.01em
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
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
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
  gutter-desktop: 2rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
---

## Brand & Style

This design system delivers an institutional, transparent, and modern identity tailored for sovereign public infrastructure, digital public services, and civic administration. The aesthetic fuses Nordic-inspired minimalism with rigorous public-sector clarity.

### Target Audience & Emotional Response
- **Audience:** Broad civic constituency, civil servants, policy makers, and enterprise partners demanding fault-tolerant clarity, immediate comprehensibility, and dignified utility.
- **Tone & Mood:** Authoritative yet approachable, immaculate, airy, and trustworthy. The interface evokes stability and openness, eliminating visual noise to foster civic confidence.
- **Design Movement:** Clean Modern Minimalism with subtle icy surface layering. Prioritizes pure canvas grounds, razor-sharp boundary delineation, precise typographic hierarchy, and purposeful glacier-tinted functional accents over decorative elements.

## Colors

The color architecture is built around an arctic spectrum tuned for accessible legibility (WCAG 2.1 AA+ compliant). It pairs deep oceanic slates with crystalline sky tones on clean white and ice-tinted surfaces.

### Functional Roles
- **Primary (`#0284c7`):** Primary action triggers, key interactive states, prominent brand markers, and focused navigation items. Achieves >4.5:1 contrast against pure white backgrounds for large text and high-contrast graphical elements.
- **Secondary (`#0369a1`):** High-contrast text links, dark interactive states (hover/active), and critical civic indicators requiring a strict 7:1+ contrast ratio against light backgrounds.
- **Tertiary (`#38bdf8`):** Decorative progress fills, non-text focus halos, active step indicators, and soft accents.
- **Neutral Core (`#0f172a`):** Primary typography and essential structural boundaries, guaranteeing >13:1 contrast over white canvas for maximum legibility.
- **Surface Foundations:**
  - `surface-base`: `#ffffff` (pure white canvas for forms and reading panes).
  - `surface-subtle`: `#f0f9ff` (pale glacial tint for page backdrops, inactive card fills, and sidebars).
  - `surface-tint`: `#e0f2fe` (interactive hover fills, selected row highlights, and informational callout containers).
- **Borders & Dividers:**
  - `border-subtle`: `#e2e8f0` (default structural separation).
  - `border-glacier`: `#bae6fd` (accented component perimeters, active inputs, and highlighted cards).
- **Semantics:**
  - Positive / Success: `#047857` (Deep Emerald on `#ecfdf5`).
  - Warning: `#b45309` (Amber Stone on `#fffbeb`).
  - Critical / Error: `#b91c1c` (Crimson Carmine on `#fef2f2`).

## Typography

Typography pairs **Plus Jakarta Sans** for structural display and headings with **Inter** for dense civic narratives, forms, and administrative dashboards.

### Rules & Application
- **Clarity First:** Heading sizes use tighter letter-spacing to present a deliberate, modern civic architecture. Body text utilizes standard tracking to maintain open counters and optimal scanning.
- **Reading Comfort:** Body copy must not exceed 75 characters per line on desktop viewports. Line heights remain generous across all tiers to assist readers across all age groups and visual abilities.
- **Monospace Fallbacks:** Numerical data, reference codes, application IDs, and fiscal figures default to tabular figures (`font-variant-numeric: tabular-nums;`) using `Inter` to preserve column alignment across records.

## Layout & Spacing

The layout is grounded in a 12-column responsive fluid grid designed to communicate precision, spatial breathability, and institutional order.

### Layout Model
- **Grid Architecture:** 12 columns on desktop (`>= 1024px`), 8 columns on tablet (`768px – 1023px`), and 4 columns on mobile (`< 768px`).
- **Maximum Width:** Content containers lock at `1280px` maximum width to preserve comfortable reading spans on ultra-wide screens.
- **Rhythm & Grid:** Built on an 8px baseline rhythm (`space-xs` through `space-3xl`). Micro adjustments (such as icon alignment or fine label paddings) leverage the 2px/4px sub-grid (`space-2xs` / `space-xs`).
- **Breakpoint Adaptations:**
  - **Desktop (`>= 1024px`):** Full 12 columns, `3rem` section margins, side navigation persists, multi-column form rows.
  - **Tablet (`768px - 1023px`):** 8 columns, `1.5rem` margins, collapsed utility rails, responsive 2-column forms.
  - **Mobile (`< 768px`):** 4 columns, `1rem` margins, single-column stacks, pinned high-priority sticky actions.

## Elevation & Depth

To preserve an airy, civic-grade aesthetic, this design system avoids heavy drop shadows and aggressive skeuomorphic modeling. Hierarchy is conveyed through **tonal layering**, **crisp boundary borders**, and **subtle, cool-tinted ambient glows**.

### Elevation Hierarchy
- **Level 0 (Floor/Canvas):** Default background `#f0f9ff` or `#ffffff`. Flat, no elevation.
- **Level 1 (Structural Cards & Modules):** Pure white background (`#ffffff`), bounded by a hairline border (`1px solid #e2e8f0`). Shadow: `0 1px 3px 0 rgba(2, 132, 199, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Interactive Floating Cards, Flyouts & Dropdowns):** Pure white background (`#ffffff`), bordered by `#bae6fd`. Shadow: `0 4px 6px -1px rgba(2, 132, 199, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Overlays, and Drawer Dialogs):** Pure white background (`#ffffff`), framed with a crisp border (`1px solid #cbd5e1`). Shadow: `0 20px 25px -5px rgba(2, 132, 199, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`. Accompanied by a frosty backdrop veil: `rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(4px)`.

## Shapes

The design system adopts a **Soft (Level 1)** shape language. This creates a crisp, disciplined, and institutional tone that feels modern without drifting into overly casual or rounded geometry.

### Radius Assignments
- **Micro Radii (`0.125rem` / 2px):** Checkboxes, tags, indicators, and inline code tags.
- **Base Components (`0.25rem` / 4px):** Primary buttons, input controls, select menus, chips, notification banners, and table rows.
- **Container Radii (`0.5rem` / 8px):** Structural cards, modal dialogues, segmented content blocks, and dropdown panels.
- **Large Panels (`0.75rem` / 12px):** Hero feature banners and sovereign platform canvases.

## Components

### Buttons
- **Primary:** Background `#0284c7`, foreground `#ffffff`, border none, border-radius `0.25rem`. Height: `2.75rem` (44px target for mobile accessibility). Hover: `#0369a1`. Active: `#075985`. Focus ring: `2px solid #ffffff` inner, `2px solid #0284c7` outer.
- **Secondary:** Background `#ffffff`, foreground `#0369a1`, border `1px solid #bae6fd`. Hover: background `#f0f9ff`, border `#0284c7`.
- **Tertiary / Ghost:** Background transparent, foreground `#0f172a`, border none. Hover: background `#f0f9ff`, foreground `#0284c7`.
- **Destructive:** Background `#b91c1c`, foreground `#ffffff`. Hover: `#991b1b`.

### Input Fields & Controls
- **Form Inputs:** Height `2.75rem`, background `#ffffff`, border `1px solid #cbd5e1`, border-radius `0.25rem`, padding `0 0.75rem`. Placeholder: `#64748b`. Active focus: border `#0284c7`, ring `3px solid #e0f2fe`.
- **Error State:** Border `#b91c1c`, focus ring `3px solid #fee2e2`, accompanied by an accessible error icon and high-contrast caption below.

### Selection Controls
- **Checkboxes & Radios:** Dimensions `1.125rem` (18px) with `0.125rem` radius (radios 50% circle). Border `1.5px solid #64748b`. Checked state: background `#0284c7`, border `#0284c7`, check glyph `#ffffff`.

### Chips & Badges
- **Status Badges:** Small footprint, height `1.5rem`, padding `0 0.5rem`, font `label-md`. 
  - *Active / In Progress:* Background `#e0f2fe`, text `#0369a1`, border `1px solid #bae6fd`.
  - *Approved:* Background `#ecfdf5`, text `#065f46`, border `1px solid #a7f3d0`.
  - *Pending:* Background `#fffbeb`, text `#92400e`, border `1px solid #fde68a`.

### Cards & Data Containers
- **Standard Card:** Background `#ffffff`, border `1px solid #e2e8f0`, border-radius `0.5rem`, padding `1.5rem`.
- **Glacier Accent Card:** Background `linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)`, border `1px solid #bae6fd`.

### Civic Specific Additions
- **Verification Callout:** Used for official seal verification or citizen notices. Pale glacier base (`#f0f9ff`), thick `4px` left accent line in `#0284c7`, inner padding `1rem 1.25rem`, text `#0f172a`.
- **Official Ledger Table:** Alternating clean rows (`#ffffff` and `#f8fafc`), header row `#f0f9ff` with strict bottom border `1px solid #cbd5e1`, cell vertical alignment centered, numerical data set to tabular-nums.