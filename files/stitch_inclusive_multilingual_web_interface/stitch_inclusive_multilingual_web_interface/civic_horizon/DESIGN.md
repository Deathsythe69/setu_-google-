---
name: Civic Horizon
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
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#532a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#743d00'
  on-tertiary-container: '#ffa85d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Noto Sans
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
  body-xl:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.03em
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

This design system embodies the gravity, transparency, and universal utility demanded of an open-source Digital Public Good. Designed to bridge grassroots citizen engagement with high-tier policy analysis across diverse multilingual populations, the aesthetic is **Civic Humanist / High-Clarity Public Infrastructure**. It prioritizes extreme cognitive ease, high tactile affordance, and dignified institutional trust over fleeting decorative trends.

The visual tone is calm, authoritative, and deeply egalitarian. It balances structural rigor with compassionate ergonomics: generous touch bounds, high-contrast readability, redundant visual indicators (color is never the sole communicator), and explicit audio/multilingual entry points. The interface feels less like a corporate SaaS tool and more like an open civic square: resilient, welcoming, and accessible on both low-spec rural mobile hardware and modern high-density workstations.

## Colors

The color palette is engineered for institutional legitimacy and strict accessibility, satisfying WCAG 2.1 AAA contrast targets for body typography and AA for large-scale graphics.

- **Primary (#1E40AF - Deep Trust Blue):** Anchors state actions, institutional identifiers, critical interactions, and core structural chrome. Light variant (`#2563EB`) serves interactive states, while `#DBEAFE` provides high-contrast focus rings and surface highlights.
- **Secondary (#0D9488 - Civic Teal):** Distinguishes shared civic intelligence, active public data streams, verified governance badges, and voice/audio read-aloud affordances.
- **Tertiary (#D97706 - Civic Amber):** Used for non-punitive cautionary notices, community deliberation states, and pending verifications.
- **Neutral Canvas & Surfaces:** Background foundation is crisp paper slate (`#F8FAFC`), layered with pure white (`#FFFFFF`) containers and `#E2E8F0` structural rules. Body typography rests on deep mineral slate (`#0F172A`), delivering an assertive 14:1 contrast ratio against base backgrounds.
- **Semantic Accents:** Rose Alert (`#E11D48`) signals critical systemic disruptions, while Civic Green (`#16A34A`) validates authenticated submissions and open civic access.

## Typography

The typography system is built on **Noto Sans**, chosen deliberately for its universal unicode script coverage—ensuring visual parity and seamless rhythm across Devanagari, Latin, Cyrillic, Han, Arabic, and other regional scripts.

To accommodate lower-literacy scenarios, multi-generational users, and translations that expand text length by up to 30%, line heights are maintained at 1.6× minimum for reading contexts. Typography never drops below 12px, even for auxiliary metadata. All labels and functional text rely on medium and semi-bold weights (`500` and `600`) to resist rendering degradation on low-resolution mobile displays.

## Layout & Spacing

This design system uses an adaptable, accessible 12-column fluid grid system on desktop (max content bounded at 1280px to protect visual scan lines) reflowing to a 4-column system on mobile devices. 

- **Desktop (≥ 1024px):** 12-column grid, 24px (`1.5rem`) gutters, 32px (`2rem`) minimum page margins.
- **Tablet (768px – 1023px):** 8-column grid, 20px gutters, 24px margins.
- **Mobile (≤ 767px):** 4-column grid, 16px (`1rem`) gutters, 16px (`1rem`) canvas padding.

Structural layout rules strictly decouple content density from touch ergonomics. While reading content respects optimal measure (60–75 characters per line), all touch interaction boundaries maintain generous spatial buffers. Density toggles must never shrink interactive hit envelopes below universal accessibility thresholds.

## Elevation & Depth

Visual hierarchy rejects hyper-diffused or decorative dropshadows in favor of **Tonal Layers and Structural Boundaries**. This ensures visual clarity remains intact on budget outdoor displays under direct sunlight and high-contrast accessibility modes.

- **Base Layer (0dp):** System canvas rendered in `#F8FAFC`.
- **Card / Surface Layer (1dp):** Pure white (`#FFFFFF`) framed by a persistent, crisp 1px border in `#CBD5E1`. A soft ambient footing (`0 1px 3px rgba(15, 23, 42, 0.08)`) defines surface break points.
- **Floating Controls / Sticky App Bars (2dp):** Background white (`#FFFFFF`) with a structural 1px border in `#94A3B8` and a grounded shadow (`0 4px 12px rgba(15, 23, 42, 0.08)`).
- **Overlays / Dialogs / Language Pickers (3dp):** Elevated above a 60% opacity deep slate backdrop (`#0F172A`), cast with a pronounced, clean shadow (`0 12px 24px rgba(15, 23, 42, 0.16)`).
- **Focus Ring Elevation:** Interactive components receive a high-contrast dual ring: an inner 2px pure white border enveloped by a 3px outward ring in `#2563EB`.

## Shapes

The design system adopts a **Soft (Level 1)** shape language (`0.25rem` / `4px` base border-radius, scaling to `0.5rem` / `8px` on larger structural panels). 

This architectural rounding preserves an institutional, civic posture while avoiding both razor-sharp technical brutalism and overly playful consumer "pill" aesthetics. Form controls, buttons, and system notices feel sturdy, dependable, and legible. Only contextual badges, audio status pills, and keyboard navigation indicators utilize fully rounded circular radiuses.

## Components

### Buttons & Interactive Touch Targets
- **Primary Buttons:** High-contrast `#1E40AF` fill with `#FFFFFF` text. Minimum height is strictly **56px** across primary citizen flows (48px for dense administrative tables). Padding: 16px horizontal, 14px vertical. Fully dual-encoded: action verbs accompanied by an explicit SVG icon.
- **Secondary Buttons:** Transparent background with a reinforced 2px border in `#1E40AF` and matching text.
- **Audio Read-Aloud Action:** A persistent high-priority button variant surfaced across all civic briefings. Uses Civic Teal tint (`#F0FDFA`), `#0D9488` border, speaker icon, and explicit text label ("Listen to briefing").

### Multilingual Script Switcher
- Persistent global navigation element pinned to the top right. Displays current script and language in both native orthography and systemic Romanization (e.g., "हिन्दी / Hindi"). Opens a full-screen, search-enabled modal on mobile with large 56px selection rows.

### Cards
- White surface (`#FFFFFF`), bounded by 1px `#CBD5E1` outline and 8px border radius. Cards feature clear compartmentalization: an upper metadata bar (date, administrative level, status badge), headline, concise summary, and a distinct footer separating interaction actions.

### Input Fields & Controls
- **Inputs:** 56px height, 16px font size to prevent mobile browser zoom. 1.5px `#94A3B8` default border shifting to a 2px `#1E40AF` border on focus. Labels sit permanently above the field (never reliance on placeholder text alone) accompanied by explicit helper text.
- **Checkboxes & Radios:** Scaled to 24px × 24px bounding boxes with active touch envelopes expanded to 48px × 48px. State changes provide both color fill and checkmark/dot graphic indicators.

### Chips & Badges
- 32px height, 4px border radius. Tinted neutral backgrounds paired with 1px border. Never rely purely on hue; semantic chips always include a text label and symbolic iconography (e.g., warning triangle, verified shield).

### Lists & Civic Feeds
- High-contrast segmented rows divided by 1px `#E2E8F0` borders. Generous vertical padding (`space-md`) ensures finger tap accuracy when scrolling through civic registries on small hand-held units.