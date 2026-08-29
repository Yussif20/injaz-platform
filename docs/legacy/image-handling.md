# Image Handling Guide

All images in the Injaz platform are stored in **Backblaze B2** (S3-compatible).
This document is the single reference for how to upload, display, and normalize images across both apps.

---

## 1. How the Backend Returns Image URLs

The backend **never returns a full URL**. It returns a relative path:

```
uploads/users/15/94e0afe6-54a0-4dea-9dbe-33495d8bd418.jpg
```

To render this, you must prepend the storage base URL:

```
https://enjazmo3alem-staging.s3.us-east-005.backblazeb2.com/uploads/users/15/94e0afe6...jpg
```

This is controlled by environment variables (see Section 2).

---

## 2. Environment Variables

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_STORAGE_URL` | Client & Server | Backblaze base URL for uploaded files |
| `NEXT_PUBLIC_API_URL` | Client | API base URL (fallback for non-upload paths) |
| `BACKEND_API_URL` | Server (API routes only) | Backend URL used in Next.js route handlers |

Both apps export these constants from `src/shared/lib/api.ts`:

```typescript
import { PUBLIC_STORAGE_BASE_URL, PUBLIC_API_BASE_URL } from "@/shared/lib/api";
```

Default values (staging):
- `PUBLIC_STORAGE_BASE_URL` → `https://enjazmo3alem-staging.s3.us-east-005.backblazeb2.com`
- `PUBLIC_API_BASE_URL` → `https://staging.enjazfile.com`

---

## 3. Normalizing Image URLs

Use this function whenever you receive a raw image path from the API:

```typescript
import { PUBLIC_API_BASE_URL, PUBLIC_STORAGE_BASE_URL } from "@/shared/lib/api";

function normalizeImageUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  // Already absolute or root-relative — use as-is
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  // Backend relative path → prepend correct base
  const path = s.replace(/^\//, "");
  const base = path.startsWith("uploads/")
    ? PUBLIC_STORAGE_BASE_URL.replace(/\/$/, "")  // Backblaze for uploaded files
    : PUBLIC_API_BASE_URL.replace(/\/$/, "");      // API for anything else
  return `${base}/${path}`;
}
```

**Rule of thumb:**
- `uploads/...` → prepend `PUBLIC_STORAGE_BASE_URL`
- anything else relative → prepend `PUBLIC_API_BASE_URL`
- already `https://` / `data:` / `/` → pass through unchanged

---

## 4. Displaying Images

### Use `ProfileImage` component (teacher app)

Located at `src/shared/components/ui/ProfileImage.tsx`. Use it for:
- User avatar (account page, navbar)
- Any profile-related image from the API

```tsx
import { ProfileImage } from "@/shared/components/ui";

<ProfileImage
  src={profile.imageUrl}        // raw path from API — normalization is handled internally
  alt="صورة الملف الشخصي"
  width={70}
  height={70}
  fallbackSrc="/logo/logo-cyan.svg"   // shown when src is null/empty/invalid
/>
```

`ProfileImage` internally calls `normalizeImageUrl` and sets `unoptimized={true}` for external URLs so Next.js doesn't try to optimize the Backblaze URL (which would require adding the domain to `remotePatterns`).

---

### Use a plain `<img>` for previews inside upload widgets

When showing a **live preview** of an image the user just picked (from `FileReader`) **or** an existing image loaded from the API inside an upload widget (e.g. the file creation form), use a plain `<img>` tag:

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img
  src={imagePreview}   // data: URL from FileReader OR normalized https:// URL from API
  alt="صورة الملف"
  className="absolute inset-0 w-full h-full object-contain"
/>
```

**Why not `<Image>` here:**
`<Image fill>` from `next/image` cannot handle `data:` URLs or external Backblaze URLs without domain whitelisting. For upload-widget previews it provides no benefit — use `<img>`.

---

### Use Next.js `<Image>` only for static/local assets

```tsx
import Image from "next/image";

<Image src="/images/dashboard/create-file/create-file.svg" alt="..." width={400} height={685} />
```

Only for images in the `public/` folder. Do **not** use it for any URL returned by the API.

---

## 5. Uploading Images

### Critical rule: never set `Content-Type` manually on FormData

Axios automatically sets `Content-Type: multipart/form-data; boundary=...` when it detects a `FormData` body. If you override it manually:

```typescript
// ❌ WRONG — breaks multipart parsing, silently fails
const response = await clientApi.post(url, formData, {
  headers: { "Content-Type": "multipart/form-data" },  // no boundary!
});

