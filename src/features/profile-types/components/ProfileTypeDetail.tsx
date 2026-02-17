"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Button, ConfirmDialog } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import {
  useProfileTypeWithSections,
  useDeleteSection,
  useReorderSections,
  useDeleteSubsection,
  useReorderSubsections,
} from "../hooks";
import type { SectionDto, SubsectionDto } from "../types/profile-types.types";
import { AddSectionModal } from "./AddSectionModal";
import { AddSubsectionModal } from "./AddSubsectionModal";

interface ProfileTypeDetailProps {
  profileTypeId: number;
}

export function ProfileTypeDetail({ profileTypeId }: ProfileTypeDetailProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  const detailT = {
    sections: "الأقسام",
    addSection: "إضافة قسم",
    noSections: "لا توجد أقسام",
    weight: "الوزن",
    subsections: "الأقسام الفرعية",
    addSubsection: "إضافة قسم فرعي",
    noSubsections: "لا توجد أقسام فرعية",
    maxImages: "الحد الأقصى للصور",
    unlimited: "غير محدود",
    maxSize: "الحجم الأقصى",
    mb: "م.ب",
  };

  // Fetch profile type with sections
  const {
    data: profileType,
    isLoading,
    isError,
    refetch,
  } = useProfileTypeWithSections(profileTypeId);

  const deleteSection = useDeleteSection();
  const reorderSections = useReorderSections();
  const deleteSubsection = useDeleteSubsection();
  const reorderSubsections = useReorderSubsections();

  // Local state
  const [expandedSectionId, setExpandedSectionId] = useState<number | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Section modal
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionDto | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] =
    useState<SectionDto | null>(null);

  // Subsection modal
  const [isSubsectionModalOpen, setIsSubsectionModalOpen] = useState(false);
  const [editingSubsection, setEditingSubsection] =
    useState<SubsectionDto | null>(null);
  const [subsectionParentSection, setSubsectionParentSection] =
    useState<SectionDto | null>(null);
  const [deleteSubsectionTarget, setDeleteSubsectionTarget] = useState<{
    subsection: SubsectionDto;
    sectionId: number;
  } | null>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Section handlers
  const handleEditSection = (section: SectionDto) => {
    setEditingSection(section);
    setIsSectionModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteSection = (section: SectionDto) => {
    setDeleteSectionTarget(section);
    setOpenMenuId(null);
  };

  const confirmDeleteSection = () => {
    if (!deleteSectionTarget) return;
    deleteSection.mutate(
      { id: deleteSectionTarget.id, profileTypeId },
      {
        onSuccess: () => {
          toast({ type: "delete", message: toastT.deleted });
          setDeleteSectionTarget(null);
          if (expandedSectionId === deleteSectionTarget.id) {
            setExpandedSectionId(null);
          }
        },
        onError: () => {
          toast({ type: "error", message: toastT.error });
        },
      },
    );
  };

  const confirmDeleteSubsection = () => {
    if (!deleteSubsectionTarget) return;
    deleteSubsection.mutate(
      {
        id: deleteSubsectionTarget.subsection.id,
        sectionId: deleteSubsectionTarget.sectionId,
      },
      {
        onSuccess: () => {
          toast({ type: "delete", message: toastT.deleted });
          setDeleteSubsectionTarget(null);
          refetch();
        },
        onError: () => {
          toast({ type: "error", message: toastT.error });
        },
      },
    );
  };

  // Section reorder handlers
  const handleMoveSectionUp = (section: SectionDto, index: number) => {
    if (index === 0) return;
    const prevSection = sections[index - 1];
    const reorderMap: Record<number, number> = {
      [section.id]: prevSection.displayOrder,
      [prevSection.id]: section.displayOrder,
    };
    reorderSections.mutate(
      { profileTypeId, reorderMap },
      {
        onSuccess: () => refetch(),
        onError: () => toast({ type: "error", message: toastT.error }),
      },
    );
  };

  const handleMoveSectionDown = (section: SectionDto, index: number) => {
    if (index === sections.length - 1) return;
    const nextSection = sections[index + 1];
    const reorderMap: Record<number, number> = {
      [section.id]: nextSection.displayOrder,
      [nextSection.id]: section.displayOrder,
    };
    reorderSections.mutate(
      { profileTypeId, reorderMap },
      {
        onSuccess: () => refetch(),
        onError: () => toast({ type: "error", message: toastT.error }),
      },
    );
  };

  // Subsection reorder handlers
  const handleMoveSubsectionUp = (
    subsection: SubsectionDto,
    index: number,
    section: SectionDto,
  ) => {
    const subsections = section.subsections ?? [];
    if (index === 0) return;
    const prevSubsection = subsections[index - 1];
    const reorderMap: Record<number, number> = {
      [subsection.id]: prevSubsection.displayOrder,
      [prevSubsection.id]: subsection.displayOrder,
    };
    reorderSubsections.mutate(
      { sectionId: section.id, reorderMap },
      {
        onSuccess: () => refetch(),
        onError: () => toast({ type: "error", message: toastT.error }),
      },
    );
  };

  const handleMoveSubsectionDown = (
    subsection: SubsectionDto,
    index: number,
    section: SectionDto,
  ) => {
    const subsections = section.subsections ?? [];
    if (index === subsections.length - 1) return;
    const nextSubsection = subsections[index + 1];
    const reorderMap: Record<number, number> = {
      [subsection.id]: nextSubsection.displayOrder,
      [nextSubsection.id]: subsection.displayOrder,
    };
    reorderSubsections.mutate(
      { sectionId: section.id, reorderMap },
      {
        onSuccess: () => refetch(),
        onError: () => toast({ type: "error", message: toastT.error }),
      },
    );
  };

  // Subsection handlers
  const handleAddSubsection = (section: SectionDto) => {
    setSubsectionParentSection(section);
    setEditingSubsection(null);
    setIsSubsectionModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditSubsection = (
    subsection: SubsectionDto,
    section: SectionDto,
  ) => {
    setSubsectionParentSection(section);
    setEditingSubsection(subsection);
    setIsSubsectionModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteSubsection = (
    subsection: SubsectionDto,
    sectionId: number,
  ) => {
    setDeleteSubsectionTarget({ subsection, sectionId });
    setOpenMenuId(null);
  };

  const handleSectionModalClose = () => {
    setIsSectionModalOpen(false);
    setEditingSection(null);
  };

  const handleSectionModalSuccess = () => {
    handleSectionModalClose();
    toast({ type: "success", message: toastT.saved });
    refetch();
  };

  const handleSubsectionModalClose = () => {
    setIsSubsectionModalOpen(false);
    setEditingSubsection(null);
    setSubsectionParentSection(null);
  };

  const handleSubsectionModalSuccess = () => {
    handleSubsectionModalClose();
    toast({ type: "success", message: toastT.saved });
    refetch();
  };

  const toggleSectionExpand = (id: number) => {
    setExpandedSectionId(expandedSectionId === id ? null : id);
  };

  // Format file size
  const formatSize = (bytes: number | null): string => {
    if (bytes === null) return `5 ${detailT.mb}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${detailT.mb}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !profileType) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <p className="text-sm text-grey-500">{toastT.error}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {actionsT.retry ?? "إعادة المحاولة"}
        </Button>
      </div>
    );
  }

  const sections = profileType.sections ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-text-dark">
          {detailT.sections}
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingSection(null);
            setIsSectionModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {detailT.addSection}
        </Button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="rounded-lg border border-grey-200 bg-white py-8 text-center text-sm text-grey-400">
          {detailT.noSections}
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="rounded-lg border border-grey-200 bg-white"
            >
              {/* Section Row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSectionExpand(section.id)}
                    className="rounded p-1 text-grey-400 hover:bg-grey-100"
                  >
                    {expandedSectionId === section.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {/* Reorder arrows */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleMoveSectionUp(section, sectionIndex)}
                      disabled={sectionIndex === 0 || reorderSections.isPending}
                      className="rounded p-0.5 text-grey-400 hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() =>
                        handleMoveSectionDown(section, sectionIndex)
                      }
                      disabled={
                        sectionIndex === sections.length - 1 ||
                        reorderSections.isPending
                      }
                      className="rounded p-0.5 text-grey-400 hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-text-dark">
                    {section.title}
                  </span>
                  <span className="text-xs text-grey-500">
                    ({detailT.weight}: {section.weightPercent}%)
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === `section-${section.id}`
                          ? null
                          : `section-${section.id}`,
                      )
                    }
                    className="rounded-lg p-1 text-grey-400 hover:bg-grey-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenuId === `section-${section.id}` && (
                    <div
                      ref={menuRef}
                      className="absolute end-0 top-full z-20 w-40 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                    >
                      <button
                        onClick={() => handleAddSubsection(section)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-grey-700 hover:bg-grey-50"
                      >
                        <Plus className="h-4 w-4" />
                        {detailT.addSubsection}
                      </button>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-grey-700 hover:bg-grey-50"
                      >
                        <Pencil className="h-4 w-4" />
                        {actionsT.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning-500 hover:bg-grey-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {actionsT.delete}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Subsections */}
              {expandedSectionId === section.id && (
                <div className="border-t border-grey-200 bg-grey-50 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-grey-500">
                      {detailT.subsections}
                    </span>
                  </div>
                  {(section.subsections ?? []).length === 0 ? (
                    <p className="py-4 text-center text-xs text-grey-400">
                      {detailT.noSubsections}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {section.subsections.map((sub, subIndex) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between rounded bg-white px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            {/* Reorder arrows */}
                            <div className="flex flex-col">
                              <button
                                onClick={() =>
                                  handleMoveSubsectionUp(sub, subIndex, section)
                                }
                                disabled={
                                  subIndex === 0 ||
                                  reorderSubsections.isPending
                                }
                                className="rounded p-0.5 text-grey-400 hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <ArrowUp className="h-2.5 w-2.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleMoveSubsectionDown(
                                    sub,
                                    subIndex,
                                    section,
                                  )
                                }
                                disabled={
                                  subIndex ===
                                    (section.subsections?.length ?? 0) - 1 ||
                                  reorderSubsections.isPending
                                }
                                className="rounded p-0.5 text-grey-400 hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <ArrowDown className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <span className="text-sm text-text-dark">
                              {sub.title}
                            </span>
                            <span className="text-xs text-grey-400">
                              ({detailT.maxImages}:{" "}
                              {sub.maxImageCount ?? detailT.unlimited},{" "}
                              {detailT.maxSize}: {formatSize(sub.maxImageSize)})
                            </span>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === `sub-${sub.id}`
                                    ? null
                                    : `sub-${sub.id}`,
                                )
                              }
                              className="rounded p-1 text-grey-400 hover:bg-grey-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {openMenuId === `sub-${sub.id}` && (
                              <div
                                ref={menuRef}
                                className="absolute end-0 top-full z-20 w-36 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                              >
                                <button
                                  onClick={() =>
                                    handleEditSubsection(sub, section)
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-grey-700 hover:bg-grey-50"
                                >
                                  <Pencil className="h-4 w-4" />
                                  {actionsT.edit}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSubsection(sub, section.id)
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning-500 hover:bg-grey-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {actionsT.delete}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Section Modal */}
      <AddSectionModal
        isOpen={isSectionModalOpen}
        onClose={handleSectionModalClose}
        onSuccess={handleSectionModalSuccess}
        profileTypeId={profileTypeId}
        initialData={editingSection}
        existingSections={sections}
      />

      {/* Subsection Modal */}
      {subsectionParentSection && (
        <AddSubsectionModal
          isOpen={isSubsectionModalOpen}
          onClose={handleSubsectionModalClose}
          onSuccess={handleSubsectionModalSuccess}
          sectionId={subsectionParentSection.id}
          initialData={editingSubsection}
          existingSubsections={subsectionParentSection.subsections ?? []}
        />
      )}

      {/* Delete Section Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteSectionTarget}
        onClose={() => setDeleteSectionTarget(null)}
        onConfirm={confirmDeleteSection}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteSection.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />

      {/* Delete Subsection Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteSubsectionTarget}
        onClose={() => setDeleteSubsectionTarget(null)}
        onConfirm={confirmDeleteSubsection}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteSubsection.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />
    </div>
  );
}
