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
- Use shorthand flex utilities: `flex-1`, `flex-2`, `flex-60` instead of `flex-[1]`, `flex-[2]`, `flex-[60]`.
- Use shorthand height utilities: `h-50`, `md:h-125` instead of `h-[200px]`, `md:h-[500px]` (numeric values represent multiples of 4px in Tailwind).
- For gradients, use Tailwind arbitrary values with `bg-[linear-gradient(...)]` instead of inline styles. Use underscores for spaces in gradient values (e.g., `bg-[linear-gradient(90deg,#1940A6_-22.92%,#478AE2_59.95%,#FFFFFF_119.01%)]`).

**Exception**: Only use `style={}` for:

- Dynamic values from theme/props (colors, sizes from variables)
- Values that cannot be expressed in Tailwind

Example of acceptable inline styles:

```tsx
<div style={{ backgroundColor: theme.background, color: theme.text }}>
```

### ❌ DON'T duplicate className attributes

```tsx
// Bad - duplicate className (invalid JSX)
<div
  className="w-px shrink-0"
  style={{ borderLeftWidth: "1px" }}
  className="md:border-l-2"
>
```

### ✅ DO combine all classes in one className

```tsx
// Good - single className with all utilities
<div className="shrink-0 border-l border-[#88A3EC] md:border-l-2" />
```

**Remember**: Each JSX element can only have ONE `className` attribute. Combine all classes together and prefer Tailwind utilities over inline styles.

### ❌ DON'T use arbitrary font-weight values

```tsx
// Bad - arbitrary font weight
<p className="font-[300]">
<p className="font-[600]">
```

### ✅ DO use Tailwind's predefined font-weight utilities

```tsx
// Good - predefined utilities
<p className="font-light">    // 300
<p className="font-normal">   // 400
<p className="font-medium">   // 500
<p className="font-semibold"> // 600
<p className="font-bold">     // 700
```

**Font weight utilities:**

- `font-thin` = 100
- `font-extralight` = 200
- `font-light` = 300
- `font-normal` = 400
- `font-medium` = 500
- `font-semibold` = 600
- `font-bold` = 700
- `font-extrabold` = 800
- `font-black` = 900

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
