"use client";

import { useState } from "react";
import { TemplateId } from "../../types/template.types";

interface TemplateSelectorProps {
  currentTemplate: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
  content: {
    title: string;
    themes: {
      default: string;
      dark: string;
      heritage: string;
      arabic: string;
    };
    customizeButton: string;
  };
}

// Template configuration with colors
const TEMPLATE_CONFIG: {
  id: TemplateId;
  key: "default" | "dark" | "heritage" | "arabic";
  color: string;
}[] = [
  { id: TemplateId.Default, key: "default", color: "#008387" },
  { id: TemplateId.Dark, key: "dark", color: "#12263a" },
  { id: TemplateId.Heritage, key: "heritage", color: "#6b2a3d" },
  { id: TemplateId.Arabic, key: "arabic", color: "#5c4033" },
];

export const ThemeSelector = ({
  currentTemplate,
  onTemplateChange,
  content,
}: TemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateSelect = (templateId: TemplateId) => {
    onTemplateChange(templateId);
  };

  // Get current template color for the floating button
  const currentColor =
    TEMPLATE_CONFIG.find((t) => t.id === currentTemplate)?.color || "#008387";

  return (
    <>
      {/* Floating Template Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
        style={{ backgroundColor: currentColor }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-grey-300 rounded-full mx-auto mb-6" />

            {/* Title */}
            <h3 className="text-center text-lg font-semibold text-grey-900 mb-6">
              {content.title}
            </h3>

            {/* Template Options */}
            <div className="flex justify-center gap-3 mb-6">
              {TEMPLATE_CONFIG.map((template) => {
                const isSelected = currentTemplate === template.id;
                const label = content.themes[template.key];

                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="relative"
                  >
                    {/* Template Circle with name inside */}
                    <div
                      className={`w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "ring-2 ring-offset-2 scale-105"
                          : "hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: template.color,
                        ["--tw-ring-color" as string]: template.color,
                      }}
                    >
                      {/* Template Name - White text inside circle */}
                      <span className="text-white text-xs md:text-sm font-medium text-center px-1 leading-tight">
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-full text-white font-medium transition-colors"
              style={{ backgroundColor: currentColor }}
            >
              {content.customizeButton}
            </button>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
