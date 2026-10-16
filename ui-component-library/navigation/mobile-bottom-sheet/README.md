# Mobile Bottom-Sheet Navigation Modal

An iOS-inspired bottom sheet mobile navigation modal with tactile drag handle, studio profile card, pill selection highlights, and exit action.

---

## Features

- **Backdrop Blur Overlay**: Darkened translucent backdrop (`rgba(18, 18, 18, 0.48)` + `blur(8px)`).
- **Sheet Architecture**: 28px rounded top corners, pill drag handle, profile header with circular avatar, name, and email.
- **Micro-Interactions**: Hover / active gray pill highlights (`#F4F4F5`), crimson icon transitions (`#800A19`), and bottom exit button.
- **Accessibility**: ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`), body scroll lock on open, Escape key support, and touch dismiss on backdrop.
- **Motion**: Fluid CSS transform slide-up (`cubic-bezier(0.16, 1, 0.3, 1)`) with optional GSAP staggered entrance.

---

## Source & Extracted Paths

- **Source File**: `index.html` (lines 42–136), `css/components.css` (lines 173–391), `js/nav.js` (lines 31–99)
- **Extracted Component**: `ui-component-library/navigation/mobile-bottom-sheet/`

---

## Dependencies

- **Design Tokens**: `--font-sans`, `--theme-crimson-blaze`, `--color-border`.
- **GSAP (Optional)**: For staggered list item entrance.

---

## Usage Example

```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Insert component.html here -->

<script type="module">
  import { initMobileBottomSheet } from './component.js';
  initMobileBottomSheet();
</script>
```
