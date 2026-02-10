"use client";

import { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button } from "@/shared/components/ui";
import type { YearStatus } from "../data/academic-years.mock";

interface AddYearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddYearModal({ isOpen, onClose }: AddYearModalProps) {
  const { t } = useTranslation();
  const ayT = t("academicYears") as any;
  const modalT = ayT.modal;
  const statusT = ayT.status;

  const [selectedStatus, setSelectedStatus] = useState<YearStatus>("active");

  if (!isOpen) return null;

  const statusOptions: { value: YearStatus; label: string }[] = [
    { value: "active", label: statusT.active },
    { value: "inactive", label: statusT.inactive },
    { value: "expired", label: statusT.expired },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add year submitted");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-dark">{modalT.title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-grey-400 hover:bg-grey-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hijri & Gregorian Year */}
          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label={modalT.hijriYear}
              placeholder={modalT.enterYear}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
            <ModalField
              label={modalT.gregorianYear}
              placeholder={modalT.enterYear}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
          </div>

          {/* Status Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-dark">
              {modalT.yearStatus}
            </label>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selectedStatus === option.value
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-grey-200 bg-white text-grey-500 hover:border-grey-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hijri Dates */}
          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label={modalT.hijriStartDate}
              placeholder={modalT.enterDate}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
            <ModalField
              label={modalT.hijriEndDate}
              placeholder={modalT.enterDate}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
          </div>

          {/* Gregorian Dates */}
          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label={modalT.gregorianStartDate}
              placeholder={modalT.enterDate}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
            <ModalField
              label={modalT.gregorianEndDate}
              placeholder={modalT.enterDate}
              icon={<Calendar className="h-4 w-4 text-grey-400" />}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full rounded-[20px]! font-light!"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            {modalT.add}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ModalField({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-dark">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        <input
          className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
