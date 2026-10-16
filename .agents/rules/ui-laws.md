# Master UI Design Laws & Formulas

All code must strictly adhere to the 7 UI laws:
1. **Inner Radius Formula**: `R_inner = R_outer - Padding` (Nested corners must follow the outer curve).
2. **Line Height Formula**: `Line Height = Font Size * (1.4 to 1.6)`.
3. **Modular Font Size Scale**: Multiples of 4 with 1.25x scaling (`12px`, `16px`, `20px`, `24px`, `32px`).
4. **Spacing Scale**: Multiples of 4px / 8px (`4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48px`).
5. **Touch Target Size**: Minimum `44px x 44px` physical hit area for all interactive controls.
6. **Optical Alignment**: Adjust mathematical centers for asymmetric glyphs and icons so they look optically centered.
7. **Color Contrast**: Minimum `4.5:1` text contrast and `3:1` UI icon contrast (WCAG AA).
