# Code Writing Guidelines for Agents

## Tailwind & Styling Rules

### ❌ DON'T use inline styles

```tsx
// Bad - inline style
<div style={{ borderRightColor: "#602726" }}>
```

### ✅ DO use Tailwind classes

```tsx
// Good - Tailwind class
<div className="border-r-2 border-[#602726]">
```

Additional Tailwind syntax reminders:

- Prefer shorthand arbitrary values where available (e.g., use `bg-[center]` instead of `bg-[position:center]`, and `bg-repeat-space` instead of `bg-[repeat:space]`).
- For background sizing, use breakpoint-specific utilities like `lg:bg-size-[auto_65px]` instead of `bg-[length:auto_65px]`.
- Prefer breakpoint utilities over arbitrary pixel heights when possible (e.g., `md:h-14.5` instead of `md:h-[58px]`).

**Exception**: Only use `style={}` for:

- Dynamic values from theme/props (colors, sizes from variables)
- Values that cannot be expressed in Tailwind

Example of acceptable inline styles:

```tsx
<div style={{ backgroundColor: theme.background, color: theme.text }}>
```

---

## Component Structure

- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use proper TypeScript interfaces for props
- Document component props with comments

---

## File Organization

- Place related components in feature folders
- Export components from index.ts files
- Keep type definitions separate in types/ folder

---

## Responsive Design

- Use Tailwind breakpoints consistently: `sm:`, `md:`, `lg:`
- Test on mobile, tablet, and desktop views
- Use responsive images with Next.js `Image` component and `sizes` prop

---

## Icon & Image Usage

- Use Next.js `Image` component for optimization
- Store SVG icons in `/public/icons/` directory
- Store images in `/public/images/` directory
- Always include `alt` text for accessibility
