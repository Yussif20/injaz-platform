"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreateFileForm,
  MobilePromoSidebar,
  EditFileData,
} from "@/features/dashboard";
import { ROUTES } from "@/config";

function CreateFileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if we're in edit mode
  const isEditMode = searchParams.get("edit") === "true";
  const fileId = searchParams.get("fileId");
  const year = searchParams.get("year");
  const jobRank = searchParams.get("jobRank");
  const imageUrl = searchParams.get("imageUrl");

  // Build initial data for edit mode
  const initialData: EditFileData | undefined =
    isEditMode && fileId
      ? {
          id: fileId,
          year: year || "",
          jobRank: jobRank || "",
          imageUrl: imageUrl || undefined,
        }
      : undefined;

  const handleSubmit = (
    data: { year: string; jobRank: string },
    editFileId?: string
  ) => {
    if (isEditMode && editFileId) {
      console.log("Saving changes for file:", editFileId, data);
      // TODO: Implement API call to update file
      router.push(ROUTES.DASHBOARD);
    } else {
      console.log("Creating new file:", data);
      // TODO: Implement API call to create file
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="flex gap-8" dir="rtl">
      {/* Main Form Area */}
      <div className="flex-1">
        <CreateFileForm
          isEditMode={isEditMode}
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Promotional Sidebar - Desktop Only */}
      <MobilePromoSidebar />
    </div>
  );
}

export default function CreateFilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <CreateFileContent />
    </Suspense>
  );
}
