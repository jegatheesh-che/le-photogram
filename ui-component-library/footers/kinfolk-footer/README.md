# Kinfolk Editorial Footer

A 4-column master footer built on Warm Porcelain `#FAF8F5`, featuring atelier branding, structured navigation matrices, destination tags, and legal anchors.

## Design Highlights
- **Palette**: Warm Porcelain background with subtle sand hairline borders (`#EAE6DC`) and Signature Crimson (`#800A19`) interactive link hover accents.
- **Brand Column**: Studio wordmark logo, editorial subtitle, four-city international presence (`London • Paris • Lake Como • New York`), and direct contact mailto anchor.
- **Categorized Columns**: 3 columns for Navigation, Experience, and Social/Direct Connect.
- **Bottom Bar**: Legal notices inline with clean centered dots and an accessible "Back to top ↑" trigger.
- **Responsive Stacking**: 4 columns (Desktop) $\rightarrow$ 2 columns (Tablet) $\rightarrow$ 1 column (Mobile).

## Files
- `component.html`: Semantic footer markup.
- `component.css`: Isolated styling.

## Dependencies
- `tokens.css` (or `--color-porcelain`, `--color-ink`, `--color-ink-muted`, `--color-crimson`, `--font-sans`).
- Studio logo asset (`../../assets/brand/full-logo-black.png`).

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Insert component.html at the end of the <body> -->
```
