"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui";
import { queryKeys } from "@/shared/lib/query-keys";
import {
  useCreateSubsection,
  useUpdateSubsection,
  useDeleteSubsection,
} from "../hooks";
import type { SectionDto } from "../types/profile-types.types";

interface SectionItemCardProps {
  section: SectionDto;
  onEdit: () => void;
  onDelete: () => void;
}

type LocalSubsection = {
  id?: number;
  title: string;
  maxImageCount: number | null;
};

export function SectionItemCard({ section, onEdit, onDelete }: SectionItemCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [rows, setRows] = useState<LocalSubsection[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();
  const createSubsection = useCreateSubsection();
  const updateSubsection = useUpdateSubsection();
  const deleteSubsection = useDeleteSubsection();

  useEffect(() => {
    setRows(
      section.subsections.map((s) => ({
        id: s.id,
        title: s.title,
        maxImageCount: s.maxImageCount,
      })),
    );
    setDeletedIds([]);
  }, [section.id]);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { title: "", maxImageCount: null }]);
  };

  const handleRemoveRow = (index: number) => {
    const row = rows[index];
    if (row.id) setDeletedIds((prev) => [...prev, row.id!]);
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const id of deletedIds) {
        await deleteSubsection.mutateAsync({ id, sectionId: section.id });
      }
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.id) {
          await updateSubsection.mutateAsync({
            id: row.id,
            sectionId: section.id,
            data: {
              title: row.title,
              displayOrder: i,
              maxImageCount: row.maxImageCount,
              maxImageSize: null,
            },
          });
        } else {
          await createSubsection.mutateAsync({
            sectionId: section.id,
            title: row.title,
            displayOrder: i,
            maxImageCount: row.maxImageCount,
            maxImageSize: null,
          });
        }
      }
      setDeletedIds([]);
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.profileTypes.detail(section.profileTypeId), "withSections"],
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-grey-100 bg-white p-4">
      {/* Header row — RTL order: text right, buttons middle, chevron left */}
      <div className="flex items-center gap-3">
        {/* 1st in DOM = rightmost in RTL */}
        <div className="flex flex-1 flex-col text-right">
          <span className="text-sm text-grey-500">
            الوزن النسبي: {section.weightPercent}%
          </span>
          <span className="font-medium text-text-dark">{section.title}</span>
        </div>

        {/* 2nd = middle */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-warning-500 text-warning-500 hover:bg-warning-50"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 ml-1" />
            حذف
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 ml-1" />
            تعديل
          </Button>
        </div>

        {/* 3rd = leftmost */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-grey-400 hover:text-grey-600"
          aria-label={expanded ? "طي القسم" : "توسيع القسم"}
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Expanded body — inline editable subsection form */}
      {expanded && (
        <div className="mt-4">
          {rows.length > 0 && (
            <div className="mb-2 grid grid-cols-2 gap-4 px-2 text-sm font-medium text-text-dark">
              <span className="text-right">اسم البند الفرعي</span>
              <span className="text-right">عدد الشواهد المسموح بها للبند الفرعي</span>
            </div>
          )}

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                {/* Right col: remove button + title input */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="h-4 w-4 flex-shrink-0 rounded-full border border-grey-300 text-grey-300 hover:border-warning-500 hover:text-warning-500 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, i) =>
                          i === index ? { ...r, title: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="اسم البند الفرعي"
                    className="flex-1 rounded-lg border border-grey-200 px-3 py-2 text-right text-sm outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>

                {/* Left col: maxImageCount select */}
                <div className="relative">
                  <select
                    value={row.maxImageCount ?? ""}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, i) =>
                          i === index
                            ? {
                                ...r,
                                maxImageCount:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              }
                            : r,
                        ),
                      )
                    }
                    className="w-full appearance-none rounded-lg border border-grey-200 py-2 pe-8 ps-3 text-right text-sm outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    <option value="">غير محدود</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer — RTL order: "إضافة بند فرعي آخر" right, "حفظ" left */}
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleAddRow}>
              <Plus className="h-4 w-4" />
              إضافة بند فرعي آخر
            </Button>
            <Button variant="outline" onClick={handleSave} loading={isSaving}>
              <CheckCircle className="h-4 w-4" />
              حفظ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
