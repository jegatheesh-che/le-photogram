# Curated Testimonials Grid

A 3-column architectural editorial grid displaying verified client reviews with couple avatars, star ratings, and destination tags.

## Visual Design
- **Grid Layout**: 3 columns (Desktop) $\rightarrow$ 2 columns (Tablet) $\rightarrow$ 1 column (Mobile).
- **Featured Variant**: Includes a crimson left border accent (`3px solid #800A19`) and Warm Ivory background to create natural visual hierarchy.
- **Card Styling**: 0px brutalist sharp edges, 1px warm sand border, and Cormorant Garamond italic blockquotes.
- **Micro-Interactions**: Hover translates card by `-4px` with warm elevation shadow and border tint.

## Files
- `component.html`: 3-card grid HTML markup.
- `component.css`: Fully scoped grid and card styles.

## Dependencies
- `tokens.css` (or `--color-porcelain`, `--color-white`, `--color-crimson`, `--color-ink`, `--color-border-warm`).
- Cormorant Garamond and Instrument Sans fonts.

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Insert component.html -->
```
