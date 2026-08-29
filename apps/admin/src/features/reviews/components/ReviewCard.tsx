"use client";

import { useState } from "react";
import { Star, Check, Trash2, User } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import type { ReviewDto } from "../types/reviews.types";

const STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ||
  "https://enjazmo3alem-staging.s3.us-east-005.backblazeb2.com";

const API_BASE_URL = "https://staging.enjazfile.com";

function normalizePhotoUrl(path: string | null | undefined): string | null {
  if (!path || path.trim() === "") return null;
  // Already a full URL — use as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Strip any accidental leading slash before checking prefix
  const clean = path.startsWith("/") ? path.slice(1) : path;
  if (clean.startsWith("uploads/")) return `${STORAGE_BASE_URL}/${clean}`;
  return `${API_BASE_URL}/${clean}`;
}

/**
 * Resolves the best available photo URL from a ReviewDto.
 * Tries publicUrl first (backend-constructed full URL),
 * then falls back to normalizing reviewerPhotoPath.
 */
function resolveAvatarUrl(
  publicUrl: string | null,
  photoPath: string | null,
): string | null {
  return normalizePhotoUrl(publicUrl) ?? normalizePhotoUrl(photoPath);
}

interface ReviewCardProps {
  review: ReviewDto;
  onTogglePublish: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ReviewCard({
  review,
  onTogglePublish,
  onDelete,
}: ReviewCardProps) {
  const { t } = useTranslation();
  const reviewsT = t("reviews");

  const avatarUrl = resolveAvatarUrl(review.publicUrl, review.reviewerPhotoPath);

  // "N days ago" is measured from a clock read once, when the card mounts. Calling
  // Date.now() while rendering makes the output depend on when React happens to render,
  // so the same card could disagree with itself between two passes; pinning it keeps
  // render a pure function of props and state. Day granularity means the frozen reading
  // stays correct far longer than anyone leaves this page open.
  const [now] = useState(() => Date.now());
  const daysAgo = Math.floor(
    (now - new Date(review.createdAt).getTime()) / 86400000,
  );

  return (
    <div className="border-b border-grey-200 px-6 py-5 last:border-b-0">
      {/* Header: user info + rating */}
      <div className="flex items-start justify-between">
        {/* User info (right side in RTL) */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-grey-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={review.reviewerName ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/logos/logo-cyan.svg"
                alt="Logo"
                className="h-7 w-7 object-contain"
              />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-dark">
              {review.reviewerName ?? ""}
            </h4>
            <p className="text-xs text-grey-400">{review.reviewerJobTitle ?? ""}</p>
          </div>
        </div>

        {/* Rating + time (left side in RTL) */}
        <div className="text-start">
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-grey-200 text-grey-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-text-dark">
              {review.rating}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-grey-400">
            {reviewsT.daysAgo} {daysAgo} {reviewsT.days}
          </p>
        </div>
      </div>

      {/* Review content */}
      <p className="mt-4 text-sm leading-relaxed text-text-dark">
        {review.content ?? ""}
      </p>

      {/* Actions: publish/unpublish + delete */}
      <div className="mt-4 flex items-center justify-between">
        {/* Publish / Unpublish buttons (right in RTL) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => !review.isActive && onTogglePublish(review.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm transition-colors ${
              review.isActive
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-primary-500 bg-primary-500 text-white opacity-80 hover:opacity-100"
            }`}
          >
            {review.isActive && <Check className="h-4 w-4" />}
            {reviewsT.publish}
          </button>
          <button
            onClick={() => review.isActive && onTogglePublish(review.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm transition-colors ${
              !review.isActive
                ? "border-primary-500 text-primary-500"
                : "border-grey-200 text-grey-400 hover:border-grey-300"
            }`}
          >
            {!review.isActive && <Check className="h-4 w-4" />}
            {reviewsT.unpublish}
          </button>
        </div>

        {/* Delete button (left in RTL) */}
        <button
          onClick={() => onDelete(review.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-warning-50 text-warning-500 hover:bg-warning-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
