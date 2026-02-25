"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { useAuth } from "@/features/auth";
import {
  FileCard,
  FileFilters,
  FilePasswordModal,
  ConfirmationModal,
  FileData,
  FileStatus,
} from "@/features/dashboard";
import {
  useMyProfiles,
  useAcademicYears,
  useUnpublishProfile,
  useDeleteProfile,
} from "@/features/profiles";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import type { Profile } from "@/features/profiles/types";

// Helper function to map Profile status to FileStatus
function mapProfileStatusToFileStatus(status: string | null): FileStatus {
  switch (status) {
    case "Published":
      return "published";
    case "Unpublished":
      return "unpublished";
    case "Draft":
    default:
      return "incomplete";
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

// Job rank display: prefer personalInfo rank (الرتبة الوظيفية) over profile type name
function getProfileJobRank(profile: Profile): string {
  const info = profile.personalInfo;
  if (!info) return profile.profileTypeName || "ملف";
  return (
    info.rankTitle ??
    info.rankTitleMale ??
    info.rankTitleFemale ??
    profile.profileTypeName ??
    "ملف"
  );
}

// Helper function to map Profile to FileData
function mapProfileToFileData(profile: Profile): FileData {
  return {
    id: String(profile.id),
    title: getProfileJobRank(profile),
    ownerName: profile.userFullName || "",
    year: profile.academicYearName || "",
    creationDate: formatDate(profile.createdAt),
    status: mapProfileStatusToFileStatus(profile.status),
    hasPassword: profile.isPasswordProtected,
  };
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    profiles,
    isLoading: profilesLoading,
    refetch: refetchProfiles,
  } = useMyProfiles();
  const { academicYears } = useAcademicYears();
  const { unpublish } = useUnpublishProfile();
  const { deleteProfileAsync, isLoading: isDeleting } = useDeleteProfile();

  const isLoading = authLoading || profilesLoading;
  const router = useRouter();
  const { welcomeHeader, filesSection } = dashboardContent;

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FileStatus | null>(null);

  // Password modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<"set" | "change">(
    "set",
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editDataModalOpen, setEditDataModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [fileToEdit, setFileToEdit] = useState<string | null>(null);

  // Map profiles to file data and filter
  const fileData = useMemo(() => {
    return profiles.map(mapProfileToFileData);
  }, [profiles]);

  const filteredFiles = useMemo(() => {
    return fileData.filter((file) => {
      if (selectedYear && file.year !== selectedYear) return false;
      if (selectedStatus && file.status !== selectedStatus) return false;
      return true;
    });
  }, [fileData, selectedYear, selectedStatus]);

  const handleSetPassword = (fileId: string) => {
    setSelectedFileId(fileId);
    setPasswordModalMode("set");
    setPasswordModalOpen(true);
  };

  const handleChangePassword = (fileId: string) => {
    setSelectedFileId(fileId);
    setPasswordModalMode("change");
    setPasswordModalOpen(true);
  };

  const handleActivatePassword = (password: string) => {
    console.log("Activating password for file:", selectedFileId, password);
    setPasswordModalOpen(false);
  };

  const handleSavePasswordChanges = (password: string) => {
    console.log("Saving password changes for file:", selectedFileId, password);
    setPasswordModalOpen(false);
  };

  const handleDeactivatePassword = () => {
    console.log("Deactivating password for file:", selectedFileId);
    setPasswordModalOpen(false);
  };

  // Delete file handlers
  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      const response = await deleteProfileAsync(Number(fileToDelete));
      if (response.status) {
        // Refetch profiles to update the list
        refetchProfiles();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  // Edit basic data warning handlers
  const handleEditBasicDataClick = (fileId: string) => {
    setFileToEdit(fileId);
    setEditDataModalOpen(true);
  };

  const handleConfirmEditBasicData = () => {
    if (fileToEdit) {
      // Find the profile to pass to the edit page
      const profile = profiles.find((p) => String(p.id) === fileToEdit);
      if (profile) {
        // Build URL with profile data as search params
        const params = new URLSearchParams({
          edit: "true",
          fileId: String(profile.id),
          year: profile.academicYearName || "",
          jobRank: getProfileJobRank(profile),
        });
        router.push(`${ROUTES.DASHBOARD_PROFILE_NEW}?${params.toString()}`);
      }
    }
    setEditDataModalOpen(false);
    setFileToEdit(null);
  };

  const handleUnpublish = async (fileId: string) => {
    try {
      const response = await unpublish(Number(fileId));
      // Refetch profiles after unpublishing
      refetchProfiles();
    } catch (error) {
      console.error("Error unpublishing profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="text-right" dir="rtl">
      {/* Main content area */}
      <div className="flex gap-6">
        {/* Files section - main content */}
        <div className="flex-1">
          {/* Files header */}
          <h2 className="text-xl font-semibold text-secondary-800 mb-6">
            {filesSection.title}
          </h2>

          {/* Files grid */}
          {filteredFiles.length > 0 ? (
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onAddEvidence={(id) =>
                    router.push(ROUTES.DASHBOARD_PROFILE_SECTIONS(id))
                  }
                  onPreview={(id) => router.push(ROUTES.PROFILE_PREVIEW(id))}
                  onEditBasicData={handleEditBasicDataClick}
                  onEditMyData={(id) => console.log("Edit my data:", id)}
                  onSetPassword={handleSetPassword}
                  onChangePassword={handleChangePassword}
                  onUnpublish={handleUnpublish}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAFAFA] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
              <Image
                src="/images/dashboard/empty-files.svg"
                alt=""
                width={280}
                height={200}
                className="w-full max-w-[280px] h-auto mb-6"
              />
              <p className="text-secondary-800 text-lg md:text-[28px] font-normal mb-2">
                {filesSection.emptyStateTitle}
              </p>
              <p className="text-sm md:text-[20px] font-light text-[#4D4D4D] mb-6">
                {filesSection.emptyStateSubtitle}
              </p>
              <Link
                href={ROUTES.DASHBOARD_PROFILE_NEW}
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-primary-500 text-white text-base md:text-lg font-light hover:bg-primary-800 transition-colors"
              >
                <CirclePlus className="w-5 h-5" />
                {filesSection.emptyStateButton}
              </Link>
            </div>
          )}
        </div>

        {/* Filters sidebar - left side */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FileFilters
            years={academicYears.map((y) => y.yearName)}
            selectedYear={selectedYear}
            selectedStatus={selectedStatus}
            onYearChange={setSelectedYear}
            onStatusChange={setSelectedStatus}
            onApplyFilters={() => {
              console.log("Applying filters:", {
                selectedYear,
                selectedStatus,
              });
            }}
          />
        </div>
      </div>

      {/* File Password Modal */}
      <FilePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        mode={passwordModalMode}
        onActivate={handleActivatePassword}
        onSaveChanges={handleSavePasswordChanges}
        onDeactivate={handleDeactivatePassword}
      />

      {/* Delete File Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setFileToDelete(null);
          }
        }}
        title={dashboardContent.modals.deleteFile.title}
        confirmText={dashboardContent.modals.deleteFile.confirm}
        cancelText={dashboardContent.modals.deleteFile.cancel}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Edit Basic Data Warning Modal */}
      <ConfirmationModal
        isOpen={editDataModalOpen}
        onClose={() => {
          setEditDataModalOpen(false);
          setFileToEdit(null);
        }}
        title={dashboardContent.modals.editDataWarning.title}
        message={dashboardContent.modals.editDataWarning.message}
        confirmText={dashboardContent.modals.editDataWarning.confirm}
        cancelText={dashboardContent.modals.editDataWarning.cancel}
        onConfirm={handleConfirmEditBasicData}
        variant="warning"
      />
    </div>
  );
}
