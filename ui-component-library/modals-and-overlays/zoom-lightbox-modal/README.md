# Luxury Click-to-Zoom Lightbox Modal

A fullscreen, high-fashion photography zoom modal with an atmospheric 20px backdrop blur, deep charcoal overlay, and smooth scale transitions.

## Features
- **Cinematic Backdrop**: 94% opacity `#0E0F11` canvas with `backdrop-filter: blur(20px)`.
- **Responsive Staging**: Images scale to max 90vw / 80vh while preserving natural aspect ratios.
- **Micro-Interactions**: Circular close button with crimson background fill on hover (`#800A19`).
- **Accessibility & Dismissal**: ARIA modal attributes, Escape key listener, background click dismissal, and `body.style.overflow = 'hidden'` scroll locking.
- **Global API**: Exposes `window.AtelierLightbox.open(src, alt)` and `close()` for effortless programmatic invocation.

## Files
- `component.html`: Modal markup and sample trigger.
- `component.css`: Isolated modal styling with blur and animations.
- `component.js`: Standalone script handling trigger binding, modal display, and keyboard events.

## Dependencies
- `tokens.css` (or `--color-crimson`, `--font-sans`).

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Include the lightbox in your layout -->
<div class="gallery-lightbox" id="siteLightbox" role="dialog" aria-modal="true" aria-hidden="true">
  <button class="gallery-lightbox-close" id="lightboxCloseBtn" aria-label="Close zoomed view">&times;</button>
  <div class="gallery-lightbox-stage">
    <img src="" alt="" class="gallery-lightbox-img" id="lightboxActiveImg" />
    <div class="gallery-lightbox-caption" id="lightboxCaption"></div>
  </div>
</div>

<script src="component.js"></script>

<!-- Open via Javascript anytime: -->
<script>
  window.AtelierLightbox.open('path/to/photo.webp', 'Sunset Wedding in Ravello');
</script>
```
