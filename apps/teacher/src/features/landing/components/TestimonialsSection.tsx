"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/shared/lib/api";
import {
  PUBLIC_STORAGE_BASE_URL,
  PUBLIC_API_BASE_URL,
} from "@/shared/lib/api";

interface ReviewDto {
  id: number;
  content: string | null;
  rating: number;
  reviewerName: string | null;
  reviewerJobTitle: string | null;
  reviewerPhotoPath: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

function normalizePhotoUrl(path: string | null): string {
  if (!path) return "/logo/logo-cyan.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("uploads/")) return `${PUBLIC_STORAGE_BASE_URL}/${path}`;
  return `${PUBLIC_API_BASE_URL}/${path}`;
}

function mapReviewToTestimonial(review: ReviewDto): TestimonialItem {
  return {
    id: review.id,
    name: review.reviewerName ?? "",
    role: review.reviewerJobTitle ?? "",
    text: review.content ?? "",
    rating: review.rating,
    avatar: normalizePhotoUrl(review.reviewerPhotoPath),
  };
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Image
          key={star}
          src="/images/landing/testimonials/star.svg"
          alt="star"
          width={20}
          height={20}
          className={star <= rating ? "opacity-100" : "opacity-30"}
        />
      ))}
    </div>
  );
};

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const AUTO_PLAY_MS = 3000;

export const TestimonialsSection: React.FC = () => {
  const { data: apiData } = useQuery({
    queryKey: ["activeReviews"],
    queryFn: async () => {
      const response = await clientApi.get<{ data: ReviewDto[] }>("/api/reviews");
      return response.data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const testimonials: TestimonialItem[] = (apiData ?? []).map(mapReviewToTestimonial);

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = testimonials.length;

  // Calculate visible cards
  const [visibleCards, setVisibleCards] = useState(3);
  useEffect(() => {
    function updateVisible() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const cards = Math.max(1, Math.floor((w + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
        setVisibleCards(cards);
      }
    }
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, totalSlides - visibleCards);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || totalSlides === 0) return;
      setIsTransitioning(true);
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [isTransitioning, totalSlides, maxIndex],
  );

  const goNext = useCallback(() => {
    if (totalSlides === 0) return;
    goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  }, [currentIndex, maxIndex, totalSlides, goTo]);

  const goPrev = useCallback(() => {
    if (totalSlides === 0) return;
    goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  }, [currentIndex, maxIndex, totalSlides, goTo]);

  // Auto-play
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(goNext, AUTO_PLAY_MS);
  }, [goNext]);

  useEffect(() => {
    if (totalSlides <= visibleCards) return;
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalSlides, visibleCards, resetAutoPlay]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  // Drag/swipe support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (totalSlides <= visibleCards) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
    resetAutoPlay();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    // RTL: invert drag direction
    setDragOffset(e.clientX - startX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = CARD_WIDTH / 3;
    // RTL: positive drag = go next, negative = go prev
    if (dragOffset > threshold) {
      goNext();
    } else if (dragOffset < -threshold) {
      goPrev();
    }
    setDragOffset(0);
  };

  const translateX = currentIndex * (CARD_WIDTH + CARD_GAP) - dragOffset;

  if (totalSlides === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[90%] mx-auto">
        {/* Slider */}
        <div
          ref={containerRef}
          className="relative overflow-hidden py-4 select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex gap-6"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? "none" : "transform 500ms ease-in-out",
              direction: "rtl",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-primary-500 shadow-md rounded-2xl shrink-0 overflow-hidden flex flex-col"
                style={{ width: CARD_WIDTH }}
              >
                {/* Card Content - White Background */}
                <div className="bg-white p-4 sm:p-6 flex-1 rounded-br-4xl">
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-xs md:text-base lg:text-lg font-light text-[#666] text-center leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>

                {/* User Info Footer */}
                <div className="relative px-4 py-3">
                  <div className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/30 ${
                        !testimonial.avatar ? "bg-white" : ""
                      }`}
                    >
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-white font-semibold text-sm md:text-base lg:text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-white/80 text-xs md:text-sm font-light">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        {totalSlides > visibleCards && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  goTo(i);
                  resetAutoPlay();
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-primary-500"
                    : "w-2.5 bg-grey-300 hover:bg-grey-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
