# Curtain Reveal Image Effect

An editorial unmasking transition where a solid porcelain curtain panel slides upward with a crimson hairline leading edge, cleanly revealing the photography underneath.

## Motion Profile
- **Panel Easing**: `cubic-bezier(0.77, 0, 0.175, 1)` over 1.0 second.
- **Image Zoom-Out**: Inner image begins at `scale(1.06)` and eases down to `scale(1.00)` simultaneously.
- **Trigger**: Automatic on scroll entrance via `IntersectionObserver` (threshold `0.25`).
- **Interactive Replay**: Includes manual reset capability for demonstrations.

## Files
- `component.html`: Curtain wrapper markup and demo trigger.
- `component.css`: Isolated styling and cubic-bezier transition curves.
- `component.js`: Viewport entrance observer and replay controller.

## Dependencies
- `tokens.css` (or `--color-porcelain`, `--color-crimson`, `--color-border-warm`, `--font-sans`).

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<div class="curtain-reveal-wrap">
  <img src="path/to/image.webp" class="curtain-reveal-img" alt="Artwork">
  <div class="curtain-panel" aria-hidden="true">
    <div class="curtain-lead-line"></div>
  </div>
</div>

<script src="component.js"></script>
```
