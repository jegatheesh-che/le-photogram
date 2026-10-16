# Testimonial Quote Carousel

An architectural luxury testimonial carousel designed as a centerpiece quote plaque.

## Visual Characteristics
- **Background**: Warm Ivory `#F7F5EE` with subtle 1px border `#EAE6DC`.
- **Typographic Anchor**: 72px decorative crimson quotation mark `“` in `#800A19`.
- **Body**: Editorial serif italic (*Cormorant Garamond*, 24px) providing emotional resonance.
- **Author Row**: 48px round portrait avatar, ink black author name, and crimson location tag.
- **Navigation**: Dual circular crimson outline arrows with hover fill and a numeric slide counter (`01 / 04`).

## Files
- `component.html`: Semantic HTML structure.
- `component.css`: Isolated styling adhering to the Kinfolk design system.
- `component.js`: Lightweight JS handling cross-fade slide transitions and index counters.

## Dependencies
- `tokens.css` (or equivalent CSS variables: `--color-crimson`, `--color-ink`, `--color-ivory`, `--font-serif`, `--font-sans`).
- Cormorant Garamond & Instrument Sans fonts.

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Insert component HTML -->
<div id="testimonialQuoteCarousel" class="testimonials-card">...</div>

<script src="component.js"></script>
```

## Responsive Behavior
- **Desktop**: Padded centerpiece plaque max-width 780px.
- **Mobile (< 768px)**: Font scales to 20px, controls stack cleanly, padding reduces gracefully.
