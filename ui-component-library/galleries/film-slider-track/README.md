# Cinematic Film Slider Track

A horizontal draggable carousel built specifically for motion picture film reels, incorporating desktop mouse momentum dragging, mobile touch gestures, snap-to-slide physics, and next/prev arrow buttons.

---

## Visual Characteristics

- **Track Layout**: Horizontal flex strip with 24px gap and hidden native scrollbars.
- **Physics**: Real-time cursor grab/grabbing feedback with automatic mathematical snapping to the nearest slide on mouse release.
- **Slide Dimensions**: 380px width, 480px height (responsive down to 300px by 400px on mobile).

---

## Source & Extracted Paths

- **Source File**: `index.html` (lines 331–377), `css/pages.css` (lines 548–588), `js/carousels.js` (lines 4–151)
- **Extracted Component**: `ui-component-library/galleries/film-slider-track/`

---

## Dependencies

- **Design Tokens**: `--font-serif`, `--font-sans`, `--theme-crimson-blaze`, `--theme-ink-black`.
- **Assets**: MP4 looping video reels, video posters.
- **JavaScript**: Built-in vanilla JS slider controller (`component.js`).
