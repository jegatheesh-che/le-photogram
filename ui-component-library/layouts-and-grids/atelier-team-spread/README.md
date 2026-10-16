# Atelier Team Editorial Spread

An Awwwards-caliber magazine spread layout presenting studio artists and craftspeople through multi-layered photographic compositions and editorial typography.

---

## Architectural Features

1. **Section Header**: Tracked metadata axis with centered rule line, display serif title with crimson italic accent (`When You Work With Us`), and subtitle.
2. **Layered Photo Stage**:
   - Primary 3:4 portrait photo frame with floating ambient shadow.
   - Secondary 1:1 accent frame with crisp 3px white border overlay.
   - Angled handwritten scrapbook script annotation (`-4.5deg` and `+4.5deg`).
   - Center film index number (`01 / 02`).
3. **Editorial Text Column**:
   - Ghost numeral watermark index (`01`, `02`).
   - Artist name & signature crimson uppercase role tag.
   - Italic lead philosophy quote and descriptive bio.
   - Brutalist skill tags with hairline borders (`35mm Analog`, `Medium Format`, `Documentary`).
4. **Reversed Cadence**: Supports `.atelier-spread-row--reverse` for alternating left/right layout.

---

## Source & Extracted Paths

- **Source File**: `about.html` (lines 210–305), `css/pages.css` (lines 3147–3500)
- **Extracted Component**: `ui-component-library/layouts-and-grids/atelier-team-spread/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-accent`, `--font-sans`, `--theme-crimson-blaze`, `--theme-porcelain-light`.
- **Assets**: 2 portrait photos and 2 detail square photos.
- **JavaScript**: Optional lightweight IntersectionObserver (`component.js`).
