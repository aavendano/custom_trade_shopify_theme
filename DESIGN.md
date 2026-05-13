---
colors:
  primary:
    value: "#533278"
    description: "plt-purple - Primary brand color used for main actions and branding."
  secondary:
    value: "#f4436c"
    description: "plt-pink - Secondary brand color for highlights and accents."
  info:
    value: "#0c7489"
    description: "plt-teal - Accent and info color."
  light:
    value: "#f4f4f4"
    description: "plt-gray-light - Light background color."
  dark:
    value: "#525e56"
    description: "plt-gray-dark - Dark text and contrast color."
  grey:
    value: "#b5b5b5"
    description: "plt-gray - Neutral gray for borders and muted text."
  scheme-1:
    background: "#f4f4f4"
    text: "#000000"
    button: "#533278"
    button_label: "#ffffff"
    secondary_button_label: "#f4436c"
    shadow: "#0c7489"
  scheme-2:
    background: "#ffffff"
    text: "#231f20"
    button: "#f4436c"
    button_label: "#ffffff"
    secondary_button_label: "#533278"
    shadow: "#0c7489"
  scheme-3:
    background: "#f4f4f4"
    text: "#231f20"
    button: "#0c7489"
    button_label: "#ffffff"
    secondary_button_label: "#f4436c"
    shadow: "#000000"

typography:
  fonts:
    body:
      value: "Urbanist, Inter, sans-serif"
    heading:
      value: "Urbanist, Inter, sans-serif"
    primary:
      value: "Roboto Condensed, Inter, SF Pro, Segoe UI, Roboto, sans-serif"
    secondary:
      value: "Inter, SF Pro, Segoe UI, Roboto, sans-serif"
  sizes:
    size-1: "3rem"
    size-2: "2.5rem"
    size-3: "2rem"
    size-4: "1.5rem"
    size-5: "1.25rem"
    size-6: "1rem"
    size-7: "0.75rem"
  weights:
    light: 300
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
    extrabold: 800

spacing:
  sections:
    desktop: 20px
  grid:
    horizontal: 40px
    vertical: 24px
  block: "1.5rem"

radii:
  buttons: 22px
  inputs: 22px
  cards: 8px
  badges: 8px
  variant_pills: 40px

shadows:
  card: "6px 10px 15px rgba(12, 116, 137, 0.25)"
  button: "0px 4px 5px rgba(12, 116, 137, 0.30)"
  popup: "0px 4px 5px rgba(0, 0, 0, 0.15)"

breakpoints:
  mobile: "0px"
  tablet: "769px"
  desktop: "1024px"
  widescreen: "1216px"
  fullhd: "1408px"

---

# Play Love Toys - Design System

## Look and Feel

The visual identity of Play Love Toys is modern, playful, yet structured. It uses a strong, vibrant palette combined with rounded elements and soft shadows to create an inviting, energetic, and accessible e-commerce experience.

### Color & Contrast
The brand relies heavily on a triad of distinctive colors:
- **Purple (`#533278`)**: Conveys trust and anchors the primary actions.
- **Pink (`#f4436c`)**: Injects energy and fun; used primarily for highlights, secondary actions, and badges.
- **Teal (`#0c7489`)**: Adds depth and balance, frequently seen in shadows and info elements.

These vibrant colors are balanced against clean, light backgrounds (`#f4f4f4` and `#ffffff`), ensuring that product imagery and typography remain the focal points. Dark colors are reserved primarily for text and high-contrast borders.

### Typography
The primary typeface is **Urbanist**, providing a clean, geometric, and modern aesthetic. **Roboto Condensed** and **Inter** act as secondary/fallback fonts to ensure readability across all devices. Headings are bold and punchy, while body text remains legible and spacious.

### Shape & Structure
The design language leans heavily into friendly, rounded shapes:
- **Buttons and Inputs** feature pronounced rounding (`22px`), giving them a tactile, pill-like feel.
- **Variant Pills** are fully rounded (`40px`).
- **Cards** have subtle, structural rounding (`8px`).

### Depth & Elevation
Elevation is used purposefully to establish hierarchy and interactivity:
- Elements like cards and buttons have distinct drop shadows.
- The color of the shadow often inherits brand tones (like the Teal shadow), rather than a standard black, giving the UI a cohesive, "glow" effect rather than a harsh drop shadow.

### Motion & Interaction
Hover elements use a `vertical-lift` animation, making the interface feel responsive and lively. Animations are designed to reveal smoothly on scroll.

### Layout
The layout is based on a responsive grid system, built primarily on Bulma, but heavily customized via CSS variables. Spacing is generous to allow the vibrant colors and product images to breathe, utilizing a mobile-first approach that scales up elegantly to widescreen displays.
