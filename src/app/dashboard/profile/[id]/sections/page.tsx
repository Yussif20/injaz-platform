"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  SectionAccordion,
  AddEvidenceModal,
  EditEvidenceModal,
} from "@/features/profiles";
import {
  useProfileDetails,
  useUploadSubsectionImage,
  useUpdateImage,
  useDeleteImage,
} from "@/features/profiles/hooks";
import type { SubsectionImage } from "@/features/profiles/types/profile.types";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button, ConfirmModal } from "@/shared/components/ui";
import { saveDraft } from "@/features/profiles/services/profiles.service";

export default function ProfileSectionsPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;

  const { sectionsPage, imageActions } = dashboardContent;

  // Fetch profile details with sections
  const { profileDetails, isLoading, refetch } = useProfileDetails(Number(profileId));
  const { uploadImageAsync, isLoading: isAddingImage } = useUploadSubsectionImage();
  const { updateImageAsync, isLoading: isUpdatingImage } = useUpdateImage();
  const { deleteImageAsync, isLoading: isDeletingImage } = useDeleteImage();

  // Add Evidence Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubsectionId, setSelectedSubsectionId] = useState<number | null>(null);
  const [addEvidenceError, setAddEvidenceError] = useState<string | null>(null);

  // Edit Evidence Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<SubsectionImage | null>(null);
  const [editSubsectionId, setEditSubsectionId] = useState<number | null>(null);
  const [editEvidenceError, setEditEvidenceError] = useState<string | null>(null);

  // Delete Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<SubsectionImage | null>(null);

  // Save as Draft state
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveDraftError, setSaveDraftError] = useState<string | null>(null);

  // Add Evidence Handlers
  const handleAddEvidence = (subsectionId: number) => {
    setSelectedSubsectionId(subsectionId);
    setAddEvidenceError(null);
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setSelectedSubsectionId(null);
    setAddEvidenceError(null);
  };

  const handleSubmitEvidence = async (data: { title: string; image: File }) => {
    if (!selectedSubsectionId) return;

    try {
      await uploadImageAsync({
        profileId: Number(profileId),
        subsectionId: selectedSubsectionId,
        file: data.image,
        description: data.title,
      });

      refetch();
      handleAddModalClose();
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "حدث خطأ أثناء رفع الصورة";
      setAddEvidenceError(msg);
    }
  };

  // Edit Evidence Handlers
  const handleEditImage = (subsectionId: number, image: SubsectionImage) => {
    setImageToEdit(image);
    setEditSubsectionId(subsectionId);
    setEditEvidenceError(null);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setImageToEdit(null);
    setEditSubsectionId(null);
    setEditEvidenceError(null);
  };

  const handleSubmitEditEvidence = async (data: { title: string; image?: File }) => {
    if (!imageToEdit) return;

    try {
      await updateImageAsync({
        imageId: imageToEdit.id,
        profileId: Number(profileId),
        subsectionId: editSubsectionId || undefined,
        data: { description: data.title },
        file: data.image,
      });

      refetch();
      handleEditModalClose();
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "حدث خطأ أثناء تحديث الصورة";
      setEditEvidenceError(msg);
    }
  };

  // Delete Evidence Handlers
  const handleDeleteImage = (subsectionId: number, image: SubsectionImage) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    if (!isDeletingImage) {
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      await deleteImageAsync({
        imageId: imageToDelete.id,
        profileId: Number(profileId),
      });

      refetch();
      handleDeleteModalClose();
    } catch (error) {
      console.error("Error deleting evidence:", error);
    }
  };

  // Page Actions
  const handleSaveAsDraft = async () => {
    setSaveDraftError(null);
    setIsSavingDraft(true);
    try {
      const result = await saveDraft(Number(profileId));
      if (result.status) {
        router.push(ROUTES.DASHBOARD);
      } else {
        setSaveDraftError(result.message);
      }
    } catch {
      setSaveDraftError("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePreviewFile = () => {
    router.push(ROUTES.PROFILE_PREVIEW(profileId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profileDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-grey-500">لم يتم العثور على الملف</p>
        <Link
          href={ROUTES.DASHBOARD}
          className="text-primary-500 hover:text-primary-600 mt-4 inline-block"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="text-right" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-800 mb-2">
            {sectionsPage.pageTitle}
          </h1>
          <p className="text-grey-500">{sectionsPage.subtitle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePreviewFile}
              className="!w-auto px-6"
            >
              {sectionsPage.previewFile}
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}
              className="!w-auto px-6"
            >
              {isSavingDraft ? "جاري الحفظ..." : sectionsPage.saveAsDraft}
            </Button>
          </div>
          {saveDraftError && (
            <p className="text-sm text-warning-500">{saveDraftError}</p>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {profileDetails.sections?.map((section, index) => (
          <SectionAccordion
            key={section.id}
            section={section}
            defaultExpanded={index === 0}
            onAddEvidence={handleAddEvidence}
            onEditImage={handleEditImage}
            onDeleteImage={handleDeleteImage}
          />
        ))}
      </div>

      {/* Add Evidence Modal */}
      <AddEvidenceModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSubmit={handleSubmitEvidence}
        isLoading={isAddingImage}
        apiError={addEvidenceError}
      />

      {/* Edit Evidence Modal */}
      <EditEvidenceModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleSubmitEditEvidence}
        isLoading={isUpdatingImage}
        image={imageToEdit}
        apiError={editEvidenceError}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        title=""
        message={imageActions.deleteConfirmMessage}
        confirmText={imageActions.deleteConfirmButton}
        cancelText={imageActions.cancelButton}
        variant="danger"
        isLoading={isDeletingImage}
      />
    </div>
  );
}