// ✅ CORRECT — let Axios set the full header including boundary
const response = await clientApi.post(url, formData);
```

Same rule applies to `serverApi` calls inside Next.js API route handlers.

---

### The two-step proxy flow

The teacher app **never calls the backend directly from the browser**. All uploads go:

```
Browser
  → clientApi.post("/api/profiles/{id}/image", formData)
      → Next.js API route (src/app/api/profiles/[id]/image/route.ts)
          → serverApi.post("https://staging.enjazfile.com/api/my-profiles/{id}/image", formData)
              → Backend (saves to Backblaze, returns relative path)
```

Each step must pass FormData without a manual Content-Type override.

---

## 6. Image Endpoints

### Teacher App (`injaz-almoalem`)

| What | Client calls | Next.js route | Backend endpoint |
|---|---|---|---|
| User avatar | `POST /api/me/image` | `src/app/api/me/image/route.ts` | `POST /api/Me/image` |
| Profile cover image | `POST /api/profiles/{id}/image` | `src/app/api/profiles/[id]/image/route.ts` | `POST /api/my-profiles/{id}/image` |
| Subsection evidence image | `POST /api/images/upload?profileId=&subsectionId=` | `src/app/api/images/upload/route.ts` | `POST /api/Images/upload` |
| Update subsection image | `PUT /api/images/{id}` | `src/app/api/images/[id]/route.ts` | `PUT /api/Images/{id}` |
| Delete image | `DELETE /api/images/{id}` | `src/app/api/images/[id]/route.ts` | `DELETE /api/Images/{id}` |
| Reorder images | `PUT /api/images/reorder/{subsectionId}` | `src/app/api/images/reorder/[subsectionId]/route.ts` | `PUT /api/Images/reorder/{subsectionId}` |

### Admin Dashboard (`injaz-dashboard`)

The dashboard uses `proxyApi` which forwards directly to the backend via `/api/proxy/*`. No separate route files needed.

---

## 7. Hooks Reference (Teacher App)

| Hook | File | Usage |
|---|---|---|
| `useUploadProfileImage()` (dashboard) | `features/dashboard/hooks/useUploadProfileImage.ts` | Upload user avatar (`/api/Me/image`) |
| `useUploadProfileImage()` (profiles) | `features/profiles/hooks/useUploadProfileImage.ts` | Upload profile cover image |
| `useUploadSubsectionImage()` | `features/profiles/hooks/useUploadSubsectionImage.ts` | Upload evidence image to a subsection |
| `useUpdateImage()` | `features/profiles/hooks/useUpdateImage.ts` | Edit image description / replace file |
| `useDeleteImage()` | `features/profiles/hooks/useDeleteImage.ts` | Delete a subsection image |
| `useReorderImages()` | `features/profiles/hooks/useReorderImages.ts` | Reorder subsection images |
| `useProfileImages()` | `features/profiles/hooks/useProfileImages.ts` | Fetch all images for a profile |

---

## 8. Edit Mode: Showing the Existing Image

When navigating to an edit form, pass the raw `imageUrl` from the profile object in the URL params:

```typescript
const params = new URLSearchParams({
  edit: "true",
  fileId: String(profile.id),
  imageUrl: profile.imageUrl || "",   // ← include this
  // ...other params
});
router.push(`${ROUTES.DASHBOARD_PROFILE_NEW}?${params.toString()}`);
```

In the edit form, read and normalize it:

```typescript
useEffect(() => {
  if (!isEditMode) return;
  const imageUrlParam = searchParams.get("imageUrl");
  if (imageUrlParam) {
    setImagePreview(normalizeImageUrl(imageUrlParam));  // convert relative → full URL
  }
}, [isEditMode, searchParams]);
```

The `imagePreview` state then holds either:
- A normalized `https://...` URL (existing image from Backblaze, edit mode)
- A `data:base64...` URL (newly selected file via `FileReader`)

Both are safe to use as `<img src={imagePreview}>`.

---

## 9. Known Issues / Gotchas

- **`images.service.ts`** still has explicit `"Content-Type": "multipart/form-data"` headers on `uploadImage` and `updateImage` — these should be removed (same as profile image fix applied in Feb 2026).
- **`next.config.ts` `remotePatterns`** only lists `staging.enjazfile.com`, not the Backblaze domain. Backblaze images must use `unoptimized={true}` or a plain `<img>` — never a plain `<Image>` without `unoptimized`.
- The backend returns `useDefaultImage: boolean` on the Profile object. When `true`, the profile uses a system default image and `imageUrl` may be null — always guard with `profile.imageUrl || null` before normalizing.
