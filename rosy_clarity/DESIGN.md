---
name: Rosy Clarity
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#594047'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#8d6f77'
  outline-variant: '#e1bec6'
  surface-tint: '#ba0060'
  primary: '#b7005e'
  on-primary: '#ffffff'
  primary-container: '#db2777'
  on-primary-container: '#fffdff'
  inverse-primary: '#ffb1c7'
  secondary: '#765469'
  on-secondary: '#ffffff'
  secondary-container: '#fdd0ea'
  on-secondary-container: '#79576c'
  tertiary: '#ac2558'
  on-tertiary: '#ffffff'
  tertiary-container: '#cd4070'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e2'
  primary-fixed-dim: '#ffb1c7'
  on-primary-fixed: '#3f001c'
  on-primary-fixed-variant: '#8e0048'
  secondary-fixed: '#ffd8ed'
  secondary-fixed-dim: '#e5bad3'
  on-secondary-fixed: '#2c1325'
  on-secondary-fixed-variant: '#5c3d51'
  tertiary-fixed: '#ffd9e0'
  tertiary-fixed-dim: '#ffb1c3'
  on-tertiary-fixed: '#3f0019'
  on-tertiary-fixed-variant: '#8e0542'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
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
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is anchored in a philosophy of "Transparent Utility." It balances the playful energy of its primary pink palette with a structured, professional layout to ensure the app feels like a dependable tool rather than a toy. The brand personality is helpful, acting as a quiet assistant that surfaces information only when needed.

The chosen aesthetic is **Modern / Minimalist** with a subtle **Soft-Corporate** influence. It prioritizes high-contrast readability and generous whitespace to reduce cognitive load. The interface avoids unnecessary decoration, instead using color and scale to guide the user through utility-driven workflows. The emotional response should be one of "calm efficiency"—where the user feels both welcomed by the warmth of the palette and reassured by the precision of the layout.

## Colors

The color palette centers on a "Vibrant Rose" primary to denote action and brand presence. This is supported by a "Soft Petal" secondary pink, used primarily for background surfaces, subtle highlights, and de-emphasized states to maintain the friendly tone without overwhelming the eye.

The neutral palette utilizes a "Deep Slate" for typography and iconography, providing the professional grounding necessary for a utility app. For data visualization and status indicators, the system employs a "Harmonized Utility" set: a sage green for success and a muted amber for warnings, both adjusted to sit comfortably alongside the pink primary. High-value data is always rendered in the primary pink to ensure the brand owns the most important information.

## Typography

This design system utilizes **Plus Jakarta Sans** for all levels of communication. This font was selected for its modern, geometric construction and slightly rounded terminals, which perfectly bridge the gap between "professional utility" and "approachable friendliness."

Headlines use a heavier weight and tighter letter spacing to create a sense of confidence and hierarchy. Body text is set with generous line heights to ensure long-form utility data remains legible at a glance. Labels and captions use increased letter spacing and semi-bold weights to remain distinct even at smaller sizes, which is critical for form fields and data visualization legends.

## Layout & Spacing

The design system employs an **8px linear grid system** to maintain mathematical harmony across all components. Layouts are built upon a **12-column fluid grid** for desktop and a **4-column fluid grid** for mobile devices.

The spacing philosophy focuses on "Logical Grouping." Related elements (like an input field and its label) use `xs` or `base` spacing, while distinct sections of a page are separated by `lg` or `xl` units to allow the UI to breathe. Margins are kept consistent at `24px` to provide a safe "frame" for content, ensuring the app feels organized and never cluttered.

## Elevation & Depth

To maintain a clean and modern feel, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layering** and **Low-Contrast Outlines**.

Depth is created by placing white "Card" surfaces on top of a very light pink (`#FFF5F7`) background. When shadows are necessary for interactive elements (like a raised button or a dropdown menu), they are rendered as "Ambient Shadows"—extremely diffused, with a 10% opacity tint of the primary pink rather than pure grey. This subtle tinting ensures that the elevation feels like a natural extension of the brand's light and airy atmosphere.

## Shapes

The shape language is defined by "Approachable Softness." All primary containers, buttons, and input fields use a **rounded corner radius of 8px (Level 2)**. This specific radius is large enough to feel friendly and safe, but sharp enough to maintain a professional, organized structure.

Secondary elements, such as tags or chips, may use a pill-shape (fully rounded) to differentiate them from actionable buttons. Large containers, such as modal sheets or dashboard cards, utilize a `rounded-xl` (24px) radius to create a distinct, "contained" feeling that mimics modern mobile OS standards.

## Components

**Buttons:** 
Primary buttons are solid pink with white text, featuring a subtle 2px bottom "press" shadow. Secondary buttons use a transparent background with a 1.5px pink border.

**Cards:** 
Utility cards should be flat with a 1px border in a pale pink-grey (`#F1F5F9`). They should not use shadows unless they are hoverable or draggable, in which case they transition to an ambient pink shadow.

**Forms:** 
Input fields use a light grey background that transitions to a white background with a 2px pink border upon focus. Labels are always top-aligned and use the `label-lg` typographic style for maximum clarity. Error states must include both a red border and an icon to assist with accessibility.

**Data Visualization:** 
Charts should use a "Monochromatic Plus" scheme. The primary data series is always the vibrant pink. Comparison series use the soft pastel pink, and a neutral slate grey is used for baselines or historical data. Grid lines should be kept to a minimum (only horizontal) and rendered in a very light grey to keep the focus on the data points.

**Chips & Tags:** 
Used for filtering utility data. These are pill-shaped and utilize the `secondary_color` for the background with `tertiary_color` for the text to ensure high contrast without the visual weight of a primary button.