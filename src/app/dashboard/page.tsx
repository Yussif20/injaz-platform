"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  useSetProfilePassword,
  useRemoveProfilePassword,
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

// Helper function to map Profile to FileData
function mapProfileToFileData(profile: Profile): FileData {
  return {
    id: String(profile.id),
    title: profile.profileTypeName || "ملف",
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
  const { setPasswordAsync, isLoading: isSettingPassword } = useSetProfilePassword();
  const { removePasswordAsync, isLoading: isRemovingPassword } = useRemoveProfilePassword();

  const isLoading = authLoading || profilesLoading;
  const router = useRouter();
  const { welcomeHeader, filesSection, filters, fileStatus } = dashboardContent;
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FileStatus | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [yearSectionExpanded, setYearSectionExpanded] = useState(false);
  const [statusSectionExpanded, setStatusSectionExpanded] = useState(false);

  // Position dropdown when opened (fixed, so it's never cropped by parent overflow)
  useEffect(() => {
    if (!filterDropdownOpen || !filterButtonRef.current) {
      setDropdownPosition(null);
      return;
    }
    const updatePosition = () => {
      if (!filterButtonRef.current) return;
      const rect = filterButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [filterDropdownOpen]);

  // Close mobile filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterDropdownOpen &&
        filterButtonRef.current &&
        !filterDropdownRef.current?.contains(e.target as Node) &&
        !filterButtonRef.current.contains(e.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownOpen]);

  // Password modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<"set" | "change">("set");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswordToast, setShowPasswordToast] = useState<string | null>(null);

  // Confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editDataModalOpen, setEditDataModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [fileToEdit, setFileToEdit] = useState<string | null>(null);

  // Map profiles to file data and filter
  const fileData = useMemo(() => {
    return profiles.map((p) => mapProfileToFileData(p));
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

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setSelectedFileId(null);
    setPasswordError(null);
  };

  const handleActivatePassword = async (password: string) => {
    if (!selectedFileId) return;
    setPasswordError(null);
    try {
      const res = await setPasswordAsync({
        profileId: Number(selectedFileId),
        data: { password, confirmPassword: password },
      });
      if (res.status) {
        closePasswordModal();
        setShowPasswordToast("تم تعيين كلمة المرور بنجاح");
        setTimeout(() => setShowPasswordToast(null), 3000);
      } else {
        setPasswordError(res.message || "فشل تعيين كلمة المرور");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    }
  };

  const handleSavePasswordChanges = async (password: string) => {
    if (!selectedFileId) return;
    setPasswordError(null);
    try {
      const res = await setPasswordAsync({
        profileId: Number(selectedFileId),
        data: { password, confirmPassword: password },
      });
      if (res.status) {
        closePasswordModal();
        setShowPasswordToast("تم تحديث كلمة المرور بنجاح");
        setTimeout(() => setShowPasswordToast(null), 3000);
      } else {
        setPasswordError(res.message || "فشل تحديث كلمة المرور");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    }
  };

  const handleDeactivatePassword = async () => {
    if (!selectedFileId) return;
    setPasswordError(null);
    try {
      const res = await removePasswordAsync(Number(selectedFileId));
      if (res.status) {
        closePasswordModal();
        setShowPasswordToast("تم إلغاء كلمة المرور بنجاح");
        setTimeout(() => setShowPasswordToast(null), 3000);
      } else {
        setPasswordError(res.message || "فشل إلغاء كلمة المرور");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    }
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
        const params = new URLSearchParams({
          edit: "true",
          fileId: String(profile.id),
          year: profile.academicYearName || "",
          profileTypeId: String(profile.profileTypeId),
          imageUrl: profile.imageUrl || "",
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
    <div className="text-right min-w-0 overflow-x-hidden" dir="rtl">
      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Files section - main content */}
        <div className="flex-1 min-w-0">
          {/* Files header + mobile/tablet filter button */}
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-800">
              {filesSection.title}
            </h2>
            {/* Filter button - visible only when sidebar is hidden (mobile/tablet) */}
            <div className="lg:hidden">
              <button
                ref={filterButtonRef}
                type="button"
                onClick={() => setFilterDropdownOpen((o) => !o)}
                className="flex items-center justify-center p-2 text-grey-600 hover:text-grey-800 transition-colors"
                aria-label={filters.filterByYear}
                aria-expanded={filterDropdownOpen}
              >
                <Image
                  src="/images/dashboard/filter.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* Filter dropdown - rendered in portal with fixed position so it's never cropped */}
          {filterDropdownOpen &&
            dropdownPosition &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                ref={filterDropdownRef}
                className="w-72 max-w-[calc(100vw-2rem)] overflow-y-auto bg-white rounded-xl border border-grey-200 shadow-lg z-[100]"
                style={{
                  position: "fixed",
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  maxHeight: "min(70vh, 400px)",
                }}
              >
                  {/* تصنيف حسب السنة */}
                  <div className="border-b border-grey-100">
                    <button
                      type="button"
                      onClick={() => setYearSectionExpanded((e) => !e)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-secondary-800">
                        {filters.filterByYear}
                      </span>
                      <svg
                        className={`w-5 h-5 text-grey-500 transition-transform ${yearSectionExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {yearSectionExpanded && (
                      <div className="px-4 pb-3 space-y-1.5">
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input
                            type="radio"
                            name="mobile-year"
                            checked={selectedYear === null}
                            onChange={() => setSelectedYear(null)}
                            className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                          />
                          <span className="text-sm text-grey-600">{filters.allYears}</span>
                        </label>
                        {academicYears.map((y) => (
                          <label key={y.id} className="flex items-center gap-3 cursor-pointer py-2">
                            <input
                              type="radio"
                              name="mobile-year"
                              checked={selectedYear === y.yearName}
                              onChange={() => setSelectedYear(y.yearName)}
                              className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                            />
                            <span className="text-sm text-grey-600">{y.yearName}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* تصنيف حسب حالة الملف */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setStatusSectionExpanded((e) => !e)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-right hover:bg-grey-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-secondary-800">
                        {filters.filterByStatus}
                      </span>
                      <svg
                        className={`w-5 h-5 text-grey-500 transition-transform ${statusSectionExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {statusSectionExpanded && (
                      <div className="px-4 pb-3 space-y-1.5">
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input
                            type="radio"
                            name="mobile-status"
                            checked={selectedStatus === null}
                            onChange={() => setSelectedStatus(null)}
                            className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                          />
                          <span className="text-sm text-grey-600">{filters.allStatuses}</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input
                            type="radio"
                            name="mobile-status"
                            checked={selectedStatus === "incomplete"}
                            onChange={() => setSelectedStatus("incomplete")}
                            className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                          <span className="text-sm text-warning-500">{fileStatus.incomplete}</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input
                            type="radio"
                            name="mobile-status"
                            checked={selectedStatus === "unpublished"}
                            onChange={() => setSelectedStatus("unpublished")}
                            className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-grey-400" />
                          <span className="text-sm text-grey-500">{fileStatus.unpublished}</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                          <input
                            type="radio"
                            name="mobile-status"
                            checked={selectedStatus === "published"}
                            onChange={() => setSelectedStatus("published")}
                            className="w-4 h-4 text-primary-500 border-grey-300 focus:ring-primary-500"
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
                          <span className="text-sm text-success-500">{fileStatus.published}</span>
                        </label>
                      </div>
                    )}
                  </div>
              </div>,
              document.body
            )}

          {/* Files grid */}
          {filteredFiles.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onAddEvidence={(id) =>
                    router.push(ROUTES.DASHBOARD_PROFILE_SECTIONS(id))
                  }
                  onPreview={(id) => router.push(ROUTES.PROFILE_PREVIEW(id))}
                  onEditBasicData={handleEditBasicDataClick}
                  onEditMyData={() =>
                    router.push(ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL)
                  }
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
        onClose={closePasswordModal}
        mode={passwordModalMode}
        onActivate={handleActivatePassword}
        onSaveChanges={handleSavePasswordChanges}
        onDeactivate={handleDeactivatePassword}
        isLoading={isSettingPassword || isRemovingPassword}
        error={passwordError}
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

      {/* Password success toast */}
      {showPasswordToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {showPasswordToast}
        </div>
      )}
    </div>
  );
}
