---
name: Premium Minimalist Wealth
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
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
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

This design system embodies a "Premium Minimalist" aesthetic tailored for personal finance and investment management. The personality is sophisticated, precise, and encouraging. It aims to evoke a sense of calm control over one's finances, replacing the typical anxiety of money management with the clarity of data-driven insights.

The style leverages a high-end corporate-modern foundation mixed with subtle glassmorphism for depth. It prioritizes extreme legibility, intentional white space to reduce cognitive load, and high-contrast typography to emphasize key financial metrics. Visual elements are soft yet structured, using a consistent "rounded-xl" corner radius to feel approachable and modern.

## Colors

The palette is rooted in professional "Midnight Navy" for primary surfaces and text, conveying stability and institutional trust. 

- **Primary:** A deep navy (#0F172A) used for main backgrounds, navigation bars, and primary buttons.
- **Success/Growth:** A vibrant "Emerald Green" (#10B981) specifically reserved for positive market trends, income, and growth visualizations.
- **Secondary/Info:** A "Clear Blue" (#3B82F6) for interactive elements, secondary trends, and focus states.
- **Neutral:** A range of cool grays starting from a soft off-white (#F8FAFC) for page backgrounds, ensuring the UI feels airy and clean.
- **Semantic:** "Coral Red" (#EF4444) is used sparingly for expenses and negative market movements to maintain high contrast without overwhelming the user.

## Typography

This design system utilizes **Inter** exclusively to ensure a systematic, utilitarian, and modern feel. The typographic hierarchy is designed to highlight numbers and currency values first.

- **Numerics:** Financial figures should use "Medium" or "SemiBold" weights to ensure they stand out against descriptive text.
- **Display Levels:** Used for total balance and major portfolio summaries. These feature tight letter-spacing to feel "contained" and premium.
- **Labels:** Small labels use uppercase styling with slight letter spacing to differentiate category headers from body content.
- **Scale:** On mobile, display sizes are capped at 32px to maintain hierarchy without breaking containers.

## Layout & Spacing

The layout follows a fluid 12-column grid for desktop and a single-column fluid model for mobile. A strict 4px soft-grid system governs all padding and margins to ensure mathematical harmony.

- **Mobile Layout:** 20px side margins with 16px gutters between cards.
- **Desktop Layout:** Max-width of 1280px, centered.
- **Rhythm:** Vertical rhythm is maintained through 24px (lg) spacing between major card sections and 8px (sm) between related elements within a card. 
- **Density:** The design favors "Low Density" to provide a premium, uncluttered experience. Avoid stacking more than 3 distinct data points in a single horizontal row on mobile.

## Elevation & Depth

Hierarchy is established through tonal layering and extremely soft ambient shadows rather than heavy borders.

- **Surface Levels:** The background is the lowest level (#F8FAFC). Cards sit on top in pure white (#FFFFFF). 
- **Shadows:** Use a "Natural Ambient" shadow for cards: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a subtle lift without feeling "heavy."
- **Glassmorphism:** For top navigation bars and bottom sheets, use a backdrop blur of 12px and 80% opacity to maintain context of the content underneath.
- **Primary Action Depth:** The floating action button (FAB) or primary CTA uses a more pronounced shadow to indicate interactivity.

## Shapes

The shape language is defined by the "rounded-xl" (16px) standard for all primary containers.

- **Main Cards:** 16px (1rem) corner radius.
- **Inner Elements:** Input fields and secondary buttons use 12px (0.75rem) to create a nested visual harmony.
- **Pill Elements:** Status badges (e.g., "+1.45%") and main navigation indicators use a fully rounded (pill) shape to distinguish them from structural cards.
- **Icon Enclosures:** Small circular backgrounds (32px or 40px diameter) are used for transaction categories to provide a soft focal point.

## Components

### Buttons
- **Primary:** Navy background, white text, 12px radius. High-gloss finish or subtle gradient allowed.
- **Secondary:** Transparent background, Navy border (1px), 12px radius.
- **Ghost:** No border, Navy or Blue text, used for "View All" or "Cancel" actions.

### Cards
- White background, 16px radius, subtle shadow. 
- **Investment Cards:** Should include a sparkline chart (Green/Red) and a primary value in `headline-lg`.

### Input Fields
- Soft gray background (#F1F5F9), 12px radius, 16px horizontal padding.
- Focused state: 1px Blue (#3B82F6) border with subtle outer glow.

### Chips & Badges
- Used for market trends. Green background at 10% opacity with solid green text for "Profit" badges.
- Use 12px (label-sm) font size.

### Data Visualization
- **Charts:** Use smooth Bezier curves for line charts. No sharp angles.
- **Gradients:** Fill the area under line charts with a 10% to 0% vertical gradient of the line color.
- **Donut Charts:** Use a 20px stroke width for segment clarity.