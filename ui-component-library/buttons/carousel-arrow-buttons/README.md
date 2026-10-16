# Carousel Arrow Navigation Buttons

Circular crimson navigation arrows with high-contrast white vector icons, ambient crimson shadow, hover scale, and tactile active press response.

---

## Visual Characteristics

- **Dimensions**: 44px round circle with signature Crimson Blaze (`#800A19`) background and matching border.
- **Shadow**: Crimson tint ambient glow (`box-shadow: 0 4px 14px rgba(128, 10, 25, 0.28)`).
- **Micro-Interaction**:
  - Hover: Background lightens to `#A01224`, lifts `-2px`, and scales to `1.05`.
  - Active Press: Snaps to `scale(0.95)` with reduced shadow for realistic tactile feedback.
- **Accessibility**: Includes `:focus-visible` ring with 3px offset and `aria-label` tags.

---

## Source & Extracted Paths

- **Source File**: `css/components.css` (lines 565–616)
- **Extracted Component**: `ui-component-library/buttons/carousel-arrow-buttons/`

---

## Dependencies

- **Design Tokens**: `--theme-crimson-blaze`, `--theme-crimson-bright`.
