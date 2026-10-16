# Kinfolk 3-Zone Editorial Sticky Header

A luxury, high-fashion editorial fixed navigation header with a 3-zone architecture:
1. **Zone 1 (Left)**: Spaced serif studio wordmark.
2. **Zone 2 (Center)**: Centered tracked uppercase links with active signature crimson underline indicator.
3. **Zone 3 (Right)**: Brutalist primary CTA button and animated hamburger toggle.

---

## Visual & Aesthetic Characteristics

- **Background**: Translucent pure white (`rgba(255, 255, 255, 0.96)`) with `backdrop-filter: blur(16px)`.
- **Scroll State**: Smooth transition to `.scrolled` state featuring crisp bottom border and subtle ambient shadow.
- **Responsive**: Auto-collapses center links on `<= 900px` screens, revealing the hamburger toggle.

---

## Source & Extracted Paths

- **Source File**: `index.html` (lines 15–40) & `css/components.css` (lines 11–169)
- **Extracted Component**: `ui-component-library/navigation/kinfolk-header/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-sans`, `--theme-ink-black`, `--theme-crimson-blaze`, `--color-border`.
- **JavaScript**: Optional scroll listener (`component.js`).

---

## Usage Example

```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Insert component.html here -->

<script type="module">
  import { initKinfolkHeader } from './component.js';
  initKinfolkHeader();
</script>
```
