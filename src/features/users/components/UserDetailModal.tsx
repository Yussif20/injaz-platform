"use client";

import Image from "next/image";
import { Modal, StatusBadge } from "@/shared/components/ui";
import type { UserDto } from "../types/users.types";
import { Gender } from "@/shared/types";

// Helper to validate image URLs
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDto | null;
}

export function UserDetailModal({
  isOpen,
  onClose,
  user,
}: UserDetailModalProps) {
  // Users-specific translations (fallback inline)
  const detailT = {
    title: "تفاصيل العميل",
    basicInfo: "المعلومات الأساسية",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    role: "الدور",
    gender: "الجنس",
    status: "الحالة",
    subscribed: "الاشتراك",
    createdAt: "تاريخ التسجيل",
    lastLogin: "آخر دخول",
    personalInfo: "المعلومات الشخصية",
    rank: "الرتبة",
    nationalId: "الهوية الوطنية",
    birthDate: "تاريخ الميلاد",
    address: "العنوان",
    email: "البريد الإلكتروني",
    qualifications: "المؤهلات",
    degreeType: "نوع الشهادة",
    qualTitle: "المسمى",
    graduationDate: "تاريخ التخرج",
    careerJobs: "الخبرات الوظيفية",
    school: "المدرسة",
    educationalStage: "المرحلة",
    startYear: "سنة البدء",
    endYear: "سنة الانتهاء",
    admin: "مدير",
    teacher: "معلم",
    male: "ذكر",
    female: "أنثى",
    active: "نشط",
    inactive: "غير نشط",
    subscribedLabel: "مشترك",
    notSubscribed: "غير مشترك",
    noData: "لا توجد بيانات",
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={detailT.title}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header with avatar */}
        <div className="flex items-center gap-4">
          {isValidImageUrl(user.imageUrl) ? (
            <Image
              src={user.imageUrl}
              alt={user.fullName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl text-primary-600">
              {user.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-text-dark">
              {user.fullName}
            </h3>
            <p className="text-sm text-grey-500" dir="ltr">
              {user.phone}
            </p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-lg border border-grey-200 p-4">
          <h4 className="mb-3 text-sm font-medium text-grey-700">
            {detailT.basicInfo}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow
              label={detailT.role}
              value={user.role === "Admin" ? detailT.admin : detailT.teacher}
            />
            <InfoRow
              label={detailT.gender}
              value={
                user.gender === Gender.Male ? detailT.male : detailT.female
              }
            />
            <div>
              <span className="text-grey-500">{detailT.status}</span>
              <div className="mt-1">
                <StatusBadge
                  label={user.isActive ? detailT.active : detailT.inactive}
                  variant={user.isActive ? "success" : "neutral"}
                />
              </div>
            </div>
            <div>
              <span className="text-grey-500">{detailT.subscribed}</span>
              <div className="mt-1">
                <StatusBadge
                  label={
                    user.isSubscribed
                      ? detailT.subscribedLabel
                      : detailT.notSubscribed
                  }
                  variant={user.isSubscribed ? "info" : "neutral"}
                />
              </div>
            </div>
            <InfoRow
              label={detailT.createdAt}
              value={new Date(user.createdAt).toLocaleDateString("ar-SA")}
            />
            <InfoRow
              label={detailT.lastLogin}
              value={
                user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString("ar-SA")
                  : detailT.noData
              }
            />
          </div>
        </div>

        {/* Personal Info */}
        {user.personalInfo && (
          <div className="rounded-lg border border-grey-200 p-4">
            <h4 className="mb-3 text-sm font-medium text-grey-700">
              {detailT.personalInfo}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow
                label={detailT.rank}
                value={user.personalInfo.rankTitle || detailT.noData}
              />
              <InfoRow
                label={detailT.nationalId}
                value={user.personalInfo.nationalId || detailT.noData}
              />
              <InfoRow
                label={detailT.birthDate}
                value={
                  user.personalInfo.birthDate
                    ? new Date(user.personalInfo.birthDate).toLocaleDateString(
                        "ar-SA",
                      )
                    : detailT.noData
                }
              />
              <InfoRow
                label={detailT.email}
                value={user.personalInfo.email || detailT.noData}
              />
              <InfoRow
                label={detailT.address}
                value={user.personalInfo.address || detailT.noData}
                className="col-span-2"
              />
            </div>
          </div>
        )}

        {/* Qualifications */}
        {user.qualifications && user.qualifications.length > 0 && (
          <div className="rounded-lg border border-grey-200 p-4">
            <h4 className="mb-3 text-sm font-medium text-grey-700">
              {detailT.qualifications}
            </h4>
            <div className="space-y-3">
              {user.qualifications.map((qual) => (
                <div
                  key={qual.id}
                  className="rounded-lg bg-grey-50 p-3 text-sm"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <InfoRow
                      label={detailT.degreeType}
                      value={qual.degreeType ?? "—"}
                    />
                    <InfoRow label={detailT.qualTitle} value={qual.major || qual.title || "—"} />
                    <InfoRow
                      label={detailT.graduationDate}
                      value={new Date(qual.graduationDate).toLocaleDateString(
                        "ar-SA",
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Jobs */}
        {user.careerJobs && user.careerJobs.length > 0 && (
          <div className="rounded-lg border border-grey-200 p-4">
            <h4 className="mb-3 text-sm font-medium text-grey-700">
              {detailT.careerJobs}
            </h4>
            <div className="space-y-3">
              {user.careerJobs.map((job) => (
                <div key={job.id} className="rounded-lg bg-grey-50 p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <InfoRow label={detailT.school} value={job.school} />
                    <InfoRow
                      label={detailT.educationalStage}
                      value={job.educationalStage}
                    />
                    <InfoRow label={detailT.startYear} value={job.startYear} />
                    <InfoRow
                      label={detailT.endYear}
                      value={job.endYear || detailT.noData}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-grey-500">{label}</span>
      <p className="mt-0.5 text-text-dark">{value}</p>
    </div>
  );
}
