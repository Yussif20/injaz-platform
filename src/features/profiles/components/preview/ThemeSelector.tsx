"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="fixed bottom-24 left-4 flex flex-col items-center gap-2 z-40 bg-white rounded-3xl p-4 shadow-lg">
        <div className="w-14 h-14 rounded-full flex items-center justify-center">
          <div className="relative w-8 h-8">
            <Image
              src="/images/profiles/controller.svg"
              alt="Templates"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Templates Label Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded-full text-white text-[12px] md:text-base font-light transition-transform hover:scale-105"
          style={{ backgroundColor: currentColor }}
        >
          القوالب
        </button>
      </div>

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
