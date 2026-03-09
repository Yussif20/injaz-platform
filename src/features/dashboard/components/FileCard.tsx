"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CirclePlus } from "lucide-react";
import { dashboardContent } from "@/content";

export type FileStatus = "incomplete" | "unpublished" | "published";

export interface FileData {
  id: string;
  title: string;
  ownerName: string;
  year: string;
  creationDate: string;
  status: FileStatus;
  hasPassword?: boolean;
}

interface FileCardProps {
  file: FileData;
  onAddEvidence?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  onEditBasicData?: (fileId: string) => void;
  onEditMyData?: (fileId: string) => void;
  onSetPassword?: (fileId: string) => void;
  onChangePassword?: (fileId: string) => void;
  onPublish?: (fileId: string) => void;
  onUnpublish?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  /** Whether the user can publish (subscription + profile complete) */
  canPublish?: boolean;
  /** When set, show a single primary button with this label instead of Add Evidence + Preview */
  singleActionLabel?: string;
  /** Icon path for the single action button (e.g. /icons/ui/white-lock.svg) */
  singleActionIcon?: string;
  onSingleAction?: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onAddEvidence,
  onPreview,
  onEditBasicData,
  onEditMyData,
  onSetPassword,
  onChangePassword,
  onPublish,
  onUnpublish,
  onDelete,
  canPublish = false,
  singleActionLabel,
  singleActionIcon,
  onSingleAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { filesSection, fileStatus, fileOptions } = dashboardContent;
  const useSingleAction = Boolean(singleActionLabel && onSingleAction);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reposition menu on scroll/resize
  useEffect(() => {
    if (!isMenuOpen || !triggerRef.current) return;
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 220;
      const menuHeight = 340; // approximate max height
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
      // If the menu would overflow the bottom, open upward
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight
        ? Math.max(8, rect.top - menuHeight)
        : rect.bottom + 4;
      setMenuPos({ top, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isMenuOpen]);

  const getStatusConfig = (status: FileStatus) => {
    switch (status) {
      case "incomplete":
        return {
          label: fileStatus.incomplete,
          dotColor: "bg-warning-500",
          textColor: "text-warning-500",
        };
      case "unpublished":
        return {
          label: fileStatus.unpublished,
          dotColor: "bg-grey-400",
          textColor: "text-grey-500",
        };
      case "published":
        return {
          label: fileStatus.published,
          dotColor: "bg-success-500",
          textColor: "text-success-500",
        };
    }
  };

  const statusConfig = getStatusConfig(file.status);

  const handleMenuOption = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-[#E3EFEF] rounded-xl sm:rounded-2xl border border-grey-200 p-4 sm:p-5 relative min-w-0">
      {/* Row 1: Edit button (menu) on one end - hidden when single action mode */}
      {!useSingleAction && (
      <div className="flex flex-row justify-between items-center mb-3 sm:mb-4">
        <span />
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
            aria-label="خيارات الملف"
          >
            <svg
              className="w-5 h-5 text-grey-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {/* Dropdown menu — rendered in portal with fixed position */}
          {isMenuOpen && menuPos && typeof window !== "undefined" && createPortal(
            <div
              ref={menuRef}
              className="bg-white rounded-xl shadow-lg border border-grey-200 py-2 min-w-[220px] z-[9999]"
              style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            >
            <button
              onClick={() => handleMenuOption(() => onEditBasicData?.(file.id))}
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-grey-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="text-grey-700">{fileOptions.editBasicData}</span>
            </button>

            <button
              onClick={() => handleMenuOption(() => onEditMyData?.(file.id))}
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-grey-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span className="text-grey-700">{fileOptions.editMyData}</span>
            </button>

            <button
              onClick={() =>
                handleMenuOption(() =>
                  file.hasPassword
                    ? onChangePassword?.(file.id)
                    : onSetPassword?.(file.id)
                )
              }
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-grey-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-grey-700">
                {file.hasPassword
                  ? fileOptions.changePassword
                  : fileOptions.createPassword}
              </span>
            </button>

            {file.status !== "published" && (
              <button
                onClick={() => handleMenuOption(() => onPublish?.(file.id))}
                className="w-full flex items-center gap-3 px-4 py-3 text-right transition-colors hover:bg-grey-50"
              >
                <svg
                  className="w-5 h-5 text-success-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-success-500">{fileOptions.publish || "نشر الملف"}</span>
              </button>
            )}

            {file.status === "published" && (
              <button
                onClick={() => handleMenuOption(() => onUnpublish?.(file.id))}
                className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-warning-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-warning-500">{fileOptions.unpublish}</span>
              </button>
            )}

          </div>,
          document.body
        )}
        </div>
      </div>
      )}

      {/* Row 2: rank/year — file state (justify-between) */}
      <div className="flex flex-row justify-between items-start gap-2 sm:gap-4 mb-2 min-w-0">
        <p className="text-[#4D4D4D] font-light text-sm md:text-lg min-w-0 break-words">
          {file.title} - {file.year}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dotColor}`} />
          <p className={`font-normal text-xs md:text-lg whitespace-nowrap ${statusConfig.textColor}`}>
            {statusConfig.label}
          </p>
        </div>
      </div>

      {/* Row 3: owner name — creation date (justify-between); hide creation date when single-action row shows it below */}
      <div className="flex flex-row justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4 min-w-0">
        <p className="text-[#333] font-normal text-sm md:text-xl min-w-0 break-words">
          {file.ownerName}
        </p>
        {!useSingleAction && (
          <p className="text-[#4D4D4D] font-light text-xs md:text-lg flex-shrink-0">
            {filesSection.creationDate} {file.creationDate}
          </p>
        )}
      </div>

      {/* Action buttons: single primary or default Add Evidence + Preview */}
      <div className="flex flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
        {useSingleAction ? (
          <>
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onSingleAction?.(file.id)}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-sm sm:text-base font-normal rounded-4xl bg-primary-500 text-white hover:bg-primary-800 active:bg-primary-700 transition-colors duration-200"
              >
                {singleActionIcon && (
                  <Image
                    src={singleActionIcon}
                    alt=""
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  />
                )}
                <span className="truncate">{singleActionLabel}</span>
              </button>
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-end text-left">
              <p className="text-[#4D4D4D] font-light text-xs md:text-lg">
                {filesSection.creationDate} {file.creationDate}
              </p>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onAddEvidence?.(file.id)}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-sm sm:text-base font-normal rounded-4xl bg-primary-500 text-white hover:bg-primary-800 active:bg-primary-700 transition-colors duration-200"
            >
              <CirclePlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{filesSection.addEvidence}</span>
            </button>

            <button
              type="button"
              onClick={() => onPreview?.(file.id)}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-sm sm:text-base font-normal rounded-4xl border-2 border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span className="truncate">{filesSection.previewFile}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
