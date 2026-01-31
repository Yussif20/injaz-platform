"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { landingContent } from "@/content";

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1 justify-start">
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
  const { testimonialsSection } = landingContent;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create duplicated array for infinite loop effect
  const duplicatedTestimonials = [
    ...testimonialsSection.testimonials,
    ...testimonialsSection.testimonials,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // When we reach the end of duplicated array, reset to start
        if (nextIndex >= testimonialsSection.testimonials.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [testimonialsSection.testimonials.length]);

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
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-white shadow-md rounded-2xl p-4 sm:p-6 w-70 shrink-0"
              >
                {/* Star Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Testimonial Text */}
                <p className="text-xs md:text-base lg:text-lg font-light text-[#666] text-right mb-6 leading-relaxed">
                  {testimonial.text}
                </p>

                {/* User Info */}
                <div className="flex items-center justify-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={testimonial.avatar || "/logo/logo-cyan.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-primary-500 font-medium text-[10px] md:text-sm lg:text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-grey-500 text-[10px] md:text-sm lg:text-lg font-light">
                      {testimonial.role}
                    </p>
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
