"use client";

import { useState, useRef, useEffect } from "react";

interface QualificationCardProps {
  degree: string;
  institution: string;
  year: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function QualificationCard({
  degree,
  institution,
  year,
  onEdit,
  onDelete,
}: QualificationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-shade-100 rounded-xl p-4 border-r-4 border-primary-500 relative">
      <div className="flex items-start justify-between">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="text-grey-500 hover:text-grey-700 p-1"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-grey-200 py-1 min-w-[100px] z-10">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
                className="w-full px-4 py-2 text-right text-sm text-grey-700 hover:bg-grey-100 transition-colors"
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full px-4 py-2 text-right text-sm text-warning-500 hover:bg-grey-100 transition-colors"
              >
                حذف
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 text-right">
          <h4 className="font-medium text-text-dark">{degree}</h4>
          <p className="text-grey-600 text-sm mt-1">{institution}</p>
          <p className="text-grey-500 text-sm mt-1">{year}</p>
        </div>
      </div>
    </div>
  );
}
