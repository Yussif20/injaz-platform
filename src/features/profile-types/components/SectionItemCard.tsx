"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui";
import type { SectionDto, SubsectionDto } from "../types/profile-types.types";

interface SectionItemCardProps {
  section: SectionDto;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubsection: () => void;
  onEditSubsection: (subsection: SubsectionDto) => void;
  onDeleteSubsection: (subsection: SubsectionDto) => void;
}

export function SectionItemCard({
  section,
  onEdit,
  onDelete,
  onAddSubsection,
  onEditSubsection,
  onDeleteSubsection,
}: SectionItemCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-grey-100 bg-white p-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-grey-400 transition-colors hover:text-grey-600"
          aria-label={expanded ? "طي القسم" : "توسيع القسم"}
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <span className="font-medium text-text-dark">{section.title}</span>
          <span className="text-sm text-grey-500">
            الوزن النسبي: {section.weightPercent}%
          </span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={onEdit}>
            تعديل
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-warning-500 text-warning-500 hover:bg-warning-50"
            onClick={onDelete}
          >
            حذف
          </Button>
        </div>
      </div>

      {/* Expanded body — subsections */}
      {expanded && (
        <div className="mt-3 space-y-2">
          {section.subsections.length === 0 ? (
            <p className="py-2 text-center text-sm text-grey-400">
              لا توجد بنود فرعية
            </p>
          ) : (
            section.subsections.map((subsection) => (
              <div
                key={subsection.id}
                className="flex items-center gap-3 rounded-xl bg-grey-50 px-4 py-2.5"
              >
                <span className="flex-1 text-sm text-text-dark">
                  {subsection.title}
                </span>

                {subsection.maxImageCount !== null && (
                  <span className="text-xs text-grey-400">
                    الصور: {subsection.maxImageCount}
                  </span>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => onEditSubsection(subsection)}
                    className="text-sm text-primary-500 hover:underline"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDeleteSubsection(subsection)}
                    className="text-sm text-warning-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer — add subsection */}
      <div className="mt-3">
        <button
          onClick={onAddSubsection}
          className="w-full rounded-xl border border-dashed border-primary-300 py-2.5 text-sm text-primary-500 transition-colors hover:bg-primary-50"
        >
          + إضافة بند فرعي
        </button>
      </div>
    </div>
  );
}
