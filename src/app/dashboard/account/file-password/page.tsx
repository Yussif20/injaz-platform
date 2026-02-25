"use client";

import React, { useMemo, useState } from "react";
import {
  FileCard,
  FileData,
  FilePasswordModal,
  FileStatus,
} from "@/features/dashboard";
import { useMyProfiles } from "@/features/profiles";
import { dashboardContent } from "@/content";
import type { Profile } from "@/features/profiles/types";

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

const PASSWORD_BUTTON_LABELS = {
  withPassword: "اعدادات كلمة مرور الملف",
  withoutPassword: "تعيين كلمة مرور للملف",
} as const;

export default function FilePasswordPage() {
  const { profiles, isLoading } = useMyProfiles();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<"set" | "change">(
    "set"
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const fileData = useMemo(() => profiles.map(mapProfileToFileData), [profiles]);

  const handlePasswordAction = (fileId: string) => {
    const file = fileData.find((f) => f.id === fileId);
    setSelectedFileId(fileId);
    setPasswordModalMode(file?.hasPassword ? "change" : "set");
    setPasswordModalOpen(true);
  };

  const handleActivatePassword = (password: string) => {
    console.log("Activating password for file:", selectedFileId, password);
    setPasswordModalOpen(false);
    setSelectedFileId(null);
  };

  const handleSavePasswordChanges = (password: string) => {
    console.log("Saving password changes for file:", selectedFileId, password);
    setPasswordModalOpen(false);
    setSelectedFileId(null);
  };

  const handleDeactivatePassword = () => {
    console.log("Deactivating password for file:", selectedFileId);
    setPasswordModalOpen(false);
    setSelectedFileId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-6 lg:p-8 min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        {fileData.length === 0 ? (
          <p className="text-grey-500 text-center py-8 text-sm sm:text-base">
            لا توجد ملفات لعرضها
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {fileData.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                singleActionLabel={
                  file.hasPassword
                    ? PASSWORD_BUTTON_LABELS.withPassword
                    : PASSWORD_BUTTON_LABELS.withoutPassword
                }
                onSingleAction={handlePasswordAction}
              />
            ))}
          </div>
        )}
      </div>

      <FilePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setSelectedFileId(null);
        }}
        mode={passwordModalMode}
        onActivate={handleActivatePassword}
        onSaveChanges={handleSavePasswordChanges}
        onDeactivate={handleDeactivatePassword}
      />
    </>
  );
}
