# Editorial Studio Dark Portrait Hero

A dark-canvas editorial hero banner featuring a 100px+ display serif headline, tracked subtitle, and a vertically overlapping portrait photo that gracefully bridges the hero with subsequent sections.

---

## Visual Characteristics

- **Palette**: Deep Ink Black (`#141414`) background contrasting with white serif typography.
- **Overlapping Offset**: Center portrait card breaks the container with `margin-bottom: -140px` and floating diffuse shadow (`var(--shadow-floating)`).
- **Responsive**: Auto-scales font from 48px to 102px using `clamp()`, and downscales portrait offset to `-70px` on mobile screens.

---

## Source & Extracted Paths

- **Source File**: `about.html` (lines 143–155), `css/pages.css` (lines 2814–2861)
- **Extracted Component**: `ui-component-library/hero-sections/editorial-portrait-hero/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-sans`, `--theme-ink-black`, `--shadow-floating`.
- **Assets**: Editorial portrait image (3:4 aspect ratio).
