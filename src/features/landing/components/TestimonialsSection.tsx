"use client";

import React, { useState, useEffect } from "react";
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

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: apiData } = useQuery({
    queryKey: ["activeReviews"],
    queryFn: async () => {
      const response = await clientApi.get<{ data: ReviewDto[] }>("/api/reviews");
      return response.data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const testimonials: TestimonialItem[] = (apiData ?? []).map(mapReviewToTestimonial);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[90%] mx-auto">
        <div className="relative overflow-hidden py-4">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(${currentIndex} * (280px + 1rem)))`,
              direction: "rtl",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-primary-500 shadow-md rounded-2xl w-70 shrink-0 overflow-hidden flex flex-col"
              >
                {/* Card Content - White Background */}
                <div className="bg-white p-4 sm:p-6 flex-1 rounded-br-4xl">
                  {/* Star Rating - Centered */}
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Testimonial Text - Centered */}
                  <p className="text-xs md:text-base lg:text-lg font-light text-[#666] text-center leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>

                {/* User Info Footer - Teal Background with Notch */}
                <div className="relative px-4 py-3">
                  {/* Footer content */}
                  <div className="flex items-center gap-3 relative z-10">
                    {/* Avatar on the right */}
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
                    {/* Name and role next to avatar */}
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
      </div>
    </section>
  );
};
