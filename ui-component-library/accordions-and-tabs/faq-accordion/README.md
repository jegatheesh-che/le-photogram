# Minimal Luxury FAQ Accordion

An editorial accordion list with indexed numeric indicators in signature crimson, Cormorant Garamond display serif questions, 45-degree rotating plus/close triggers, and smooth max-height animation.

---

## Visual Characteristics

- **Indicator Micro-Interaction**: The clean `+` glyph smoothly rotates `45deg` into a close `&times;` cross while illuminating in Crimson Blaze (`#800A19`).
- **Quiet Luxury Experience**: Automatically closes previously open panels when a new question is activated to maintain a calm, uncrowded reading viewport.
- **Accessibility**: Includes `aria-expanded="false/true"` attributes, button keyboard navigation, and the native `hidden` attribute during closed state.

---

## Source & Extracted Paths

- **Source File**: `faq.html` (lines 167–280), `css/pages.css` (lines 7370–7445), `js/faq.js` (lines 1–58)
- **Extracted Component**: `ui-component-library/accordions-and-tabs/faq-accordion/`

---

## Dependencies

- **Design Tokens**: `--font-accent`, `--font-sans`, `--theme-crimson-blaze`, `--color-border`.
- **JavaScript**: Built-in vanilla JS accordion controller (`component.js`).
