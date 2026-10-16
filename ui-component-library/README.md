# Le PhotoGRAM — UI Component Library & Architecture Catalog

> **Architectural luxury UI component library extracted from the Le PhotoGRAM high-fashion photography website. Fully self-contained, modular, and ready for drop-in reuse across future web design and development projects.**

---

## 1. Executive Summary & Design System Contract

The Le PhotoGRAM component library adheres to a strict high-fashion Kinfolk editorial aesthetic:
- **Palette (60-30-10 Rule)**:
  - **60% Primary Canvas**: Pure White (`#FFFFFF`) with Warm Porcelain (`#FAF8F5`) and Warm Ivory (`#F7F5EE`) alternating surfaces.
  - **30% Structure & Contrast**: Ink Black (`#141414`) for typographic mass, borders, and darkroom accents.
  - **10% Signature Accent**: Signature Crimson (`#800A19`, hover `#A01224`) reserved exclusively for primary interactive focal points. Blue is strictly prohibited.
- **Architectural Brutalism**: Radii are universally `0px` across all cards, buttons, frames, tabs, and form fields.
- **Kinfolk Typography**:
  - Headings & Logotypes: *Italiana* (Title Serif, letter-spacing -0.01em to +0.02em).
  - Quotes & Manifesto: *Cormorant Garamond* (Italic Body Serif, line-height 1.6).
  - UI Labels & Metadata: *Instrument Sans* (Geometric Clean Sans, uppercase, letter-spacing 0.12em–0.18em).
- **Self-Contained Isolation**: All 38 components have been extracted into individual standalone folders containing their semantic `component.html`, isolated `component.css`, lightweight `component.js` (where interactive), and dedicated `README.md`.

---

## 2. Master Component Inventory & Architecture Mapping

