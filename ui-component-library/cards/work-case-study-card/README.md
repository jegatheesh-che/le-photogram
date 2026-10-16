# Work / Case Study Editorial Card

An architectural project preview card with masked photo frame, 6% GPU hover zoom, case study title with crimson color transition, and right-aligned event date.

---

## Visual Characteristics

- **Frame**: 480px fixed height frame with 0px geometry and 1px border.
- **Hover Micro-Interaction**: Image scales to `1.06` with easing `cubic-bezier(0.16, 1, 0.3, 1)` while title highlights in signature crimson (`#800A19`).
- **Parallax Compatible**: Can wrap `.parallax-img` inside `.parallax-frame` for live scroll scrub.

---

## Source & Extracted Paths

- **Source File**: `index.html` (lines 270–324), `css/pages.css` (lines 503–540)
- **Extracted Component**: `ui-component-library/cards/work-case-study-card/`

---

## Dependencies

- **Design Tokens**: `--font-sans`, `--theme-crimson-blaze`, `--color-border`.
- **Assets**: Editorial wedding/portrait photography asset.
