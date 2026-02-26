"use client";

import React, { useMemo, useState } from "react";
import {
  FileCard,
  FileData,
  FilePasswordModal,
  FileStatus,
} from "@/features/dashboard";
import {
  useMyProfiles,
  useSetProfilePassword,
  useRemoveProfilePassword,
} from "@/features/profiles";
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
  const { setPasswordAsync, isLoading: isSettingPassword } = useSetProfilePassword();
  const { removePasswordAsync, isLoading: isRemovingPassword } = useRemoveProfilePassword();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<"set" | "change">("set");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileData = useMemo(() => profiles.map(mapProfileToFileData), [profiles]);

  const closeModal = () => {
    setPasswordModalOpen(false);
    setSelectedFileId(null);
    setPasswordError(null);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePasswordAction = (fileId: string) => {
    const file = fileData.find((f) => f.id === fileId);
    setSelectedFileId(fileId);
    setPasswordModalMode(file?.hasPassword ? "change" : "set");
    setPasswordError(null);
    setPasswordModalOpen(true);
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
        closeModal();
        showSuccess("تم تعيين كلمة المرور بنجاح");
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
        closeModal();
        showSuccess("تم تحديث كلمة المرور بنجاح");
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
        closeModal();
        showSuccess("تم إلغاء كلمة المرور بنجاح");
      } else {
        setPasswordError(res.message || "فشل إلغاء كلمة المرور");
      }
    } catch {
      setPasswordError("حدث خطأ، يرجى المحاولة مجدداً");
    }
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
                singleActionIcon={
                  file.hasPassword
                    ? "/icons/ui/white-up-right-arrow.svg"
                    : "/icons/ui/white-lock.svg"
                }
                onSingleAction={handlePasswordAction}
              />
            ))}
          </div>
        )}
      </div>

      <FilePasswordModal
        isOpen={passwordModalOpen}
        onClose={closeModal}
        mode={passwordModalMode}
        onActivate={handleActivatePassword}
        onSaveChanges={handleSavePasswordChanges}
        onDeactivate={handleDeactivatePassword}
        isLoading={isSettingPassword || isRemovingPassword}
        error={passwordError}
      />

      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {successMessage}
        </div>
      )}
    </>
  );
}
