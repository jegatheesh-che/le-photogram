# Count-up Stats Grid

A 4-column brutalist metrics grid built with an ivory card backing, 56px editorial serif numerals, signature crimson suffixes (`+`, `%`), small-caps labels, and an interactive count-up animation.

---

## Visual Characteristics

- **Surface**: Warm Ivory Card (`#F7F5EE`) with a 1px border.
- **Typography**: 56px Italiana display serif numerals with signature Crimson Blaze accent suffixes.
- **Animation**: Smooth cubic-bezier count-up from `0` to target on viewport entry (handles reduced-motion gracefully).
- **Responsive**: Switches from 4 columns to 2 columns on tablet (`<= 900px`) and mobile (`<= 540px`).

---

## Source & Extracted Paths

- **Source File**: `index.html` (lines 220–251), `css/components.css` (lines 515–563), `js/counters.js` (lines 1–43)
- **Extracted Component**: `ui-component-library/layouts-and-grids/stats-counter-grid/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-sans`, `--theme-ivory-card`, `--theme-crimson-blaze`, `--theme-ink-black`.
- **JavaScript**: Built-in vanilla JS count-up observer (`component.js`).
