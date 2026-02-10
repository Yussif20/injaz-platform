"use client";

import { Star, Check, Trash2, User } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import type { Review } from "../data/reviews.mock";

interface ReviewCardProps {
  review: Review;
  onTogglePublish: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ReviewCard({
  review,
  onTogglePublish,
  onDelete,
}: ReviewCardProps) {
  const { t } = useTranslation();
  const reviewsT = t("reviews") as any;

  return (
    <div className="border-b border-grey-200 px-6 py-5 last:border-b-0">
      {/* Header: user info + rating */}
      <div className="flex items-start justify-between">
        {/* User info (right side in RTL) */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-grey-100">
            {review.avatar ? (
              <img
                src={review.avatar}
                alt={review.clientName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-grey-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-dark">
              {review.clientName}
            </h4>
            <p className="text-xs text-grey-400">{review.jobTitle}</p>
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
            {reviewsT.daysAgo} {review.daysAgo} {reviewsT.days}
          </p>
        </div>
      </div>

      {/* Review content */}
      <p className="mt-4 text-sm leading-relaxed text-text-dark">
        {review.content}
      </p>

      {/* Actions: publish/unpublish + delete */}
      <div className="mt-4 flex items-center justify-between">
        {/* Delete button (left in RTL) */}
        <button
          onClick={() => onDelete(review.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-warning-50 text-warning-500 hover:bg-warning-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Publish / Unpublish buttons (right in RTL) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => !review.isPublished && onTogglePublish(review.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm transition-colors ${
              !review.isPublished
                ? "border-primary-500 text-primary-500"
                : "border-grey-200 text-grey-400 hover:border-grey-300"
            }`}
          >
            {!review.isPublished && <Check className="h-4 w-4" />}
            {reviewsT.unpublish}
          </button>
          <button
            onClick={() => review.isPublished || onTogglePublish(review.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm transition-colors ${
              review.isPublished
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-primary-500 bg-primary-500 text-white opacity-80 hover:opacity-100"
            }`}
          >
            {review.isPublished && <Check className="h-4 w-4" />}
            {reviewsT.publish}
          </button>
        </div>
      </div>
    </div>
  );
}