| # | Category | Component Name | Visual Style & Purpose | Original Source Reference | Extracted Library Path | Dependencies |
|---|---|---|---|---|---|---|
| 01 | **Foundation** | `design-tokens` | Core CSS variables, 60-30-10 colors, typography, brutalist radii | `css/base.css`, `css/components.css` | `design-tokens/tokens.css` | None (standalone CSS) |
| 02 | **Navigation** | `kinfolk-header` | 3-Zone fixed desktop/tablet header with central wordmark and scroll threshold state | `index.html` (L23-45), `css/components.css` (L10-75) | `navigation/kinfolk-header/` | `tokens.css`, `assets/brand/` |
| 03 | **Navigation** | `mobile-bottom-sheet` | iOS-style slide-up drawer modal with drag handle, profile header, and staggered pill menu | `index.html` (L48-120), `css/pages.css` (L2100-2250) | `navigation/mobile-bottom-sheet/` | `tokens.css` |
| 04 | **Navigation** | `whatsapp-floating-action` | 56px circular floating action button with hover tooltip and official WhatsApp green | `index.html` (L380-395), `css/components.css` (L750-785) | `navigation/whatsapp-floating-action/` | `tokens.css` |
| 05 | **Hero Sections** | `cinematic-video-hero` | Fullscreen 100vh loop video backdrop with dark overlay, Italiana wordmark, and 3D mouse parallax | `index.html` (L122-145), `css/pages.css` (L100-180) | `hero-sections/cinematic-video-hero/` | `tokens.css`, `hero-preview.mp4` |
| 06 | **Hero Sections** | `editorial-portrait-hero` | Deep charcoal `#141414` canvas with 102px serif headline and overlapping floating portrait | `about.html` (L125-175), `css/pages.css` (L1450-1580) | `hero-sections/editorial-portrait-hero/` | `tokens.css`, `img1.webp` |
| 07 | **Hero Sections** | `services-plaque-hero` | Floating Warm Ivory plaque over atmospheric photo backdrop with bespoke collection tags | `services.html` (L125-165), `css/pages.css` (L2400-2480) | `hero-sections/services-plaque-hero/` | `tokens.css`, `img1.webp` |
| 08 | **Hero Sections** | `atmospheric-hero-banner` | Mid-height photo banner with crimson eyebrow, double dark gradient scrim, and centered title | `work.html` (L125-150), `css/pages.css` (L3100-3160) | `hero-sections/atmospheric-hero-banner/` | `tokens.css`, `img28.webp` |
| 09 | **Cards** | `editorial-triptych-card` | 3-Column about card board with crimson structural underlay and overlapping medium format stills | `index.html` (L150-195), `css/pages.css` (L350-480) | `cards/editorial-triptych-card/` | `tokens.css`, `img2-5.webp` |
| 10 | **Cards** | `work-case-study-card` | Editorial photo frame with 6% GPU zoom, crimson index counter, and destination tags | `work.html` (L170-220), `css/components.css` (L220-290) | `cards/work-case-study-card/` | `tokens.css`, `img2.webp` |
| 11 | **Cards** | `curated-testimonial-card` | White brutalist card with crimson index counter, italic quote, and couple avatar footer | `testimonials.html` (L180-240), `css/pages.css` (L4200-4280) | `cards/curated-testimonial-card/` | `tokens.css`, `img35.webp` |
| 12 | **Cards** | `editorial-pullquote-card` | 2-Column ivory card with 1:1 square photo and Cormorant Garamond italic manifesto quote | `about.html` (L240-275), `css/pages.css` (L1700-1760) | `cards/editorial-pullquote-card/` | `tokens.css`, `img6.webp` |
| 13 | **Cards** | `film-slide-card` | 380x480px looping video reel card with play badge button, destination tag, and title | `index.html` (L235-265), `css/pages.css` (L600-675) | `cards/film-slide-card/` | `tokens.css`, `hero-preview.mp4` |
| 14 | **Cards** | `contact-channel-card` | Interactive contact channel row with inverting circular icon badges and crimson arrow transition | `contact.html` (L150-190), `css/pages.css` (L5100-5170) | `cards/contact-channel-card/` | `tokens.css` |
| 15 | **Cards** | `cinematic-floating-card` | Glassmorphic floating photo card with 4:5 image, geographic coordinate tags, and crimson glow | `index.html` (L210-230), `css/pages.css` (L1370-1440) | `cards/cinematic-floating-card/` | `tokens.css`, `img7.webp` |
| 16 | **Buttons** | `editorial-buttons` | 4 Distinct pill styles: Outline, Solid Crimson, Warm Ivory, and Editorial Arrow Link | `css/components.css` (L120-195) | `buttons/editorial-buttons/` | `tokens.css` |
| 17 | **Buttons** | `carousel-arrow-buttons` | 44px circular crimson directional controls with SVG arrows and scale hover states | `css/components.css` (L200-240) | `buttons/carousel-arrow-buttons/` | `tokens.css` |
| 18 | **Layouts & Grids** | `services-axis-timeline` | Center vertical spine hairline timeline with alternating terracotta and forest photo blocks | `services.html` (L180-280), `css/pages.css` (L2500-2680) | `layouts-and-grids/services-axis-timeline/` | `tokens.css`, `img1-4.webp` |
| 19 | **Layouts & Grids** | `atelier-team-spread` | 3-Column team spread with Polaroid style frames, darkroom film index badges, and skill tags | `about.html` (L310-420), `css/pages.css` (L1850-2050) | `layouts-and-grids/atelier-team-spread/` | `tokens.css`, `img8-10.webp` |
| 20 | **Layouts & Grids** | `stats-counter-grid` | 4-Column responsive metrics grid featuring live requestAnimationFrame count-up animation | `index.html` (L270-305), `css/components.css` (L380-450) | `layouts-and-grids/stats-counter-grid/` | `tokens.css`, `component.js` |
| 21 | **Layouts & Grids** | `editorial-story-split` | Kinfolk manifesto layout with 48px title left and 2-column narrative text right | `about.html` (L190-230), `css/pages.css` (L1620-1695) | `layouts-and-grids/editorial-story-split/` | `tokens.css` |
| 22 | **Layouts & Grids** | `section-header-pattern` | Standardized header with category tag, counter badge, 56px title, and crimson hairline rule | `css/components.css` (L80-115) | `layouts-and-grids/section-header-pattern/` | `tokens.css` |
| 23 | **Galleries** | `portfolio-mosaic-grid` | Pure photography cascading 3-column mosaic gallery with zoom cursor and category filter tags | `portfolio.html` (L225-385), `css/pages.css` (L3800-4050) | `galleries/portfolio-mosaic-grid/` | `tokens.css`, `assets/images/` |
| 24 | **Galleries** | `allure-split-slideshow` | Split-screen auto-slider with timer progress bar, touch swipe, and overlapping center portrait | `portfolio.html` (L130-210), `css/pages.css` (L3450-3700) | `galleries/allure-split-slideshow/` | `tokens.css`, `component.js` |
| 25 | **Galleries** | `film-slider-track` | Momentum drag-to-scroll video slider track with snapping physics and progress indicators | `index.html` (L230-270), `css/pages.css` (L550-650) | `galleries/film-slider-track/` | `tokens.css`, `component.js` |
| 26 | **Galleries** | `case-study-gallery` | Editorial project detail image spreads alternating between full-width banners and 2-column grids | `work.html` (L240-330), `css/pages.css` (L3200-3350) | `galleries/case-study-gallery/` | `tokens.css`, `assets/images/` |
| 27 | **Forms & Inputs** | `luxury-split-form` | 2-Column booking form with atmospheric photo card left and comprehensive input grid right | `booking.html` (L125-245), `css/pages.css` (L4500-4750) | `forms-and-inputs/luxury-split-form/` | `tokens.css`, `component.js` |
| 28 | **Forms & Inputs** | `form-controls` | Isolated form primitives: text inputs, custom select dropdowns, radio pill chips, textarea | `booking.html`, `contact.html`, `css/components.css` | `forms-and-inputs/form-controls/` | `tokens.css` |
| 29 | **Accordions & Tabs** | `faq-accordion` | Single-open collapsible FAQ list with 45-degree rotating plus icon and smooth expansion | `faq.html` (L130-220), `css/pages.css` (L4350-4480) | `accordions-and-tabs/faq-accordion/` | `tokens.css`, `component.js` |
| 30 | **Accordions & Tabs** | `category-filter-bar` | Horizontal pill tab bar with animated active indicator and category filtering logic | `portfolio.html` (L215-225), `css/pages.css` (L3750-3810) | `accordions-and-tabs/category-filter-bar/` | `tokens.css`, `component.js` |
| 31 | **Testimonials** | `testimonial-quote-carousel` | Centerpiece Warm Ivory quote plaque with 72px crimson quote glyph, avatar, and counter | `testimonials.html` (L125-175), `css/pages.css` (L4100-4200) | `testimonials/testimonial-quote-carousel/` | `tokens.css`, `component.js` |
| 32 | **Testimonials** | `curated-testimonials-grid` | 3-Column architectural grid displaying verified couple reviews with star ratings and venue tags | `testimonials.html` (L180-260), `css/pages.css` (L4220-4320) | `testimonials/curated-testimonials-grid/` | `tokens.css` |
| 33 | **Modals & Overlays** | `zoom-lightbox-modal` | Fullscreen photo lightbox with 20px backdrop blur, 94% overlay, caption, and Escape dismiss | `js/lightbox.js`, `css/pages.css` (L4096-4178) | `modals-and-overlays/zoom-lightbox-modal/` | `tokens.css`, `component.js` |
| 34 | **Footers** | `kinfolk-footer` | 4-Column Warm Porcelain master footer with atelier branding, locations, and back-to-top trigger | `index.html` (L340-375), `css/components.css` (L620-770) | `footers/kinfolk-footer/` | `tokens.css`, `assets/brand/` |
| 35 | **Animations & Effects** | `parallax-frame` | Vertical image scroll-scrubbing frame (supports vanilla RAF or GSAP ScrollTrigger) | `js/parallax.js` (L115-135), `css/components.css` | `animations-and-effects/parallax-frame/` | `tokens.css`, `component.js` |
| 36 | **Animations & Effects** | `dolly-zoom` | Continuous live camera push & perspective warp (scale 1.15 down to 1.02) on scroll | `js/motion.js` (L580-630), `css/pages.css` | `animations-and-effects/dolly-zoom/` | `tokens.css`, `component.js` |
| 37 | **Animations & Effects** | `rotating-seal-emblem` | Continuous 32s linear spinning circular SVG `<textPath>` seal with center monogram | `css/pages.css` (L1335-1369), `assets/brand/` | `animations-and-effects/rotating-seal-emblem/` | `tokens.css` |
| 38 | **Animations & Effects** | `curtain-reveal` | Unmasking porcelain curtain overlay with crimson hairline lead and replay controller | `js/motion.js`, `css/pages.css` | `animations-and-effects/curtain-reveal/` | `tokens.css`, `component.js` |
| 39 | **Badges & Accents** | `editorial-annotations` | 4 Typographic decorators: Strikethrough, Circle Badge, Crown Rays, and Scrapbook Polaroid Label | `css/components.css` (L798-850), `css/pages.css` (L3336) | `badges-and-decorations/editorial-annotations/` | `tokens.css` |

