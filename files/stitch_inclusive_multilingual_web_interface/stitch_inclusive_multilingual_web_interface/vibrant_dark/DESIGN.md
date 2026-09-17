---
name: Vibrant Dark
colors:
  surface: '#040e21'
  surface-dim: '#040e21'
  surface-bright: '#1c2c4a'
  surface-container-lowest: '#000000'
  surface-container-low: '#071328'
  surface-container: '#0c1931'
  surface-container-high: '#111f39'
  surface-container-highest: '#162541'
  on-surface: '#dce5ff'
  on-surface-variant: '#a1abc4'
  inverse-surface: '#f9f9ff'
  inverse-on-surface: '#4b556b'
  outline: '#6b758d'
  outline-variant: '#3e485e'
  surface-tint: '#7bd1fa'
  primary: '#7bd1fa'
  primary-dim: '#6cc3eb'
  on-primary: '#00465d'
  primary-container: '#51aad2'
  on-primary-container: '#002635'
  inverse-primary: '#006787'
  secondary: '#b1ddf7'
  secondary-dim: '#a3cfe8'
  on-secondary: '#215065'
  secondary-container: '#1c4c60'
  on-secondary-container: '#aad7ef'
  tertiary: '#e0bfff'
  tertiary-dim: '#c8a0f0'
  on-tertiary: '#56337a'
  tertiary-container: '#d6adff'
  on-tertiary-container: '#4c2970'
  error: '#ff716c'
  error-dim: '#d7383b'
  on-error: '#490006'
  error-container: '#9f0519'
  on-error-container: '#ffa8a3'
  primary-fixed: '#7bd1fa'
  primary-fixed-dim: '#6cc3eb'
  on-primary-fixed: '#003041'
  on-primary-fixed-variant: '#004f69'
  secondary-fixed: '#b1ddf7'
  secondary-fixed-dim: '#a3cfe8'
  on-secondary-fixed: '#063d51'
  on-secondary-fixed-variant: '#2c596f'
  tertiary-fixed: '#d6adff'
  tertiary-fixed-dim: '#c8a0f0'
  on-tertiary-fixed: '#361059'
  on-tertiary-fixed-variant: '#55327a'
  background: '#040e21'
  on-background: '#dce5ff'
  surface-variant: '#162541'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Vibrant Dark Design System

## Brand & Style
The design system adopts a vibrant, modern dark aesthetic characterized by high-impact neon-leaning accents against deep, immersive backgrounds. It is tailored for cutting-edge digital platforms, developer tools, and creative suites where clarity, modernism, and visual engagement are paramount.

## Colors
The palette is optimized for dark mode experiences, utilizing a deep blue-gray neutral base (`#1a2438`) that reduces eye strain in low-light environments. The primary accent is a vibrant sky blue (`#7dd3fc`), complemented by a supportive secondary slate blue (`#88b4cc`) and a striking tertiary lavender (`#c8a0f0`) for highlights and special states. Semantic color derivation ensures accessible contrast ratios across all interactive elements.

## Typography
Inter serves as the single font family across headlines, body text, and labels, offering exceptional legibility at any size. The type scale is mathematically proportioned to maintain clear hierarchy, leveraging medium and semi-bold weights for headings while keeping body text clean and readable.

## Layout & Spacing
A structured layout grid provides consistent alignment across devices. A scaling factor of 2 dictates the spacing rhythm, delivering balanced density that feels neither cramped nor overly sparse. Standardized gutters and outer margins ensure breathing room for high-density dashboard and application layouts.

## Elevation & Depth
Depth is primarily achieved through tonal layering against the dark canvas, utilizing lighter surface containers to elevate foreground elements. Subtle, low-opacity neon glows and ambient shadows derived from the primary and tertiary colors help articulate interactive states without breaking the modern dark mode immersion.

## Shapes
The design system uses a rounded corner language (`roundedness` level 2), giving UI containers and components a friendly, contemporary feel. Standard elements feature a 0.5rem corner radius, while larger cards and modals scale up to 1rem and 1.5rem for harmonious proportions.

## Components
Components are engineered for a vibrant dark mode experience:
- **Buttons:** Solid primary buttons use the bright sky blue fill with dark high-contrast text, while secondary variants use translucent or outlined surfaces.
- **Inputs:** Dark background fields with distinct borders that highlight cleanly in primary or tertiary accents upon focus.
- **Cards:** Surface containers built on the deep neutral palette with rounded corners and subtle border separation.
- **Chips & Badges:** Compact tags utilizing tertiary and secondary pastel tones for clear categorization.