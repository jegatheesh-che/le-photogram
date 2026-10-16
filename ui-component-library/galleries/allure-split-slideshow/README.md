# Allure Editorial Split Slideshow

A split-screen editorial slideshow with full edge-bleed grayscale backdrop, centered overlapping square portrait frame, right-side quote block, auto-timer, and touch gesture support.

---

## Architectural Features

1. **Left Half**: Deep ink black canvas with full-bleed grayscale background image and rotated uppercase display vertical title.
2. **Center Overlapping Frame**: 1:1 square bridal portrait with deep 60px ambient drop shadow overlapping both halves.
3. **Right Half**: Warm porcelain canvas (`#FAF8F5`) featuring a signature crimson quotation mark, Cormorant Garamond italic quote, and metadata line.
4. **Interactive Controls**: Auto-playing timer (6000ms), pause-on-hover, touch swipe gesture recognition, slide counter (`01 / 02`), and circular crimson arrow buttons.

---

## Source & Extracted Paths

- **Source File**: `portfolio.html` (lines 143–212), `css/pages.css` (lines 8381–8550), `js/carousels.js` (lines 249–327)
- **Extracted Component**: `ui-component-library/galleries/allure-split-slideshow/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-accent`, `--font-sans`, `--theme-crimson-blaze`, `--theme-porcelain-light`.
- **Assets**: 2 landscape/portrait background images and 2 square foreground portraits.
- **JavaScript**: Built-in vanilla JS slideshow controller (`component.js`).
