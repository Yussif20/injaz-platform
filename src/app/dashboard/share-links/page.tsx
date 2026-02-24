/**
 * Share Links Management Test Page
 * Simple page to test share links API endpoints
 */

"use client";

import { useState } from "react";
import {
  useMyProfiles,
  useShareLinks,
  useCreateShareLink,
  useDeleteShareLink,
} from "@/features/profiles";
import type { ShareLink } from "@/features/profiles/types";

export default function ShareLinksPage() {
  // State
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  // Hooks
  const { profiles, isLoading: profilesLoading } = useMyProfiles();
  const { shareLinks, isLoading: linksLoading, refetch: refetchLinks } = useShareLinks(selectedProfileId);
  const { createShareLinkAsync, isLoading: createLoading } = useCreateShareLink();
  const { deleteShareLinkAsync, isLoading: deleteLoading } = useDeleteShareLink();

  // Handle profile selection
  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    setMessage(null);
  };

  // Handle create share link
  const handleCreateLink = async () => {
    if (!selectedProfileId) {
      setMessage({ type: "error", text: "يرجى اختيار ملف أولاً" });
      return;
    }

    try {
      const response = await createShareLinkAsync({
        profileId: selectedProfileId,
        expiresAt: expiryDate || undefined,
      });

      if (response.status === "Success") {
        setMessage({ type: "success", text: "تم إنشاء رابط المشاركة بنجاح" });
        setExpiryDate("");
        refetchLinks();
      } else {
        setMessage({ type: "error", text: response.message || "فشل في إنشاء الرابط" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء إنشاء الرابط" });
    }
  };

  // Handle delete share link
  const handleDeleteLink = async (linkId: number) => {
    if (!selectedProfileId) return;

    try {
      const response = await deleteShareLinkAsync({
        linkId,
        profileId: selectedProfileId,
      });

      if (response.status === "Success") {
        setMessage({ type: "success", text: "تم حذف رابط المشاركة بنجاح" });
        refetchLinks();
      } else {
        setMessage({ type: "error", text: response.message || "فشل في حذف الرابط" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف الرابط" });
    }
  };

  // Handle copy link
  const handleCopyLink = async (link: ShareLink) => {
    const url = link.shareUrl || `${window.location.origin}/profile/${link.token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "بدون انتهاء";
    try {
      return new Date(dateString).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get selected profile
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  return (
    <div className="text-right" dir="rtl">
      <h1 className="text-2xl font-bold text-secondary-800 mb-6">
        روابط المشاركة (صفحة اختبار)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Profile Selection */}
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <h2 className="text-lg font-semibold mb-4">اختر الملف</h2>

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
                  <div className={`text-xs mt-1 ${
                    profile.status === "Published" ? "text-green-600" : "text-orange-600"
                  }`}>
                    {profile.status === "Published" ? "منشور - يمكن المشاركة" : "غير منشور"}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Create Link Form */}
          {selectedProfileId && selectedProfile?.status === "Published" && (
            <div className="mt-6 pt-4 border-t border-grey-200">
              <h3 className="text-sm font-medium mb-3">إنشاء رابط جديد</h3>

              <div className="mb-3">
                <label className="block text-sm text-grey-600 mb-1">
                  تاريخ الانتهاء (اختياري)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border border-grey-200 rounded text-sm"
                />
              </div>

              <button
                onClick={handleCreateLink}
                disabled={createLoading}
                className="w-full bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? "جاري الإنشاء..." : "إنشاء رابط مشاركة"}
              </button>
            </div>
          )}

          {selectedProfileId && selectedProfile?.status !== "Published" && (
            <div className="mt-6 pt-4 border-t border-grey-200">
              <p className="text-sm text-orange-600">
                يجب نشر الملف أولاً قبل إمكانية إنشاء روابط مشاركة
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Share Links List */}
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <h2 className="text-lg font-semibold mb-4">روابط المشاركة</h2>

          {!selectedProfileId ? (
            <div className="text-center py-4 text-grey-500">اختر ملف لعرض الروابط</div>
          ) : linksLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : shareLinks.length === 0 ? (
            <div className="text-center py-4 text-grey-500">لا توجد روابط مشاركة</div>
          ) : (
            <div className="space-y-3">
              {shareLinks.map((link: ShareLink) => (
                <div
                  key={link.id}
                  className="border border-grey-200 rounded-lg p-3"
                >
                  {/* Link info */}
                  <div className="text-sm mb-2">
                    <div className="font-mono text-xs bg-grey-100 p-2 rounded mb-2 break-all">
                      {link.shareUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${link.token}`}
                    </div>
                    <div className="flex justify-between text-grey-500">
                      <span>عدد الزيارات: {link.accessCount}</span>
                      <span>الانتهاء: {formatDate(link.expiresAt)}</span>
                    </div>
                    <div className="text-grey-400 text-xs mt-1">
                      تم الإنشاء: {formatDate(link.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyLink(link)}
                      className="flex-1 bg-primary-100 text-primary-700 py-1 px-3 rounded text-sm hover:bg-primary-200"
                    >
                      {copiedLinkId === link.id ? "تم النسخ!" : "نسخ الرابط"}
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      disabled={deleteLoading}
                      className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-6 bg-grey-100 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2">بيانات التصحيح:</h3>
        <pre className="text-xs overflow-auto max-h-32 bg-white p-2 rounded">
          {JSON.stringify(
            {
              selectedProfileId,
              profilesCount: profiles.length,
              shareLinksCount: shareLinks.length,
              selectedProfileStatus: selectedProfile?.status,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
