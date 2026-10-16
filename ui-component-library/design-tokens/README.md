# Design Tokens & Core Styling System

The Le PhotoGRAM design system is constructed on a **High-Fashion Bright Editorial** visual standard where **Pure White (`#FFFFFF`)** serves as the dominant canvas.

---

## 1. Color System (60 - 30 - 10 Rule)

| Token Variable | Hex / RGBA | Distribution & Purpose |
| :--- | :--- | :--- |
| `--theme-pure-white` | `#FFFFFF` | **60% Primary Canvas**: Bright, luminous art-gallery aesthetic. |
| `--theme-porcelain-light` | `#FAF8F5` | **Alternating Surfaces**: Textured linen tone for secondary sections and footer. |
| `--theme-ivory-card` | `#F7F5EE` | **Warm Luxury Cards**: Editorial cards and triptych backing. |
| `--theme-varden-warm` | `#FDF0D5` | **Champagne Warm Accent**: Subtle warmth highlights. |
| `--theme-ink-black` | `#141414` | **30% Razor-Sharp Ink**: Headlines, logo wordmark, buttons, borders. |
| `--theme-ink-muted` | `#555555` | **Descriptions & Narrative Copy**: Soft high-contrast text. |
| `--theme-ink-faint` | `#777777` | **Metadata & Labels**: Section numbers, dates, fine print. |
| `--theme-crimson-blaze` | `#800A19` | **10% Signature Accent**: Eyebrows, primary buttons, active underlines. |
| `--theme-crimson-bright` | `#A01224` | **Interactive Hover**: Hover states for CTA buttons and links. |
| `--theme-crimson-dark` | `#5B040F` | **Deep Wine Shadow**: Background underlays. |

---

## 2. Typography

1. **Editorial Display Serif**: `Italiana` (Headlines, wordmark, section numbers)
2. **Editorial Accent Serif**: `Cormorant Garamond` (Pullquotes, case studies)
3. **Structured Editorial Sans**: `Instrument Sans` (Navigation, labels, paragraphs, buttons)

---

## 3. Geometry & Borders

- **Architectural Zero Radius**: `border-radius: 0px` for all cards, buttons, frames, and modals (except specific mobile iOS drawer & circular controls).
- **Hairline Dividers**: `1px solid rgba(20, 20, 20, 0.12)`.

---

## 4. How to Import

Link `tokens.css` at the top of your HTML or `@import` inside your project's main stylesheet:

```html
<link rel="stylesheet" href="path/to/design-tokens/tokens.css">
```
