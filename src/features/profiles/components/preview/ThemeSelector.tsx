"use client";

import { useState } from "react";
import { PORTFOLIO_THEMES, type ThemeName } from "../../types/theme.types";

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
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

export const ThemeSelector = ({
  currentTheme,
  onThemeChange,
  content,
}: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes: { name: ThemeName; label: string; color: string }[] = [
    { name: "default", label: content.themes.default, color: PORTFOLIO_THEMES.default.circleColor },
    { name: "dark", label: content.themes.dark, color: PORTFOLIO_THEMES.dark.circleColor },
    { name: "heritage", label: content.themes.heritage, color: PORTFOLIO_THEMES.heritage.circleColor },
    { name: "arabic", label: content.themes.arabic, color: PORTFOLIO_THEMES.arabic.circleColor },
  ];

  const handleThemeSelect = (themeName: ThemeName) => {
    onThemeChange(themeName);
  };

  return (
    <>
      {/* Floating Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
        style={{
          backgroundColor: PORTFOLIO_THEMES[currentTheme].colors.primary,
        }}
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

            {/* Theme Options */}
            <div className="flex justify-center gap-4 mb-6">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeSelect(theme.name)}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Theme Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${
                      currentTheme === theme.name ? "ring-2 ring-offset-2" : ""
                    }`}
                    style={{
                      backgroundColor: theme.color,
                      ringColor: theme.color,
                    }}
                  >
                    {currentTheme === theme.name && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  {/* Theme Label */}
                  <span
                    className={`text-sm ${
                      currentTheme === theme.name
                        ? "font-semibold text-grey-900"
                        : "text-grey-600"
                    }`}
                  >
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Customize Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-full text-white font-medium transition-colors"
              style={{
                backgroundColor: PORTFOLIO_THEMES[currentTheme].colors.primary,
              }}
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
