# Parallax Image Frame

A standalone editorial image frame featuring a vertical scroll-scrubbed parallax depth effect.

## Key Features
- **Container Masking**: The outer frame has `overflow: hidden` with a sharp 0px brutalist border.
- **Extended Canvas**: The internal `.parallax-img` is sized to `130%` height and positioned at `top: -15%`, giving plenty of headroom for smooth translation.
- **Dual-Engine Architecture**: Automatically detects whether GSAP + ScrollTrigger is available for smooth scrubbing; falls back to a high-performance `requestAnimationFrame` vanilla scroll calculation when GSAP is not present.
- **Reduced Motion**: Gracefully disables movement if the visitor has `prefers-reduced-motion` enabled.

## Files
- `component.html`: Container markup and sample image.
- `component.css`: Container framing and image sizing.
- `component.js`: Dual-mode scroll controller.

## Dependencies
- `tokens.css` (or `--color-border-warm`, `--color-ivory`).
- Optional: GSAP + ScrollTrigger.

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<div class="parallax-frame-container">
  <div class="parallax-frame">
    <img src="path/to/image.webp" class="parallax-img" alt="Artwork">
  </div>
</div>

<script src="component.js"></script>
```
