# Agent Coding Guidelines

This document outlines coding practices and conventions that should be followed when working on the Injaz Almoalem project.

## React & Next.js Best Practices

### Image Components

- ✅ **DO**: Always use `<Image />` from `next/image`
- ❌ **DON'T**: Use `<img />` tags

```tsx
// ✅ Correct
import Image from "next/image";
<Image src="/icon.svg" alt="icon" width={24} height={24} />

// ❌ Incorrect
<img src="/icon.svg" alt="icon" className="w-6 h-6" />
```

## Styling Practices

### Tailwind CSS Usage

- ✅ **DO**: Use Tailwind utility classes exclusively
- ❌ **DON'T**: Use inline `style={{}}` attributes

```tsx
// ✅ Correct
<span className="text-[#008387] font-light text-lg">Text</span>

// ❌ Incorrect
<span style={{ color: '#008387', fontWeight: 300, fontSize: '18px' }}>Text</span>
```

### Tailwind Shorthand Classes

- ✅ **DO**: Use Tailwind shorthand classes when available
- ❌ **DON'T**: Use verbose CSS property names

```tsx
// ✅ Correct
<div className="shrink-0">

// ❌ Incorrect
<div className="flex-shrink-0">
```

### Standard vs Custom Values

- ✅ **DO**: Use standard Tailwind classes when they match your needs
- ❌ **DON'T**: Use arbitrary values when a standard class exists

```tsx
// ✅ Correct
<div className="w-6 h-6">  // w-6 = 24px

// ❌ Incorrect
<div className="w-[24px] h-[24px]">
```

**Common Tailwind Size Mappings:**

- `w-4` = 16px (1rem)
- `w-5` = 20px (1.25rem)
- `w-6` = 24px (1.5rem)
- `w-8` = 32px (2rem)
- `w-10` = 40px (2.5rem)
- `w-12` = 48px (3rem)

---

## Notes

This document is continuously updated based on code review feedback and project-specific conventions.
