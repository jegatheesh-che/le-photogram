# Rotating Studio Seal Emblem

A rotating circular monogram emblem, reminiscent of antique heritage stamps, wax seals, and luxury European atelier hallmarks.

## Design Highlights
- **SVG `<textPath>` Curve**: Circular circular path rotating endlessly at 32 seconds per cycle with infinite linear easing.
- **Center Monogram**: Studio monogram insignia anchored stationary at the focal center.
- **Light & Dark Compatibility**: Add `.emblem-dark` for light-on-dark inversions (e.g. over hero photos or dark canvases).
- **Reduced Motion Support**: Automatically disables continuous spin if user specifies `prefers-reduced-motion: reduce`.

## Files
- `component.html`: Inline SVG textPath markup with center monogram image.
- `component.css`: Isolated styling and keyframe animations.

## Usage
```html
<link rel="stylesheet" href="component.css">

<!-- Inlined HTML markup -->
<div class="emblem-wrapper">
  ...
</div>
```
