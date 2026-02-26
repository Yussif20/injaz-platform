"use client";

import React, { useState, useEffect } from "react";
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

export const FilePasswordModal: React.FC<FilePasswordModalProps> = ({
  isOpen,
  onClose,
  mode,
  onActivate,
  onSaveChanges,
  onDeactivate,
  isLoading = false,
  error,
}) => {
  const [password, setPassword] = useState("");
  const { filePasswordModal, passwordRequirements } = dashboardContent;

  const rules = {
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  };
  const isPasswordValid = rules.minLength && rules.uppercase && rules.specialChar;

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder={filePasswordModal.passwordPlaceholder}
                className="w-full px-4 py-3 pr-10 text-right bg-grey-100 border border-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                dir="rtl"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400"
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
            </div>
          </div>

          {/* Password requirements */}
          <div className="mb-6 rounded-xl bg-grey-50 p-3 text-right" dir="rtl">
            <p className="mb-2 text-xs font-medium text-grey-600">
              {passwordRequirements.title}
            </p>
            <ul className="space-y-1">
              {(
                [
                  ["minLength", passwordRequirements.minLength],
                  ["uppercase", passwordRequirements.uppercase],
                  ["specialChar", passwordRequirements.specialChar],
                ] as const
              ).map(([key, label]) => (
                <li
                  key={key}
                  className={`flex items-center gap-2 text-xs transition-colors ${
                    rules[key] ? "text-green-600" : "text-grey-400"
                  }`}
                >
                  <span className="shrink-0">{rules[key] ? "✓" : "○"}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
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
