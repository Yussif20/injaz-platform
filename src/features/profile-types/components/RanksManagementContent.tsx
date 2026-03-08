"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@/shared/components/ui";
import {
  useProfileTypes,
  useProfileTypeWithSections,
  useDeleteSection,
  useDuplicateProfileType,
} from "../hooks";
import { useFilteredProfiles } from "@/features/profiles/hooks/useProfiles";
import type { SectionDto } from "../types/profile-types.types";
import { AddProfileTypeModal } from "./AddProfileTypeModal";
import { AddSectionModal } from "./AddSectionModal";
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

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: profileTypes = [], isLoading: isLoadingTypes } =
    useProfileTypes();

  const { data: selectedTypeData, isLoading: isLoadingSections } =
    useProfileTypeWithSections(selectedTypeId ?? undefined);

  const { data: profilesData } = useFilteredProfiles({ PageSize: 1000 });

  const deleteSection = useDeleteSection();
  const duplicateProfileType = useDuplicateProfileType();

  // Count profiles (files) per profile type
  const userCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    if (profilesData?.items) {
      for (const profile of profilesData.items) {
        if (profile.profileTypeId) {
          counts[profile.profileTypeId] = (counts[profile.profileTypeId] || 0) + 1;
        }
      }
    }
    return counts;
  }, [profilesData]);

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
          {/* Tabs + content — no gap between them */}
          <div>
            <ProfileTypeTabs
              profileTypes={profileTypes}
              selectedId={selectedTypeId}
              onSelect={setSelectedTypeId}
              userCounts={userCounts}
            />

          {/* White container starting from title — flush with tabs */}
          {selectedType && (
            <div className="rounded-b-2xl bg-white p-5 space-y-4">
              {/* Section header + action buttons */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-text-dark">
                  البنود الخاصة برتبة {selectedType.typeName}
                </h2>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setIsAddSectionModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    إضافة بند جديد
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => duplicateProfileType.mutate(selectedTypeId!)}
                    loading={duplicateProfileType.isPending}
                  >
                    نسخ الرتبة
                  </Button>
                </div>
              </div>

              {/* Section cards */}
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
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
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
    </div>
  );
}
