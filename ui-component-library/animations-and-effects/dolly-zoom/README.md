# Cinematic Dolly Zoom (Vertigo Effect)

An optical scroll effect simulating Alfred Hitchcock's legendary "Vertigo" dolly zoom in cinematography—where the camera moves backward while the lens zooms forward.

## Visual Physics
- As the user scrolls past the photo container, the image subtly compresses from `scale(1.15)` down to `scale(1.02)`, while counter-translating `translateY(-4% -> +4%)`.
- The subject stays visually anchored within the frame while the peripheral background perspective appears to warp smoothly.
- Overflow is tightly masked inside the parent container (`overflow: hidden`).

## Files
- `component.html`: Container frame and image markup.
- `component.css`: Masking container and base transform settings.
- `component.js`: Standalone scroll listener (supports native vanilla calculation or GSAP ScrollTrigger).

## Dependencies
- `tokens.css` (or `--color-crimson`, `--color-border-warm`, `--font-sans`).

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<div class="dolly-zoom-container">
  <div class="dolly-zoom-frame">
    <img src="path/to/photo.webp" class="dolly-zoom-img" alt="Subject">
  </div>
</div>

<script src="component.js"></script>
```
