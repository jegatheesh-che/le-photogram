# Editorial Annotations & Badges

A suite of art-directed typography decorators used to infuse print-editorial personality into web headlines and pull-quotes.

## Included Styles
1. **Strikethrough (`.editorial-annotation-strikethrough`)**: An angled (-6deg) crimson hairline strike crossing out unwanted or conventional wording.
2. **Organic Oval Circle (`.editorial-annotation-circle`)**: A hand-drawn style pill/ellipse ring rotated at -2deg that highlights key focus words.
3. **Crown Rays (`.editorial-rays-wrapper` & `.editorial-rays-crown`)**: 3 radiant crimson rays fanning out over the top right corner of award phrases or names.
4. **Scrapbook Polaroid Label (`.scrapbook-note-box`)**: A tilted (-4.5deg) warm ivory note simulating handwritten darkroom photographer annotations.

## Files
- `component.html`: Example sentences demonstrating each decorator.
- `component.css`: Isolated decorator styles.

## Dependencies
- `tokens.css` (or `--color-crimson`, `--color-ink`, `--color-ivory`, `--font-serif-body`, `--font-sans`).

## Usage
```html
<link rel="stylesheet" href="../../design-tokens/tokens.css">
<link rel="stylesheet" href="component.css">

<!-- Wrap any word with the corresponding class -->
Preserving moments on <span class="editorial-annotation-circle">Real Film</span>.
```
