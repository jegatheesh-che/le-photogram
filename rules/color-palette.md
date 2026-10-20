# Le PhotoGRAM - Official Color Palette & Design System Rules

This document defines the official **High-Fashion Bright Editorial (White as Main)** design system, typography, and color rules for **Le PhotoGRAM** across all pages.

> [!IMPORTANT]
> **CORE RULE**: The primary canvas of the site is **Pure White (`#FFFFFF`)**.
> **STRICT BAN**: Do **NOT** use **Blue Marble / Soft Slate (`#669BBC`, `#3A6885`)** anywhere on this site.

---

## 1. The Core Color Palette

| Token Name | Hex / RGBA | Role & Application |
| :--- | :--- | :--- |
| **Pure Stark White** | `#FFFFFF` | **Primary Site Canvas (Main)**: Dominant bright, luxury art-gallery background across all pages. |
| **Warm Porcelain** | `#FAF8F5` | **Alternating Surfaces & Footer**: Subtly textured linen/paper surface for secondary sections and footer. |
| **Editorial Ivory / Varden** | `#FDF0D5` / `#F7F5EE` | **Warm Luxury Cards**: 3-column architectural triptych board, testimonial showcase card, and luxury badge backgrounds. |
| **Deep Ink Black** | `#141414` | **Primary Typography & Anchors**: High-contrast, razor-sharp editorial headlines, wordmark, logo, buttons, and navigation links. |
| **Muted Ink Charcoal** | `#555555` | **Secondary Descriptions & Copy**: Subtitles, paragraphs, and narrative text. |
| **Faint Ink Grey** | `#777777` | **Metadata & Dates**: Section counters, wedding story dates (`Aug 29, 2026`), role tags, and fine labels. |
| **Signature Crimson Red** | `#800000` | **Luxury Interactive Accent**: Section eyebrows, primary CTA buttons, active link underlines, and hover highlights. |
| **Interactive Hover Crimson**| `#9E0000` | **Micro-interactions**: Button hover states, icon highlights, and active nav links. |

---

## 2. Palette Distribution (60 - 30 - 10 Rule)

### 60% — Luminous White Canvas (`#FFFFFF` & `#FAF8F5`)
* **Page Canvas:** Pristine `#FFFFFF` with ultra-fine tactile paper texture.
* **Sticky Navigation:** Translucent white (`rgba(255, 255, 255, 0.94)`) with backdrop blur and hairline border.
* **Card Backings:** Clean white surfaces with soft, elegant diffuse drop shadows.

### 30% — Razor-Sharp Ink Typography & Hairlines (`#141414` & `rgba(20, 20, 20, 0.12)`)
* **Deep Ink Black:** All primary titles (`ART CRAFTED & WITH LOVE`), large numbers (`450+`, `12+`), navigation links, button borders, and editorial icons.
* **Muted Charcoal:** Descriptions, body text, and footer links.
* **Crisp Hairline Borders:** `1px solid rgba(20, 20, 20, 0.12)` structuring rows, cards, and dividers.

### 10% — Signature Crimson & Warm Luxury Accents (`#800000` & `#FDF0D5`)
* **Signature Crimson (`#800000`):** Section eyebrows (`(01) ABOUT`, `(02) WORKS`), primary CTA buttons, active links, hover states.
* **Warm Ivory Board (`#FDF0D5` / `#F7F5EE`):** The 3-column architectural About board, testimonial quote card.

---

## 3. Official CSS Tokens (`css/base.css`)

```css
:root {
  /* High-Fashion Bright Editorial Tokens (White as Main) */
  --theme-pure-white: #FFFFFF;          /* Pure White Main Background */
  --theme-porcelain-light: #FAF8F5;     /* Warm Off-White Secondary Sections */
  --theme-ivory-card: #F7F5EE;          /* Editorial Triptych Board & Cards */
  --theme-varden-warm: #FDF0D5;         /* Luxury Champagne / Varden Accent Surface */
  --theme-ink-black: #141414;           /* Primary Ink Typography */
  --theme-ink-muted: #555555;           /* Secondary Body & Description */
  --theme-ink-faint: #777777;           /* Metadata, Eyebrows & Tags */
  --theme-crimson-blaze: #800000;       /* Signature Luxury Maroon (#800000) */
  --theme-crimson-bright: #9E0000;      /* Interactive Hover Maroon */
  --theme-crimson-dark: #500000;        /* Deep Maroon Shadow */

  /* Semantic UI Colors */
  --color-bg: var(--theme-pure-white);
  --color-bg-alt: var(--theme-porcelain-light);
  --color-bg-dark: var(--theme-ivory-card);
  --color-surface: var(--theme-pure-white);
  --color-surface-hover: var(--theme-varden-warm);
  --color-surface-warm: var(--theme-varden-warm);
  --color-surface-warm-text: #800000;
  --color-text: var(--theme-ink-black);
  --color-text-secondary: var(--theme-ink-muted);
  --color-text-muted: var(--theme-ink-faint);
  --color-border: rgba(20, 20, 20, 0.12);
  --color-border-faint: rgba(20, 20, 20, 0.06);
  --color-border-bold: var(--theme-ink-black);
  --color-accent-primary: var(--theme-crimson-blaze);
  --color-accent-deep: var(--theme-crimson-dark);
  --color-accent-subtle: rgba(128, 0, 0, 0.12);
  --color-accent-warm: var(--theme-varden-warm);
}
```

---

## 4. Forbidden Rules
1. ❌ **NEVER** use dark or crimson as the full-page background; **White is the Main background**.
2. ❌ **NEVER** introduce blue colors (`#669BBC`, `#3A6885`, `#003049`) anywhere on the site.
3. ❌ **NEVER** invert the logo on white background; render the crisp black logo wordmark directly.
4. ❌ **NEVER** use rounded bubbly corners (`border-radius: 9999px` on cards); retain sharp editorial architectural aesthetics (`border-radius: 0px`).
