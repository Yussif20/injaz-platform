"use client";

import React, { useState } from "react";
import { landingContent } from "@/content";
import { Button, Input, Select } from "@/shared/components/ui";

const StarRatingInput: React.FC<{
  value: number;
  onChange: (rating: number) => void;
}> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-1 transition-transform hover:scale-110"
        >
          <svg
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
              star <= (hovered || value)
                ? "text-[#FFD700]"
                : "text-grey-300"
            }`}
            fill={star <= (hovered || value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export const ShareExperienceSection: React.FC = () => {
  const { shareExperienceSection } = landingContent;
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual submission
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 lg:px-0">
      <div className="max-w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Right side - Title and Star Rating */}
          <div className="lg:w-1/2 text-right">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#333] mb-3">
              {shareExperienceSection.title}
            </h2>
            <p className="text-base sm:text-lg text-grey-500 mb-6">
              {shareExperienceSection.subtitle}
            </p>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          {/* Left side - Form */}
          <div className="lg:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={shareExperienceSection.nameLabel}
                placeholder={shareExperienceSection.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Select
                label={shareExperienceSection.jobTitleLabel}
                placeholder={shareExperienceSection.jobTitlePlaceholder}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                options={shareExperienceSection.jobTitles}
              />

              <div>
                <label className="block text-sm font-normal text-[#333] text-right mb-2">
                  {shareExperienceSection.experienceLabel}
                </label>
                <textarea
                  placeholder={shareExperienceSection.experiencePlaceholder}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={4}
                  className="w-full bg-[#EBEBEB] text-text-dark placeholder:text-[#B3B3B3] text-sm text-right px-4 py-3 border-2 border-transparent rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-xl h-12"
              >
                {shareExperienceSection.submitButton}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
