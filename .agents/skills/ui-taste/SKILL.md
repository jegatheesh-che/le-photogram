---
name: ui-taste
description: Master UI/UX craftsmanship, anti-slop design heuristics, motion physics, and modern web design guidelines. Synthesizes anti-slop, impeccable, taste-skill, emilkowalski motion, and vercel design guidelines into an authoritative frontend design system. Triggered on UI design tasks and slash command /ui-task.
---

# UI-Taste: The Master Frontend Craft & Anti-Slop Design System

A unified, authoritative framework combining:
1. **Anti-Slop** (`miqdadbadjuber/anti-slop`) — Eliminating generic AI tropes, cookie-cutter templates, and uninspired layouts.
2. **Impeccable Craft** (`pbakaus/impeccable`) — Optical alignment, spatial rhythm, typography scales, contrast hierarchy, and edge-case resilience.
3. **Curated Taste** (`leonxlnx/taste-skill`) — Distinctive aesthetic point-of-view, editorial typography, purposeful color palettes, and bespoke textures.
4. **Motion & Interaction Physics** (`emilkowalski/skills`) — Fast spring physics, tactile micro-interactions, interruptible animations, and spatial continuity.
5. **Web Design Guidelines** (`vercel-labs/agent-skills`) — Strict layout geometry, semantic tokens, WCAG contrast compliance, and touch-target ergonomics.

---

## 🚫 1. The Anti-Slop Manifesto (What NEVER To Do)

AI models default to predictable, lazy design patterns. You must actively forbid and avoid:

- ❌ **No Purple/Blue AI Gradients on Pitch Black:** Avoid the clichéd `#7C3AED` to `#2563EB` linear gradient on generic `#000000` canvas.
- ❌ **No Cookie-Cutter Feature Grids:** Stop creating identical 3-column cards with generic floating icons (e.g., rocket, lock, lightning) with 2 lines of vague copy.
- ❌ **No Robotic Placeholder Text:** Never use *"Transform your workflow with cutting-edge AI solutions"* or *"Streamline your productivity"*. Use crisp, authentic, domain-accurate microcopy.
- ❌ **No Uniform Bubble Radius:** Do not blindly apply `rounded-3xl` to everything without hierarchical optical scaling (containers: 24px, inner cards: 16px, controls/inputs: 12px, tags/pills: 9999px).
- ❌ **No Empty Space Without Purpose:** Avoid sprawling 200px empty paddings masquerading as "minimalism". Prefer intentional visual density, information hierarchy, and scannable utilities.

---

## 💎 2. Impeccable Typography & Optical Rhythm

### Typography Rules
- **Type Scale System:** Standardize on a strict modular scale:
  - Hero Display: `font-extrabold tracking-tight text-3xl sm:text-5xl leading-[1.1]`
  - Section Head: `font-bold tracking-tight text-xl sm:text-2xl`
  - Card Titles: `font-bold text-base sm:text-lg`
  - Body Text: `font-normal text-sm text-gray-600 dark:text-gray-300 leading-relaxed`
  - Micro / Badges: `font-bold uppercase tracking-wider text-[10px] or text-[11px]`
- **Optical Kerning / Tracking:**
  - Headings (`>24px`): Always use `tracking-tight` or `-0.02em` to `-0.04em`.
  - Uppercase tags/labels (`<12px`): Always use `tracking-wider` or `+0.05em` with `font-bold`.
- **Vertical Rhythm & Baseline:** Match `line-height` proportionally. Never let short headlines have tall line-heights that create floating disjointed words.

---

## 🎨 3. Curated Taste & Color Palette Architecture

### Palette Depth Strategy
Every design must feature an intentional 4-layer tonal depth:
1. **Canvas Layer:** Deep textured base (`#0C0D0E` dark / `#F8F9FA` light) with subtle ambient radial gradients (`filter: blur(80px)`).
2. **Surface Layer:** Elevated cards (`#141618` dark / `#FFFFFF` light) with **1.5px subtle border strokes** (`rgba(255,255,255,0.08)` or `rgba(0,0,0,0.06)`).
3. **Interactive Control Layer:** Inputs, toggles, sub-cards (`#1F2226` dark / `#F1F3F5` light).
4. **Bespoke Accent Harmony:** Curate 1 dominant warm/vibrant accent (e.g. sunset amber `#FF9500` / coral `#FF5E3A`) supported by semantic state indicators (Emerald for positive, Coral/Red for overdue, Cobalt for upcoming).

---

## ⚡ 4. Motion Choreography & Spring Physics (Emil Kowalski Standard)

- **Snappy Durations:**
  - Button press / Toggles: `100ms - 150ms`
  - Modals / Sheets: `200ms - 280ms` (cubic-bezier `(0.16, 1, 0.3, 1)`)
  - Toasts / Notifications: `240ms`
- **Tactile Active Feedback:**
  - Every interactive card, button, and pill must have active feedback: `active:scale-[0.97]` or `active:scale-95 transition-transform`.
- **Spatial Continuity:**
  - Bottom sheets must slide from the bottom edge (`translateY(100%) -> translateY(0)`).
  - Modals fade backdrop (`opacity: 0 -> 1`) while dialog scales (`scale: 0.95 -> 1`).
  - Never use blocking or non-interruptible animations that make the UI feel sluggish.

---

## 📐 5. Layout Geometry, Ergonomics & Vercel Guidelines

- **Touch Target Ergonomics:** Mobile interactive touchpoints must be minimum `44px × 44px` physical hit area.
- **Consistent Spacing Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px.
- **Information Architecture:**
  - Above-the-fold value: Place high-frequency daily actions (Overdue items, 1-tap call/WhatsApp triggers) at thumb reach.
  - Zero dead-ends: Empty states must always offer a 1-tap recovery action (e.g., *"No follow-ups today → + Add New Client"*).
- **Sub-pixel Borders & Subtle Glows:** Replace harsh, muddy drop shadows with `border: 1.5px solid rgba(255,255,255,0.08)` + subtle colored ambient glow `box-shadow: 0 10px 25px -5px rgba(255, 149, 0, 0.25)`.

---

## 🚀 6. Execution Checklist for UI Tasks (`/ui-task`)

Before declaring any UI complete, verify against this 6-point checklist:
1. **Anti-Slop Audit:** Are there any generic placeholder texts, clichéd purple grids, or unstyled controls?
2. **Optical Balance:** Are icons optically centered within their badges? Do borders scale hierarchically?
3. **Tactile Delight:** Does every button, tab, and card react immediately with `active:scale-95`?
4. **Mobile Responsiveness:** Does it fit comfortably on 375px mobile screens with zero horizontal overflow?
5. **Instant Clarity:** Can a first-time user understand their next action in under 3 seconds?
6. **Dark/Light Cohesion:** Are contrast ratios crisp and legible in both dark and light modes?
