"use client";

import { useState } from "react";
import { PlusCircle, Calendar, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, Pagination } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { getErrorMessage } from "@/shared/lib/api-helpers";
import { ReviewCard } from "./ReviewCard";
import { AddReviewModal } from "./AddReviewModal";
import { useReviews, useUpdateReview, useDeleteReview } from "../hooks/useReviews";

const PAGE_SIZE = 10;

export function ReviewsContent() {
  const { t } = useTranslation();
  const reviewsT = t("reviews") as any;
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reviews = [], isLoading } = useReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const isEmpty = reviews.length === 0;

  const handleTogglePublish = (id: number) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;
    updateReview.mutate(
      { id, data: { isActive: !review.isActive } },
      {
        onSuccess: () =>
          toast({ type: "success", message: "تم تحديث حالة التقييم" }),
        onError: (err) =>
          toast({ type: "error", message: getErrorMessage(err) }),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteReview.mutate(id, {
      onSuccess: () =>
        toast({ type: "delete", message: "تم حذف التقييم" }),
      onError: (err) =>
        toast({ type: "error", message: getErrorMessage(err) }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Date range + Add button row */}
      <div className="mb-6 flex items-center justify-between">
        {/* Date range selector */}
        <button className="flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-4 py-2.5 text-sm text-text-dark">
          <Calendar className="h-4 w-4 text-grey-400" />
          <span>{reviewsT.dateRange}</span>
          <ChevronDown className="h-4 w-4 text-grey-400" />
        </button>

        {/* Add review button */}
        {!isEmpty && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full!"
          >
            <PlusCircle className="h-5 w-5" />
            {reviewsT.addReview}
          </Button>
        )}
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-6">
            <EmptyIllustration />
          </div>
          <h3 className="mb-6 text-xl font-medium text-text-dark">
            {reviewsT.empty.title}
          </h3>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full! px-16!"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" />
            {reviewsT.addReviewShort}
          </Button>
        </div>
      ) : (
        /* Reviews list */
        <div className="rounded-2xl border border-grey-200 bg-white">
          {paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/** Simple SVG illustration for the empty state */
function EmptyIllustration() {
  return (
    <svg
      width="240"
      height="200"
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blob */}
      <ellipse cx="120" cy="110" rx="100" ry="80" fill="#e3efef" />

      {/* Document card 1 */}
      <rect x="55" y="50" width="70" height="90" rx="8" fill="white" stroke="#d1d5db" strokeWidth="1" />
      <rect x="65" y="62" width="30" height="3" rx="1.5" fill="#d1d5db" />
      <rect x="65" y="70" width="45" height="3" rx="1.5" fill="#e5e7eb" />
      <rect x="65" y="78" width="40" height="3" rx="1.5" fill="#e5e7eb" />
      {/* Stars on card 1 */}
      <g transform="translate(65, 90)">
        <polygon points="5,0 6.5,3 10,3.5 7.5,6 8,9.5 5,8 2,9.5 2.5,6 0,3.5 3.5,3" fill="#fbbf24" />
        <polygon points="15,0 16.5,3 20,3.5 17.5,6 18,9.5 15,8 12,9.5 12.5,6 10,3.5 13.5,3" fill="#fbbf24" />
        <polygon points="25,0 26.5,3 30,3.5 27.5,6 28,9.5 25,8 22,9.5 22.5,6 20,3.5 23.5,3" fill="#fbbf24" />
        <polygon points="35,0 36.5,3 40,3.5 37.5,6 38,9.5 35,8 32,9.5 32.5,6 30,3.5 33.5,3" fill="#fbbf24" />
      </g>

      {/* Document card 2 */}
      <rect x="115" y="40" width="70" height="90" rx="8" fill="white" stroke="#d1d5db" strokeWidth="1" />
      <rect x="125" y="52" width="30" height="3" rx="1.5" fill="#d1d5db" />
      <rect x="125" y="60" width="45" height="3" rx="1.5" fill="#e5e7eb" />
      <rect x="125" y="68" width="40" height="3" rx="1.5" fill="#e5e7eb" />
      {/* Stars on card 2 */}
      <g transform="translate(125, 80)">
        <polygon points="5,0 6.5,3 10,3.5 7.5,6 8,9.5 5,8 2,9.5 2.5,6 10,3.5 13.5,3" fill="#fbbf24" />
        <polygon points="15,0 16.5,3 20,3.5 17.5,6 18,9.5 15,8 12,9.5 12.5,6 10,3.5 13.5,3" fill="#fbbf24" />
        <polygon points="25,0 26.5,3 30,3.5 27.5,6 28,9.5 25,8 22,9.5 22.5,6 20,3.5 23.5,3" fill="#fbbf24" />
        <polygon points="35,0 36.5,3 40,3.5 37.5,6 38,9.5 35,8 32,9.5 32.5,6 30,3.5 33.5,3" fill="#fbbf24" />
      </g>

      {/* Person silhouette */}
      <circle cx="100" cy="135" r="10" fill="#008387" opacity="0.3" />
      <rect x="90" y="148" width="20" height="20" rx="6" fill="#008387" opacity="0.2" />

      {/* Decorative leaves */}
      <ellipse cx="50" cy="155" rx="18" ry="8" transform="rotate(-30 50 155)" fill="#008387" opacity="0.4" />
      <ellipse cx="190" cy="155" rx="18" ry="8" transform="rotate(30 190 155)" fill="#008387" opacity="0.4" />
      <ellipse cx="40" cy="145" rx="15" ry="6" transform="rotate(-50 40 145)" fill="#008387" opacity="0.25" />
      <ellipse cx="200" cy="145" rx="15" ry="6" transform="rotate(50 200 145)" fill="#008387" opacity="0.25" />

      {/* Small decorative stars */}
      <polygon points="160,35 161,38 164,38 162,40 163,43 160,41 157,43 158,40 156,38 159,38" fill="#fbbf24" opacity="0.6" />
      <polygon points="80,35 81,38 84,38 82,40 83,43 80,41 77,43 78,40 76,38 79,38" fill="#fbbf24" opacity="0.6" />
      <circle cx="175" cy="60" r="2" fill="#008387" opacity="0.3" />
      <circle cx="65" cy="40" r="2" fill="#008387" opacity="0.3" />
    </svg>
  );
}
