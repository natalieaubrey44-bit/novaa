# Novaa Design System & Brand Guidelines

## Color Tokens

### Light Mode Palette
```css
--color-brand-primary:   #0D1117  /* Dark grey/navy — headings, primary text */
--color-brand-secondary: #374151  /* Medium grey — secondary text, body copy ⚠️ Low contrast on light bg */
--color-brand-accent:    #059669  /* Emerald green — CTAs, highlights, interactive elements */
--color-brand-light:     #F8FAFC  /* Off-white — page backgrounds */
--color-brand-muted:     #F1F5F9  /* Light grey — card backgrounds, subtle surfaces */
--color-brand-dark:      #CBD5E1  /* Silver — borders, subtle dividers */
--color-brand-success:   #059669  /* Success indicator (same as accent for fintech) */
```

### Dark Mode Palette
```css
--color-brand-navy:      #0B0E14  /* Deep space navy — page backgrounds */
--color-brand-primary:   #0D1117  /* Used as card/surface background in dark */
--color-brand-surface:   #161B22  /* Darker surface for layering */
--color-brand-accent:    #059669  /* Emerald green — maintained for consistency */
/* Text: White, white/70, white/50 based on hierarchy */
```

## Design Token Usage

### DO ✅
- Use `text-brand-primary` for headings in light mode
- Use `text-white` for text in dark mode
- Use `bg-brand-light` for light page backgrounds
- Use `bg-brand-navy` for dark page backgrounds or hero sections
- Use `text-brand-accent` for CTAs and highlights
- Use Tailwind opacity modifiers: `text-brand-primary/70`, `bg-white/10`

### DON'T ❌
- Don't use hardcoded hex colors: `text-[#0369a1]`
- Don't use custom color values: `bg-[#1a2533]`
- Don't use `bg-[#4a7fa5]` (that's #0369a1, use brand-accent instead)
- Don't mix themed and non-themed colors in the same class
- Don't forget dark mode variant when adding light mode color

## Color Usage by Component

| Element | Light Mode | Dark Mode | Notes |
|---------|-----------|----------|-------|
| Page Background | `bg-brand-light` | `dark:bg-brand-navy` | Main page wrapper |
| Card Surface | `bg-white` | `dark:bg-brand-secondary` | Elevated surfaces |
| Section Background | `bg-brand-light` or `bg-brand-muted` | `dark:bg-brand-primary` or `dark:bg-brand-surface` | Alternating sections |
| Primary Heading | `text-brand-primary` | `dark:text-white` | h1, h2 |
| Secondary Text | `text-brand-secondary` | `dark:text-white/70` | Body, descriptions |
| Accent Text | `text-brand-accent` | `dark:text-brand-accent` | CTAs, links, emphasis |
| Border | `border-brand-dark` | `dark:border-white/10` | Subtle dividers |
| Border (Accent) | `border-brand-accent` | `dark:border-brand-accent` | Emphasized borders |
| CTA Button | `bg-brand-accent text-white` | `dark:bg-brand-accent dark:text-white` | Primary action |
| Secondary Button | `bg-white text-brand-primary` | `dark:bg-brand-secondary dark:text-white` | Alternative action |

## Correct Color Token Implementation Examples

### ✅ Correct
```tsx
<div className="bg-white dark:bg-brand-secondary text-brand-primary dark:text-white">
  <h2 className="text-brand-primary dark:text-white font-bold">Heading</h2>
  <p className="text-brand-secondary dark:text-white/70">Description text</p>
  <button className="bg-brand-accent text-white hover:bg-brand-accent/90">
    Call to Action
  </button>
</div>
```

### ❌ Incorrect
```tsx
<div className="bg-[#ffffff] dark:bg-[#1a2533] text-[#0d1117]">
  <h2 className="text-[#0369a1]">Heading</h2>
  <p className="text-[#4a7fa5]">Description text</p>
  <button className="bg-[#059669]">Call to Action</button>
</div>
```

## Typography

### Font Families
- **Display:** Cormorant Garamond (serif) — Headlines, premium feel
- **Body:** DM Sans (sans-serif) — Body text, modern, clean

### Font Weight Usage
- **Bold (700):** Display, h1, h2, strong emphasis
- **Semibold (600):** h3, h4, labels, strong body text
- **Normal (400):** Body text, paragraph content
- **Light (300):** Secondary text, muted descriptions, hero body copy

