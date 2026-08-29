"use client";

import Image from "next/image";
import { PUBLIC_API_BASE_URL, PUBLIC_STORAGE_BASE_URL } from "@/shared/lib/api";

interface ProfileImageProps {
  /** Profile image URL from API (e.g. data.imageUrl). Can be relative path (e.g. uploads/...) or absolute URL. */
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Fallback image when src is missing or invalid (e.g. default avatar) */
  fallbackSrc?: string;
}

/**
 * Normalize image src: next/image requires "/" or "http(s):" or "data:". Backend may return
 * relative path (e.g. "uploads/users/..."), absolute URL, or data URL (base64). Do not prepend
 * base URL to data URLs.
 * Upload paths (uploads/...) use PUBLIC_STORAGE_BASE_URL (e.g. Backblaze S3); other relative
 * paths use PUBLIC_API_BASE_URL.
 */
export function normalizeImageSrc(raw: string): string {
  const s = raw.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  if (s.startsWith("data:")) return s; // data URL (e.g. base64) — use as-is
  // Backend-relative path → absolute URL. Use storage URL for upload paths (e.g. S3/Backblaze).
  const path = s.replace(/^\//, "");
  const base = path.startsWith("uploads/")
    ? PUBLIC_STORAGE_BASE_URL.replace(/\/$/, "")
    : PUBLIC_API_BASE_URL.replace(/\/$/, "");
  return `${base}/${path}`;
}

/**
 * Renders a profile image from API response. Handles relative paths (backend), external URLs, and invalid src.
 */
export function ProfileImage({
  src,
  alt,
  width = 70,
  height = 70,
  className = "w-full h-full object-cover",
  fallbackSrc = "/logo/logo-cyan.svg",
}: ProfileImageProps) {
  const rawSrc = src && typeof src === "string" && src.trim() ? src.trim() : null;
  const effectiveSrc = rawSrc ? normalizeImageSrc(rawSrc) : fallbackSrc;
  // Use unoptimized for external URLs and data URLs (next/image may not optimize data: URLs)
  const isExternal =
    effectiveSrc.startsWith("http://") ||
    effectiveSrc.startsWith("https://") ||
    effectiveSrc.startsWith("data:");

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={isExternal}
    />
  );
}
