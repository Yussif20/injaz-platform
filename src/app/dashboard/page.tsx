"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import {
  FileCard,
  FileFilters,
  FilePasswordModal,
  ConfirmationModal,
  FileData,
  FileStatus,
} from "@/features/dashboard";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

// Mock data for demonstration
const mockFiles: FileData[] = [
  {
    id: "1",
    title: "معلم خبير",
    ownerName: "محمد أحمد العتيبي",
    year: "2023",
    creationDate: "19/6/2020",
    status: "incomplete",
    hasPassword: false,
  },
  {
    id: "2",
    title: "معلم خبير",
    ownerName: "محمد أحمد العتيبي",
    year: "2023",
    creationDate: "19/6/2020",
    status: "unpublished",
    hasPassword: false,
  },
  {
    id: "3",
    title: "معلم خبير",
    ownerName: "محمد أحمد العتيبي",
    year: "2023",
    creationDate: "19/6/2020",
    status: "published",
    hasPassword: true,
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { welcomeHeader, filesSection } = dashboardContent;

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FileStatus | null>(null);
  const [dateType, setDateType] = useState<"gregorian" | "hijri">("gregorian");

  // Password modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<"set" | "change">("set");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editDataModalOpen, setEditDataModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [fileToEdit, setFileToEdit] = useState<string | null>(null);

  // Filter files based on selected filters
  const filteredFiles = mockFiles.filter((file) => {
    if (selectedYear && file.year !== selectedYear) return false;
    if (selectedStatus && file.status !== selectedStatus) return false;
    return true;
  });

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

  const handleConfirmDelete = () => {
    console.log("Deleting file:", fileToDelete);
    // TODO: Implement actual delete logic
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  // Edit basic data warning handlers
  const handleEditBasicDataClick = (fileId: string) => {
    setFileToEdit(fileId);
    setEditDataModalOpen(true);
  };

  const handleConfirmEditBasicData = () => {
    if (fileToEdit) {
      // Find the file data to pass to the edit page
      const fileData = mockFiles.find((f) => f.id === fileToEdit);
      if (fileData) {
        // Build URL with file data as search params
        const params = new URLSearchParams({
          edit: "true",
          fileId: fileData.id,
          year: fileData.year,
          jobRank: fileData.title,
        });
        router.push(`${ROUTES.DASHBOARD_PROFILE_NEW}?${params.toString()}`);
      }
    }
    setEditDataModalOpen(false);
    setFileToEdit(null);
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
      {/* Welcome Header */}
      <div className="flex items-center justify-end gap-4 mb-8">
        <div className="text-right">
          <h1 className="text-xl font-semibold text-secondary-800">
            {welcomeHeader.greeting} {user?.fullName || "محمد"}
            <span className="mr-2">&#128075;</span>
          </h1>
          <p className="text-grey-500 text-sm">{welcomeHeader.subtext}</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-grey-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <Image
            src="/icons/user.svg"
            alt="صورة الملف الشخصي"
            width={32}
            height={32}
            className="opacity-50"
          />
        </div>
      </div>

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
                  onAddEvidence={(id) => console.log("Add evidence:", id)}
                  onPreview={(id) => console.log("Preview:", id)}
                  onEditBasicData={handleEditBasicDataClick}
                  onEditMyData={(id) => console.log("Edit my data:", id)}
                  onSetPassword={handleSetPassword}
                  onChangePassword={handleChangePassword}
                  onUnpublish={(id) => console.log("Unpublish:", id)}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-grey-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-grey-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-grey-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-grey-500 mb-4">{filesSection.noFiles}</p>
              <Link
                href={ROUTES.DASHBOARD_PROFILE_NEW}
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {filesSection.createFirstFile}
              </Link>
            </div>
          )}
        </div>

        {/* Filters sidebar - left side */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FileFilters
            selectedYear={selectedYear}
            selectedStatus={selectedStatus}
            dateType={dateType}
            onYearChange={setSelectedYear}
            onStatusChange={setSelectedStatus}
            onDateTypeChange={setDateType}
            onApplyFilters={() => {
              console.log("Applying filters:", {
                selectedYear,
                selectedStatus,
                dateType,
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
          setDeleteModalOpen(false);
          setFileToDelete(null);
        }}
        title={dashboardContent.modals.deleteFile.title}
        confirmText={dashboardContent.modals.deleteFile.confirm}
        cancelText={dashboardContent.modals.deleteFile.cancel}
        onConfirm={handleConfirmDelete}
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