### Sizing Hierarchy
- h1: 68px (hero) / 48px-56px (section headers)
- h2: 48px (major sections)
- h3: 32px (subsections)
- h4: 20px-24px (card titles)
- Body: 16px
- Small: 14px (descriptions, meta text)
- Extra small: 12px-13px (labels, badges)

## Spacing

### Standard Padding Values
- Sections: `py-24` (96px vertical)
- Cards: `p-6` / `p-8` / `p-10` (depends on card size)
- Small components: `p-3` / `p-4`
- Inputs/Buttons: `px-4 py-2.5` / `px-6 py-3`

### Gap Values
- Component gaps: `gap-4` / `gap-6`
- Section columns: `gap-12` / `gap-16`
- Dense layouts: `gap-2` / `gap-3`

## Border Radius

- Buttons/Inputs: `rounded-lg` / `rounded-xl` / `rounded-sm`
- Cards: `rounded-2xl` / `rounded-3xl`
- Icons: `rounded-full`
- Large sections: `rounded-[3rem]` (can use arbitrary values)

## Component Guidelines

### Buttons
- Primary (CTA): `bg-brand-accent text-white hover:bg-brand-accent/90`
- Secondary: `bg-white dark:bg-brand-secondary border border-brand-dark dark:border-white/10`
- Disabled: `opacity-40 cursor-not-allowed`
- Always include `transition-all` or specific transitions

### Input Fields
- Light: `bg-brand-muted border-brand-dark focus:border-brand-accent`
- Dark: `dark:bg-brand-surface dark:border-white/10`
- Focus state: `focus:border-brand-accent focus:ring-brand-accent/20`

### Cards/Surfaces
- Light: `bg-white border border-brand-primary/5 shadow-sm`
- Dark: `dark:bg-brand-secondary dark:border-white/10`
- Hover: `hover:shadow-lg transition-shadow`

## Accessibility Guidelines

### Contrast Ratios (WCAG AA Compliance)
- **Body Text:** Minimum 4.5:1 contrast
  - ✅ `text-brand-primary` on `bg-brand-light` (6.5:1)
  - ❌ `text-brand-secondary` on `bg-brand-light` (2.5:1 — FAIL)
  - ✅ `text-white` on `bg-brand-navy` (9.5:1)

### Motion Preferences
All animated elements should respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Alone Never Conveys Meaning
- ✅ Use icons + color: `<CheckCircle className="text-brand-success" />`
- ❌ Don't use color only: `<div className="bg-brand-accent">Success</div>`

## Theme Implementation Details

### Dark Mode Activation
Dark mode is triggered when:
1. User manually selects dark theme (stored in `localStorage.novaa_theme`)
2. System preference is dark (checked on first load via `prefers-color-scheme`)
3. `dark` class is applied to `<html>` element

### Transitions
- Standard transition: 200ms ease
- Apply only to interactive and theme-aware elements
- Avoid transitions on animated elements (motion library handles this)

### Testing Dark Mode
```bash
# Toggle in DevTools Console:
document.documentElement.classList.toggle('dark')
localStorage.setItem('novaa_theme', 'dark')  # or 'light'
```

## Common Mistakes to Avoid

1. **Forgetting dark variant:** `text-brand-secondary` without `dark:text-white/70`
2. **Wrong contrast:** Using `text-brand-secondary` for body text on light backgrounds
3. **Hardcoded colors:** `text-[#374151]` instead of `text-brand-secondary`
4. **Inconsistent borders:** Using `border-brand-dark` sometimes, `border-white/10` other times
5. **Missing transitions:** Interactive elements that change color without `transition-colors`
6. **Using primary on primary:** `text-brand-primary` on `bg-brand-light` (works) but `text-brand-secondary` on `bg-brand-muted` (too faint)

## Future Enhancements

- [ ] Add semantic color tokens for feedback (error, warning, success)
- [ ] Create Tailwind plugin for extended color utilities
- [ ] Establish animation/motion design system
- [ ] Document responsive breakpoint strategy
- [ ] Create component pattern library/storybook

---

**Last Updated:** June 12, 2026  
**Maintained By:** Novaa Design System
