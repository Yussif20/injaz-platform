"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@/shared/components/ui";
import {
  useProfileTypes,
  useProfileTypeWithSections,
  useDeleteSection,
  useDeleteSubsection,
} from "../hooks";
import type { SectionDto, SubsectionDto } from "../types/profile-types.types";
import { AddProfileTypeModal } from "./AddProfileTypeModal";
import { AddSectionModal } from "./AddSectionModal";
import { AddSubsectionModal } from "./AddSubsectionModal";
import { ProfileTypeTabs } from "./ProfileTypeTabs";
import { SectionItemCard } from "./SectionItemCard";

export function RanksManagementContent() {
  // ── Selected tab ──────────────────────────────────────────────────────────
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  // ── Modal / dialog state ──────────────────────────────────────────────────
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [editSectionModal, setEditSectionModal] = useState<{
    open: boolean;
    section: SectionDto | null;
  }>({ open: false, section: null });
  const [deleteSectionDialog, setDeleteSectionDialog] = useState<{
    open: boolean;
    sectionId: number | null;
  }>({ open: false, sectionId: null });

  const [addSubsectionModal, setAddSubsectionModal] = useState<{
    open: boolean;
    sectionId: number | null;
  }>({ open: false, sectionId: null });
  const [editSubsectionModal, setEditSubsectionModal] = useState<{
    open: boolean;
    subsection: SubsectionDto | null;
  }>({ open: false, subsection: null });
  const [deleteSubsectionDialog, setDeleteSubsectionDialog] = useState<{
    open: boolean;
    subsection: SubsectionDto | null;
  }>({ open: false, subsection: null });

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: profileTypes = [], isLoading: isLoadingTypes } =
    useProfileTypes();

  const { data: selectedTypeData, isLoading: isLoadingSections } =
    useProfileTypeWithSections(selectedTypeId ?? undefined);

  const deleteSection = useDeleteSection();
  const deleteSubsection = useDeleteSubsection();

  // Auto-select first type on load
  useEffect(() => {
    if (profileTypes.length > 0 && selectedTypeId === null) {
      setSelectedTypeId(profileTypes[0].id);
    }
  }, [profileTypes, selectedTypeId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedType = profileTypes.find((t) => t.id === selectedTypeId);

  const sections = [...(selectedTypeData?.sections ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDeleteSection = () => {
    if (deleteSectionDialog.sectionId === null || selectedTypeId === null)
      return;
    deleteSection.mutate(
      { id: deleteSectionDialog.sectionId, profileTypeId: selectedTypeId },
      { onSuccess: () => setDeleteSectionDialog({ open: false, sectionId: null }) },
    );
  };

  const handleDeleteSubsection = () => {
    const { subsection } = deleteSubsectionDialog;
    if (!subsection) return;
    deleteSubsection.mutate(
      { id: subsection.id, sectionId: subsection.sectionId },
      {
        onSuccess: () =>
          setDeleteSubsectionDialog({ open: false, subsection: null }),
      },
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoadingTypes) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddTypeModalOpen(true)}>
          <Plus className="h-4 w-4" />
          أضف رتبة جديدة
        </Button>
      </div>

      {/* Empty state */}
      {profileTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-grey-200 py-16 text-center">
          <p className="mb-4 text-grey-500">لا توجد رتب بعد</p>
          <Button onClick={() => setIsAddTypeModalOpen(true)}>
            <Plus className="h-4 w-4" />
            أضف رتبة جديدة
          </Button>
        </div>
      ) : (
        <>
          {/* Tabs row */}
          <ProfileTypeTabs
            profileTypes={profileTypes}
            selectedId={selectedTypeId}
            onSelect={setSelectedTypeId}
          />

          {/* Sections area */}
          {selectedType && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-text-dark">
                  البنود الخاصة برتبة {selectedType.typeName}
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddSectionModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  إضافة بند
                </Button>
              </div>

              {isLoadingSections ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </div>
              ) : sections.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-grey-200 py-10 text-center">
                  <p className="text-grey-400">لا توجد بنود لهذه الرتبة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sections.map((section) => (
                    <SectionItemCard
                      key={section.id}
                      section={section}
                      onEdit={() =>
                        setEditSectionModal({ open: true, section })
                      }
                      onDelete={() =>
                        setDeleteSectionDialog({
                          open: true,
                          sectionId: section.id,
                        })
                      }
                      onAddSubsection={() =>
                        setAddSubsectionModal({
                          open: true,
                          sectionId: section.id,
                        })
                      }
                      onEditSubsection={(subsection) =>
                        setEditSubsectionModal({ open: true, subsection })
                      }
                      onDeleteSubsection={(subsection) =>
                        setDeleteSubsectionDialog({ open: true, subsection })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Modals & Dialogs ─────────────────────────────────────────────── */}

      {/* Add Profile Type */}
      <AddProfileTypeModal
        isOpen={isAddTypeModalOpen}
        onClose={() => setIsAddTypeModalOpen(false)}
        onSuccess={() => setIsAddTypeModalOpen(false)}
      />

      {/* Add Section */}
      {selectedTypeId !== null && (
        <AddSectionModal
          isOpen={isAddSectionModalOpen}
          onClose={() => setIsAddSectionModalOpen(false)}
          onSuccess={() => setIsAddSectionModalOpen(false)}
          profileTypeId={selectedTypeId}
          existingSections={sections}
        />
      )}

      {/* Edit Section */}
      {selectedTypeId !== null && editSectionModal.section && (
        <AddSectionModal
          isOpen={editSectionModal.open}
          onClose={() => setEditSectionModal({ open: false, section: null })}
          onSuccess={() => setEditSectionModal({ open: false, section: null })}
          profileTypeId={selectedTypeId}
          initialData={editSectionModal.section}
          existingSections={sections}
        />
      )}

      {/* Delete Section Confirm */}
      <ConfirmDialog
        isOpen={deleteSectionDialog.open}
        onClose={() =>
          setDeleteSectionDialog({ open: false, sectionId: null })
        }
        onConfirm={handleDeleteSection}
        title="حذف البند"
        message="هل أنت متأكد من حذف هذا البند؟ سيتم حذف جميع البنود الفرعية المرتبطة به."
        isLoading={deleteSection.isPending}
      />

      {/* Add Subsection */}
      {addSubsectionModal.sectionId !== null && (
        <AddSubsectionModal
          isOpen={addSubsectionModal.open}
          onClose={() => setAddSubsectionModal({ open: false, sectionId: null })}
          onSuccess={() =>
            setAddSubsectionModal({ open: false, sectionId: null })
          }
          sectionId={addSubsectionModal.sectionId}
          existingSubsections={
            sections.find((s) => s.id === addSubsectionModal.sectionId)
              ?.subsections ?? []
          }
        />
      )}

      {/* Edit Subsection */}
      {editSubsectionModal.subsection && (
        <AddSubsectionModal
          isOpen={editSubsectionModal.open}
          onClose={() =>
            setEditSubsectionModal({ open: false, subsection: null })
          }
          onSuccess={() =>
            setEditSubsectionModal({ open: false, subsection: null })
          }
          sectionId={editSubsectionModal.subsection.sectionId}
          initialData={editSubsectionModal.subsection}
        />
      )}

      {/* Delete Subsection Confirm */}
      <ConfirmDialog
        isOpen={deleteSubsectionDialog.open}
        onClose={() =>
          setDeleteSubsectionDialog({ open: false, subsection: null })
        }
        onConfirm={handleDeleteSubsection}
        title="حذف البند الفرعي"
        message="هل أنت متأكد من حذف هذا البند الفرعي؟"
        isLoading={deleteSubsection.isPending}
      />
    </div>
  );
}
