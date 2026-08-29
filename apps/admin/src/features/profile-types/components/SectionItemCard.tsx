"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus, PlusCircle, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui";
import { queryKeys } from "@/shared/lib/query-keys";
import {
  useCreateSubsection,
  useUpdateSubsection,
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();
  const createSubsection = useCreateSubsection();
  const updateSubsection = useUpdateSubsection();

  // `rows` is the editable working copy of this section's subsections. It is seeded on
  // mount and re-seeded only when the card is showing a *different* section — keyed on the
  // id, not the contents, so a refetch of the same section does not discard edits in
  // progress. It used to start empty and be filled by an effect, so every card rendered
  // once with no rows before its real ones appeared.
  const rowsFromSection = () =>
    section.subsections.map((s) => ({
      id: s.id,
      title: s.title,
      maxImageCount: s.maxImageCount,
    }));

  const [rows, setRows] = useState<LocalSubsection[]>(rowsFromSection);
  const [lastSectionId, setLastSectionId] = useState(section.id);

  if (section.id !== lastSectionId) {
    setLastSectionId(section.id);
    setRows(rowsFromSection());
  }

  const handleAddRow = () => {
    setRows((prev) => [...prev, { title: "", maxImageCount: null }]);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setExpanded(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
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
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.profileTypes.detail(section.profileTypeId), "withSections"],
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getRowLabel = (baseLabel: string, index: number, total: number) => {
    if (total <= 1) return baseLabel;
    return index === 0 ? baseLabel : `${baseLabel} ${index + 1}`;
  };

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col text-right">
          <span className="text-lg font-light" style={{ color: "#4D4D4D" }}>
            الوزن النسبي: {section.weightPercent}%
          </span>
          <span className="text-xl font-normal text-text-dark">{section.title}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleStartEditing} className="text-xs! font-light!">
            <Pencil className="h-3.5 w-3.5 me-1" />
            تعديل
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-warning-500 text-warning-500 hover:bg-warning-50 text-xs! font-light!"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5 me-1" />
            حذف
          </Button>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-grey-400 hover:text-grey-600"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-4">
          {/* Read-only list of subsections */}
          {!isEditing && section.subsections.length > 0 && (
            <div className="space-y-2">
              {section.subsections.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-grey-100 px-4 py-3">
                  <span className="text-sm text-text-dark">{sub.title}</span>
                  {sub.maxImageCount != null && (
                    <span className="text-xs text-grey-400">
                      عدد الشواهد: {sub.maxImageCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isEditing && section.subsections.length === 0 && (
            <p className="text-center text-sm text-grey-400">لا يوجد بنود فرعية</p>
          )}

          {!isEditing && (
            <div className="mt-4">
              <Button
                className="w-full rounded-[20px]! font-light!"
                size="lg"
                onClick={handleStartEditing}
              >
                <PlusCircle className="h-5 w-5" />
                {section.subsections.length > 0 ? "إضافة بند فرعي آخر" : "إضافة بند فرعي"}
              </Button>
            </div>
          )}

          {/* Editable fields — only when editing */}
          {isEditing && (
            <>
              <div className="space-y-4">
                {rows.map((row, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-dark text-right">
                        {getRowLabel("اسم البند الفرعي", index, rows.length)}
                      </label>
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
                        className="w-full rounded-lg border border-grey-200 px-3 py-2 text-right text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-text-dark text-right">
                        {getRowLabel("عدد الشواهد المسموح بها للبند الفرعي", index, rows.length)}
                      </label>
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
                          className="w-full appearance-none rounded-lg border border-grey-200 py-2 pe-8 ps-3 text-right text-sm outline-none focus:ring-2 focus:ring-primary-500/30"
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
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button className="w-full" onClick={handleAddRow}>
                  {rows.length === 0 ? (
                    <PlusCircle className="h-5 w-5" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {rows.length === 0 ? "إضافة بند فرعي" : "إضافة بند فرعي آخر"}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleSave}
                  loading={isSaving}
                >
                  <CheckCircle className="h-4 w-4" />
                  حفظ
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
