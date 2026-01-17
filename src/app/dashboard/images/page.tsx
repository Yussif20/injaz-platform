/**
 * Images Management Test Page
 * Simple page to test image API endpoints
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useMyProfiles,
  useProfileDetails,
  useProfileImages,
  useUploadSubsectionImage,
  useDeleteImage,
  useReorderImages,
} from "@/features/profiles";
import type { ProfileImage } from "@/features/profiles/types";

export default function ImagesPage() {
  // State
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [selectedSubsectionId, setSelectedSubsectionId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Hooks
  const { profiles, isLoading: profilesLoading } = useMyProfiles();
  const { profileDetails, isLoading: detailsLoading } = useProfileDetails(selectedProfileId);
  const { images, isLoading: imagesLoading, refetch: refetchImages } = useProfileImages(selectedProfileId);
  const { uploadImageAsync, isLoading: uploadLoading } = useUploadSubsectionImage();
  const { deleteImageAsync, isLoading: deleteLoading } = useDeleteImage();
  const { reorderImagesAsync, isLoading: reorderLoading } = useReorderImages();

  // Get sections from profile details
  const sections = profileDetails?.sections ?? [];

  // Handle profile selection
  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    setSelectedSubsectionId(null);
    setMessage(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedProfileId || !selectedSubsectionId || !uploadFile) {
      setMessage({ type: "error", text: "يرجى اختيار ملف وقسم فرعي" });
      return;
    }

    try {
      const response = await uploadImageAsync({
        profileId: selectedProfileId,
        subsectionId: selectedSubsectionId,
        file: uploadFile,
        description: uploadDescription || undefined,
      });

      if (response.status === "Success") {
        setMessage({ type: "success", text: "تم رفع الصورة بنجاح" });
        setUploadFile(null);
        setUploadDescription("");
        refetchImages();
      } else {
        setMessage({ type: "error", text: response.message || "فشل في رفع الصورة" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء رفع الصورة" });
    }
  };

  // Handle image delete
  const handleDelete = async (imageId: number) => {
    if (!selectedProfileId) return;

    try {
      const response = await deleteImageAsync({
        imageId,
        profileId: selectedProfileId,
      });

      if (response.status === "Success") {
        setMessage({ type: "success", text: "تم حذف الصورة بنجاح" });
        refetchImages();
      } else {
        setMessage({ type: "error", text: response.message || "فشل في حذف الصورة" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف الصورة" });
    }
  };

  return (
    <div className="text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-secondary-800 mb-6">
        إدارة الصور (صفحة اختبار)
      </h1>

      {/* Message display */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Profile Selection */}
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <h2 className="text-lg font-semibold mb-4">الملفات الشخصية</h2>

          {profilesLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-4 text-grey-500">لا توجد ملفات</div>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile.id)}
                  className={`w-full text-right p-3 rounded-lg border transition-colors ${
                    selectedProfileId === profile.id
                      ? "bg-primary-50 border-primary-500"
                      : "border-grey-200 hover:bg-grey-50"
                  }`}
                >
                  <div className="font-medium">{profile.profileTypeName || "ملف"}</div>
                  <div className="text-sm text-grey-500">
                    {profile.academicYearName} - {profile.status}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Sections & Upload */}
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <h2 className="text-lg font-semibold mb-4">الأقسام ورفع الصور</h2>

          {!selectedProfileId ? (
            <div className="text-center py-4 text-grey-500">اختر ملف أولاً</div>
          ) : detailsLoading ? (
            <div className="text-center py-4">جاري تحميل الأقسام...</div>
          ) : sections.length === 0 ? (
            <div className="text-center py-4 text-grey-500">لا توجد أقسام</div>
          ) : (
            <>
              {/* Sections list */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">اختر القسم الفرعي:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sections.map((section) => (
                    <div key={section.id} className="border-b border-grey-100 pb-2">
                      <div className="font-medium text-sm text-grey-700 mb-1">
                        {section.title}
                      </div>
                      {section.subsections?.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setSelectedSubsectionId(subsection.id)}
                          className={`w-full text-right p-2 text-sm rounded ${
                            selectedSubsectionId === subsection.id
                              ? "bg-primary-100 text-primary-700"
                              : "hover:bg-grey-50"
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload form */}
              {selectedSubsectionId && (
                <div className="border-t border-grey-200 pt-4">
                  <h3 className="text-sm font-medium mb-3">رفع صورة جديدة</h3>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-grey-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 mb-3"
                  />

                  <input
                    type="text"
                    placeholder="وصف الصورة (اختياري)"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full p-2 border border-grey-200 rounded mb-3 text-sm"
                  />

                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploadLoading}
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? "جاري الرفع..." : "رفع الصورة"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Column 3: Images List */}
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <h2 className="text-lg font-semibold mb-4">الصور المرفوعة</h2>

          {!selectedProfileId ? (
            <div className="text-center py-4 text-grey-500">اختر ملف لعرض الصور</div>
          ) : imagesLoading ? (
            <div className="text-center py-4">جاري تحميل الصور...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-4 text-grey-500">لا توجد صور</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {images.map((image: ProfileImage) => (
                <div
                  key={image.id}
                  className="border border-grey-200 rounded-lg p-3"
                >
                  {/* Image preview */}
                  {image.publicUrl && (
                    <div className="relative w-full h-32 mb-2 bg-grey-100 rounded overflow-hidden">
                      <Image
                        src={image.publicUrl}
                        alt={image.description || "صورة"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Image info */}
                  <div className="text-sm">
                    <div className="text-grey-500">ID: {image.id}</div>
                    {image.description && (
                      <div className="text-grey-700">{image.description}</div>
                    )}
                    <div className="text-grey-500">الترتيب: {image.displayOrder}</div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deleteLoading}
                    className="mt-2 w-full bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleteLoading ? "جاري الحذف..." : "حذف"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Response Debug (optional - shows raw data) */}
      <div className="mt-6 bg-grey-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2">بيانات التصحيح:</h3>
        <pre className="text-xs overflow-auto max-h-48 bg-white p-2 rounded">
          {JSON.stringify(
            {
              selectedProfileId,
              selectedSubsectionId,
              profilesCount: profiles.length,
              sectionsCount: sections.length,
              imagesCount: images.length,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
