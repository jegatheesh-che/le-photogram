# Le PhotoGRAM — High-End Wedding Photography & Film Studio

A bespoke, editorial-grade web application built for Le PhotoGRAM, capturing fine-art wedding photography and cinematic motion picture across Lake Como, Provence, Amalfi, and Paris.

---

## Architecture & File Organization

```
le-photogram-paid/
├── .agents/             # Agent skills & development rules
├── assets/              # Curated brand assets, web fonts, editorial imagery & videos
│   ├── brand/           # High-resolution logos, favicons, watermarks & monograms
│   ├── fonts/           # Custom serif & editorial display typography
│   ├── images/          # Editorial wedding photography
│   └── videos/          # Cinematic film reels
├── css/                 # CSS Design System
│   ├── base.css         # Typography, CSS tokens & color variables
│   ├── components.css   # Kinfolk 3-zone header, mobile drawer, buttons & carousels
│   └── pages.css        # Section layouts, editorial grids & responsive styles
├── data/
│   └── works.json       # Featured wedding editorial metadata & film reels
├── js/                  # Production JavaScript Modules
│   ├── bundle.js        # Bundled ES runtime (GSAP, Lenis, Parallax)
│   ├── carousels.js     # High-contrast Testimonial slider & review transitions
│   ├── counters.js      # Stat counters & metrics observer
│   ├── faq.js           # Multi-category interactive FAQ accordion
│   ├── forms.js         # Booking & Contact form submission handlers
│   ├── main.js          # App lifecycle & smooth Lenis scrolling
│   ├── nav.js           # Kinfolk navigation & full-screen mobile drawer
│   ├── parallax.js      # Cinematic image & scroll parallax
│   ├── portfolio-filter.js # Real-time category filtering (All, Photo, Film, Editorial)
│   └── work-detail.js   # Dynamic wedding story loader from works.json
├── legal/               # Mandatory compliance & legal disclosures
│   ├── cookie-policy.html
│   ├── privacy-policy.html
│   └── terms-conditions.html
├── rules/
│   └── color-palette.md # Authoritative Luxury Color System & contrast standards
├── scripts/             # Maintenance, build & asset processing scripts
│   └── update_all_css.mjs
├── index.html           # Home Page
├── about.html           # About Studio & Philosophy
├── portfolio.html       # Curated Portfolio Archive & Filters
├── services.html        # Bespoke Offerings, Collections & Add-ons
├── testimonials.html    # Client Reflections & Featured Stories
├── booking.html         # Bespoke Commission Reservation & Calendar
├── contact.html         # Studio Inquiries & Commission Intake
├── faq.html             # Frequently Asked Questions & Investment Guide
├── work.html            # Individual Wedding Case Study Story
├── works.html           # Portfolio alias redirect
├── package.json         # Project dependencies & build scripts
├── vite.config.js       # Multi-page Rollup build configuration
└── .gitignore           # Git ignore rules
```

---

## Design System & Color Palette

Built strictly to the **Luxury Color System** (`rules/color-palette.md`):
- **Primary Background**: Pure White (`#FFFFFF`) / Warm Porcelain (`#FAF8F5`)
- **Card Accents**: Warm Ivory (`#F7F5EE`) with sharp 1px border (`#E5E0D8`)
- **Primary Text**: Ink Black (`#1A1A1A`) / Deep Charcoal (`#222222`)
- **Secondary Text**: Muted Warm Gray (`#666666`) / Warm Stone (`#8C827A`)
- **Signature Accent**: Deep Crimson Blaze (`#800A19`)
- **Border Radius**: 0px crisp architectural geometry throughout.

---

## Development & Production Commands

```bash
# Run local development server
npm run dev

# Re-bundle JavaScript runtime
npm run bundle

# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```
