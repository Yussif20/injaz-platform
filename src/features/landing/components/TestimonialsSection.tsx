"use client";

import React from "react";
import Image from "next/image";
import { landingContent } from "@/content";

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1 justify-end">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-[#FFD700]" : "text-grey-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const { testimonialsSection } = landingContent;

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [
    ...testimonialsSection.testimonials,
    ...testimonialsSection.testimonials,
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Animated slider track */}
      <div
        className="flex gap-4 sm:gap-6 cursor-grab animate-scroll hover:[animation-play-state:paused]"
        style={{ width: "max-content" }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="bg-shade-100 rounded-2xl p-4 sm:p-6 w-70 sm:w-[320px] shrink-0"
          >
            {/* Star Rating */}
            <div className="mb-4">
              <StarRating rating={testimonial.rating} />
            </div>

            {/* Testimonial Text */}
            <p className="text-sm sm:text-base text-[#333] text-right mb-6 leading-relaxed">
              {testimonial.text}
            </p>

            {/* User Info */}
            <div className="flex items-center justify-start gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-grey-200 shrink-0">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <p className="text-primary-500 font-medium text-sm sm:text-base">
                  {testimonial.name}
                </p>
                <p className="text-grey-500 text-xs sm:text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </section>
  );
};