---

## 3. Directory Structure

```
ui-component-library/
├── index.html                           # Master Interactive Showcase & Living Catalog
├── README.md                            # Comprehensive Architectural Inventory (This file)
├── design-tokens/                       # Foundation Design Tokens
│   ├── tokens.css                       # Color palette, typography, radii, spacing, easing
│   └── README.md                        # Design token specifications
├── assets/                              # Local Self-Contained Assets
│   ├── brand/                           # Studio logos, wordmarks, watermarks, monograms
│   ├── fonts/                           # Italiana, Cormorant Garamond, Instrument Sans
│   ├── images/                          # Curated webp photography (img1.webp - img35.webp)
│   └── videos/                          # Looping video reel asset (hero-preview.mp4)
├── navigation/
│   ├── kinfolk-header/                  # 3-Zone fixed header with responsive hamburger
│   ├── mobile-bottom-sheet/             # iOS-style bottom drawer navigation modal
│   └── whatsapp-floating-action/        # Floating circular WhatsApp action button
├── hero-sections/
│   ├── cinematic-video-hero/            # 100vh video background hero with 3D mouse parallax
│   ├── editorial-portrait-hero/         # Dark canvas 102px serif hero with floating portrait
│   ├── services-plaque-hero/            # Floating ivory plaque hero on photo backdrop
│   └── atmospheric-hero-banner/         # Mid-height photo banner with crimson eyebrow
├── cards/
│   ├── editorial-triptych-card/         # 3-Column architectural board with crimson underlay
│   ├── work-case-study-card/            # Photo frame with 6% GPU zoom and destination metadata
│   ├── curated-testimonial-card/        # White brutalist review card with avatar footer
│   ├── editorial-pullquote-card/        # 2-Column ivory card with 1:1 image and italic quote
│   ├── film-slide-card/                 # 380x480px video reel card with play badge button
│   ├── contact-channel-card/            # Contact channel item with inverting icon badge
│   └── cinematic-floating-card/         # Glassmorphic card with coordinates and crimson glow
├── buttons/
│   ├── editorial-buttons/               # Outline, Solid Crimson, Warm Ivory, & Arrow Link
│   └── carousel-arrow-buttons/          # 44px circular directional controls with SVG arrows
├── layouts-and-grids/
│   ├── services-axis-timeline/          # Center vertical spine timeline with offset photo blocks
│   ├── atelier-team-spread/             # Team spread with Polaroids, film indexes, and tags
│   ├── stats-counter-grid/              # 4-Column stats grid with requestAnimationFrame count-up
│   ├── editorial-story-split/           # Manifesto headline left with 2-column narrative right
│   └── section-header-pattern/          # Header with eyebrow, counter, title, and hairline rule
├── galleries/
│   ├── portfolio-mosaic-grid/           # 3-Column cascading masonry gallery with zoom cursor
│   ├── allure-split-slideshow/          # Split-screen auto-slider with timer bar and swipe
│   ├── film-slider-track/               # Momentum drag-to-scroll video slider track
│   └── case-study-gallery/              # Alternating full-width and 2-column project spreads
├── forms-and-inputs/
│   ├── luxury-split-form/               # 2-Column booking form with date picker and validation
│   └── form-controls/                   # Floating inputs, custom select, radio pills, textarea
├── accordions-and-tabs/
│   ├── faq-accordion/                   # Single-open accordion with 45-degree rotating plus
│   └── category-filter-bar/             # Horizontal filter tabs with animated indicator
├── testimonials/
│   ├── testimonial-quote-carousel/      # Centerpiece quote board with quote glyph and counter
│   └── curated-testimonials-grid/       # 3-Column architectural grid of verified reviews
├── modals-and-overlays/
│   └── zoom-lightbox-modal/             # Fullscreen lightbox with 20px blur and Escape dismiss
├── footers/
│   └── kinfolk-footer/                  # 4-Column porcelain footer with branding & back-to-top
├── animations-and-effects/
│   ├── parallax-frame/                  # Vertical image parallax scroll scrub frame
│   ├── dolly-zoom/                      # Continuous perspective vertigo dolly zoom on scroll
│   ├── rotating-seal-emblem/            # Continuous 32s spinning circular SVG text seal
│   └── curtain-reveal/                  # Unmasking porcelain curtain overlay with replay trigger
└── badges-and-decorations/
    └── editorial-annotations/           # Strikethrough, Circle badge, Crown rays, Polaroid label
```

