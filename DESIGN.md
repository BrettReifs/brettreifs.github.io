---
spec: design.md
version: 0.1.0
constitution: brett-reif/v1
project:
  name: 'brettreifs.github.io'
  domain: 'portfolio'
  modes:
    density: airy
    color: light
    motion: expressive

colors:
  primitives:
    neutral:
      0:   '#ffffff'
      50:  '#fafafa'
      100: '#f4f4f5'
      200: '#e4e4e7'
      300: '#d4d4d8'
      400: '#a1a1aa'
      450: '#85858f'
      500: '#71717a'
      600: '#52525b'
      700: '#3f3f46'
      800: '#27272a'
      900: '#18181b'
      950: '#09090b'
    accent:
      500: '#0066ff'
  semantic:
    light:
      surface:         '{colors.primitives.neutral.50}'
      surface-raised:  '{colors.primitives.neutral.0}'
      surface-overlay: '{colors.primitives.neutral.0}'
      fg:              '{colors.primitives.neutral.900}'
      fg-muted:        '{colors.primitives.neutral.600}'
      fg-subtle:       '{colors.primitives.neutral.500}'
      border-subtle:   '{colors.primitives.neutral.200}'
      border-default:  '{colors.primitives.neutral.300}'
      border-strong:   '{colors.primitives.neutral.400}'
      accent:          '{colors.primitives.accent.500}'
      accent-fg:       '{colors.primitives.neutral.0}'
      danger:          '#dc2626'
      success:         '#16a34a'
      warning:         '#ea580c'
    dark:
      surface:         '{colors.primitives.neutral.950}'
      surface-raised:  '{colors.primitives.neutral.900}'
      surface-overlay: '{colors.primitives.neutral.900}'
      fg:              '{colors.primitives.neutral.50}'
      fg-muted:        '{colors.primitives.neutral.400}'
      fg-subtle:       '{colors.primitives.neutral.450}'
      border-subtle:   'rgba(255, 255, 255, 0.08)'
      border-default:  'rgba(255, 255, 255, 0.12)'
      border-strong:   'rgba(255, 255, 255, 0.18)'
      accent:          '{colors.primitives.accent.500}'
      accent-fg:       '{colors.primitives.neutral.0}'
      danger:          '#f87171'
      success:         '#4ade80'
      warning:         '#fb923c'

spacing:
  base: 8
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  inset:
    sm: 12
    md: 16
    lg: 24
    xl: 32
  stack:
    tight:   8
    base:    16
    loose:   24
    section: 48
target:
  min: 44
  comfortable: 48
density:
  default: airy
  focused:
    inset: { sm: 8, md: 12, lg: 16, xl: 20 }
    stack: { tight: 4, base: 8, loose: 12, section: 24 }
breakpoints:
  sm: 640
  md: 768
  lg: 1024
  xl: 1280
  '2xl': 1536

typography:
  families:
    sans: 'Inter Variable, system-ui, -apple-system, sans-serif'
    mono: 'JetBrains Mono Variable, ui-monospace, SFMono-Regular, Menlo, monospace'
  weight:
    regular: 400
    medium:  500
    semibold: 600
  display-2xl: { family: '{typography.families.sans}', size: 48, lineHeight: 1.1, weight: 600, tracking: '-0.02em' }
  display-xl:  { family: '{typography.families.sans}', size: 36, lineHeight: 1.15, weight: 600, tracking: '-0.02em' }
  h1:          { family: '{typography.families.sans}', size: 28, lineHeight: 1.2, weight: 600, tracking: '-0.01em' }
  h2:          { family: '{typography.families.sans}', size: 22, lineHeight: 1.25, weight: 600 }
  h3:          { family: '{typography.families.sans}', size: 18, lineHeight: 1.3, weight: 600 }
  body-lg:     { family: '{typography.families.sans}', size: 17, lineHeight: 1.5, weight: 400 }
  body-md:     { family: '{typography.families.sans}', size: 15, lineHeight: 1.5, weight: 400 }
  body-sm:     { family: '{typography.families.sans}', size: 13, lineHeight: 1.5, weight: 400 }
  caption:     { family: '{typography.families.sans}', size: 12, lineHeight: 1.4, weight: 500 }
  code:        { family: '{typography.families.mono}', size: 14, lineHeight: 1.5, weight: 400 }
  measure:
    body: '65ch'

rounded:
  none: 0
  sm:   4
  md:   8
  lg:   12
  xl:   16
  full: 9999
exceptions:
  data-dense-interior: '{rounded.none}'

elevation:
  mode: border-led
  resting:
    border: '1px solid {colors.semantic.{mode.color}.border-subtle}'
    surface: '{colors.semantic.{mode.color}.surface}'
  raised:
    border: '1px solid {colors.semantic.{mode.color}.border-default}'
    surface: '{colors.semantic.{mode.color}.surface-raised}'
  overlay:
    shadow: '0 12px 32px -8px rgba(0, 0, 0, 0.18), 0 4px 8px -2px rgba(0, 0, 0, 0.08)'
    border: '1px solid {colors.semantic.{mode.color}.border-subtle}'
    surface: '{colors.semantic.{mode.color}.surface-overlay}'

effects:
  glass:
    enabled: false
    rationale: |
      Glass/backdrop-blur is enjoyable in moderation but not foundational.
      Projects MAY adopt it for specific overlays and must document the choice.

