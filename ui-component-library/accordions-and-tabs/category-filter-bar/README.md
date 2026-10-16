# Category Filter Tabs Bar

A horizontal pill filter bar designed for real-time category filtering of portfolios, galleries, and FAQ lists without page reloads.

---

## Visual Characteristics

- **Pill Styling**: 40px rounded pills with transparent background and subtle border.
- **Active State**: Solid Ink Black (`#141414`) background with crisp white typography.
- **Accessibility**: Standard ARIA tablist/tab semantics with `aria-selected="true/false"`.
- **Logic**: Filters any child elements containing matching `data-category` attribute.

---

## Source & Extracted Paths

- **Source File**: `portfolio.html` (lines 218–224), `js/portfolio-filter.js` (lines 1–66)
- **Extracted Component**: `ui-component-library/accordions-and-tabs/category-filter-bar/`

---

## Dependencies

- **Design Tokens**: `--font-sans`, `--theme-ink-black`, `--color-border`.
- **JavaScript**: Built-in vanilla JS category filter controller (`component.js`).