---

## 4. How to Preview and Reuse Components in Future Projects

### A. Previewing the Components
Open `ui-component-library/index.html` directly in any web browser or via a local static file server:
- All assets (fonts, images, brand marks, videos) are linked locally via relative paths.
- The showcase features a sticky sidebar navigator, live component previews, interactive JavaScript controls, and a toggleable code viewer with one-click copy buttons.

### B. Dropping a Component Into a New Project
1. **Import the Core Tokens**:
   Link `design-tokens/tokens.css` in your document `<head>`:
   ```html
   <link rel="stylesheet" href="path/to/tokens.css">
   ```
2. **Copy the Component Markup**:
   Copy the HTML structure from the component's `component.html` file into your page.
3. **Include the Scoped CSS**:
   Link the component's isolated `component.css`:
   ```html
   <link rel="stylesheet" href="path/to/component.css">
   ```
4. **Include the Component JS (if interactive)**:
   Add the component's `component.js` script tag before the closing `</body>` tag:
   ```html
   <script src="path/to/component.js"></script>
   ```

---

## 5. Components Dependent on External Libraries or Global Context

All components in this library have been designed to function as standalone vanilla HTML/CSS/JS modules. However, certain high-end visual behaviors benefit from optional external libraries:

1. **Smooth Scroll Engine (`Lenis`)**:
   - The original website uses `lenis` for inertia scrolling. In new projects, components function with standard native browser scrolling. If Lenis is desired:
     ```bash
     npm install lenis
     ```
2. **GSAP & ScrollTrigger Scrubbing**:
   - `cinematic-video-hero`, `parallax-frame`, and `dolly-zoom` include native vanilla JavaScript fallbacks (`requestAnimationFrame` and `IntersectionObserver`). However, if GSAP is available in the target project, the scripts automatically detect `window.gsap` and activate hardware-accelerated ScrollTrigger scrubbing.
3. **Local Font Files**:
   - `Italiana`, `Cormorant Garamond`, and `Instrument Sans` are provided locally inside `assets/fonts/` with `@font-face` definitions declared in `design-tokens/tokens.css`. Alternatively, they can be imported from Google Fonts:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Italiana&display=swap" rel="stylesheet">
     ```

---

## 6. Protection of the Original Project

In strict accordance with the project safety invariant:
- **Zero original files were edited, moved, renamed, formatted, deleted, or refactored.**
- **The existing website's live code, routing, and assets remain 100% untouched.**
- **All component library code and assets are strictly self-contained within the new `ui-component-library/` directory.**