motion:
  principle: clarify-cause-and-effect
  posture:
    default: subtle
    modes: [subtle, expressive]
  reduced-motion:
    respect: true
  subtle:
    duration: { fast: 120, base: 200, slow: 320 }
    easing:
      standard:   'cubic-bezier(0.2, 0, 0, 1)'
      emphasized: 'cubic-bezier(0.3, 0, 0, 1)'
      accelerate: 'cubic-bezier(0.3, 0, 1, 1)'
    choreography:
      modal: 'lift + fade'
      sheet: 'slide-from-edge'
      list: 'no-stagger'
      page: 'fade-only'
  expressive:
    duration: { fast: 200, base: 400, slow: 800, hero: 1200 }
    easing:
      standard: 'cubic-bezier(0.16, 1, 0.3, 1)'
      spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)'
    capabilities:
      - scroll-triggered-reveals
      - parallax
      - 3d-transforms
      - morph-transitions
      - gesture-following
      - hero-choreography
    constraints:
      - chrome remains subtle even when content is expressive
      - hero motion budget caps at 1200ms per single sequence
      - prefers-reduced-motion still collapses all to instant

accessibility:
  standard: WCAG 2.2 AA
  contrast:
    body: 4.5
    large-text: 3.0
    ui-component: 3.0
  focus:
    visible: always
    ring: '2px solid {colors.semantic.{mode.color}.accent}'
    offset: 2
  touch-target:
    min: '{target.min}'
  reduced-motion: respected
  keyboard-parity: required
---

## Overview

This project follows the Brett Reif design constitution v1. The constitution
governs the chrome; project work fills in the content. The semantic-slot
architecture means components address slots such as `--color-accent` and
`--color-surface`, while this project picks primitive values for those slots.

**Project-specific aesthetic notes:** A cinematic editorial portfolio built
from recognizable paper-system diagrams, clipped media, diagonal transitions,
and continuous narrative lines. White is the canonical canvas, near-black is
the ink, and cobalt, coral, citron, and sky identify stages in the system.

**Departures from the constitution:** The portfolio opts into an editorial
display serif for narrative headings and expressive motion for one focal hero
sequence plus restrained scroll choreography. A white canvas and expanded
signal palette replace the original warm-white and cobalt-only treatment so
folded stages remain legible rather than abstract. Chrome stays in Inter,
technical labels stay in JetBrains Mono, and reduced motion collapses all
movement to meaningful static compositions. Glass, focused density, and
dark-first mode remain off.

## Color

Light mode is canonical. Dark mode is the engineered variant and must maintain
WCAG 2.2 AA contrast on every semantic slot. All component design happens in
light mode first; dark mode is verified for parity, not designed in parallel.

Semantic slots are the only agent-addressable surface. Components reference
`var(--color-surface)`, never primitive color values.

## Typography

Inter Variable is for UI and prose. JetBrains Mono Variable is for code, file
paths, keyboard shortcuts, and numerical readouts. Publication surfaces may
introduce a serif face for display type when documented in `## Overview`.

Body text reaches for `body-md` (15px). Reading surfaces step up to `body-lg`
(17px) and constrain to `measure.body` (65ch). Display sizes are for hero
moments, not section openers.

## Spacing & Layout

Use an 8px base, mobile-first structure, and airy default. Design the mobile
layout first; add larger breakpoint modifiers that expand. Touch targets meet
the 44px floor. Whitespace is structure, not decoration.

The `focused` density mode is an explicit opt-in for expert tools and
observability surfaces. Canvas interiors are exempt, but the constitution
still governs their frame.

## Radius

`md: 8` is the workhorse. Buttons, inputs, cards, and dialogs all use it.
Data-dense interiors use `none: 0` while their outer container retains
`md: 8`. Hero or marketing surfaces may step up to `lg: 12` or `xl: 16`.

## Elevation & Depth

Elevation is border-led. Resting elements use `border-subtle` over `surface`.
Raised elements use `border-default` over `surface-raised`. Shadows are
reserved exclusively for floating overlays.

This is the only place shadows appear. Hybrid elevation is forbidden.

## Motion

Subtle motion clarifies cause and effect. Chrome motion stays under 320ms with
the standard easing token.

Narrative projects may opt into expressive motion. Even there, chrome remains
subtle, and `prefers-reduced-motion: reduce` collapses every transition to an
instant state.

## Effects

No glass at the constitutional level. Projects may adopt `backdrop-filter`
sparingly on specific overlays when documented, with a solid fallback surface
that meets WCAG AA.

## Accessibility

WCAG 2.2 AA is the floor: 4.5:1 body contrast, 3:1 large text and UI
components, visible focus on every interactive element, a 44px minimum touch
target, keyboard parity, and complete reduced-motion support.

These rules survive every project-level departure.

## Do's and Don'ts

**Do**
- Design mobile first and progressively enhance.
- Reference semantic color slots, never primitives.
- Use borders for resting elevation and shadows only for floating overlays.
- Animate via motion tokens.
- Document every departure in `## Overview`.

**Don't**
- Mix borders and shadows on resting elements.
- Use ad hoc pixel values outside the spacing scale.
- Introduce serif, glass, or expressive motion silently.
- Design desktop layouts and squeeze them down to mobile.
- Skip the reduced-motion test pass.

## Constitution Reference

This file derives from the Brett Reif design constitution v1, locked
2026-06-10. The source of truth lives at
`~/.copilot/design-language/scaffolds/DESIGN.md`.

Generated tokens can be exported with
`npx @google/design.md export --format dtcg`.
