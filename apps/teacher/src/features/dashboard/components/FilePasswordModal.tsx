"use client";

import React, { useState } from "react";
import { dashboardContent } from "@/content";
import { Button } from "@/shared/components/ui";

interface FilePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "set" | "change";
  onActivate?: (password: string) => void;
  onSaveChanges?: (password: string) => void;
  onDeactivate?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Gate the modal body on `isOpen` so the typed password lives exactly as long as the modal
 * is on screen. It previously stayed mounted and blanked itself from an effect, which both
 * cost a render on every close and left the password in React state until that effect ran.
 *
 * The split is here rather than at the call sites because two pages render this modal.
 */
export const FilePasswordModal: React.FC<FilePasswordModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <FilePasswordModalBody {...props} />;
};

const FilePasswordModalBody: React.FC<FilePasswordModalProps> = ({
  onClose,
  mode,
  onActivate,
  onSaveChanges,
  onDeactivate,
  isLoading = false,
  error,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { filePasswordModal } = dashboardContent;

  const isPasswordValid = password.length >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    if (mode === "set") {
      onActivate?.(password);
    } else {
      onSaveChanges?.(password);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const fieldLabel =
    mode === "set"
      ? filePasswordModal.passwordLabel
      : filePasswordModal.newPasswordLabel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-6 pb-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-grey-100 rounded-lg transition-colors shrink-0"
            aria-label="إغلاق"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex-1 flex justify-center min-w-0">
            <h2 className="text-lg font-semibold text-secondary-800 text-center">
              {mode === "set"
                ? filePasswordModal.setTitle
                : filePasswordModal.changeTitle}
            </h2>
          </div>
          <div className="w-9 shrink-0" aria-hidden />
        </div>

        {/* Description (only for set mode) */}
        {mode === "set" && (
          <p className="text-center text-grey-500 text-sm px-6 mt-2">
            {filePasswordModal.setDescription}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-grey-700 mb-2 text-right">
              {fieldLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder={filePasswordModal.passwordPlaceholder}
                className="w-full px-4 py-3 pr-10 text-right bg-grey-100 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
                tabIndex={-1}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>


          {/* Error message */}
          {error && (
            <p className="mb-4 text-sm text-center text-red-600">{error}</p>
          )}

          {/* Action buttons */}
          {mode === "set" ? (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={!isPasswordValid}
            >
              {filePasswordModal.activateButton}
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 !border-warning-500 !text-warning-500 hover:!bg-warning-50"
                onClick={onDeactivate}
                isLoading={isLoading}
              >
                {filePasswordModal.deactivateButton}
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="flex-1 !bg-grey-200 !text-grey-600 hover:!bg-grey-300"
                isLoading={isLoading}
                disabled={!isPasswordValid}
              >
                {filePasswordModal.saveChangesButton}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
