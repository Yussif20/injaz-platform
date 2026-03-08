"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft, Users, Pencil, MoreHorizontal, CheckCircle, Search, ExternalLink, Download, Share2 } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { Modal, Button } from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useUser, useUpdateUser } from "../hooks";
import { useFilteredSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";
import { useFilteredProfiles } from "@/features/profiles/hooks/useProfiles";
import { useProfileTypes } from "@/features/profile-types/hooks/useProfileTypes";
import type { UserDto } from "../types/users.types";
import type { SubscriptionDto as SubDto } from "@/features/subscriptions/types/subscriptions.types";
import { PaymentStatus } from "@/features/subscriptions/types/subscriptions.types";
import type { AdminProfileDto } from "@/features/profiles/types/profiles.types";
import { ProfileStatus } from "@/features/profiles/types/profiles.types";
import { Gender } from "@/shared/types";
import { formatDateDual, formatYearRangeDual } from "@/shared/lib/hijri-utils";

const STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ||
  "https://enjazmo3alem-staging.s3.us-east-005.backblazeb2.com";
const API_BASE_URL = "https://staging.enjazfile.com";

function normalizeImageUrl(path: string | null | undefined): string | null {
  if (!path || path.trim() === "") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  if (clean.startsWith("uploads/")) return `${STORAGE_BASE_URL}/${clean}`;
  return `${API_BASE_URL}/${clean}`;
}

type SideSection = "info" | "files" | "subscriptions";
type InfoTab = "registration" | "personal" | "academic" | "career";

interface UserDetailPageProps {
  userId: number;
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const sidebarT = t("dashboard").sidebar;
  const commonT = t("common") as Record<string, unknown>;

  const { data: user, isLoading, isError } = useUser(userId);

  // Fetch real subscription data for this user
  const { data: userSubsData } = useFilteredSubscriptions({
    IsActive: true,
    PageSize: 10000,
    PageNumber: 1,
  });

  const userSubscription = useMemo(() => {
    if (!userSubsData?.items) return null;
    return userSubsData.items.find((s) => s.userId === userId) ?? null;
  }, [userSubsData, userId]);

  // All subscriptions for this user (history)
  const { data: allSubsData } = useFilteredSubscriptions({
    PageSize: 10000,
    PageNumber: 1,
  });

  const userSubscriptions = useMemo(() => {
    if (!allSubsData?.items) return [];
    return allSubsData.items.filter((s) => s.userId === userId);
  }, [allSubsData, userId]);

  // Fetch rank from profiles data
  const { data: profilesData } = useFilteredProfiles({ PageSize: 1000 });
  const { data: profileTypes = [] } = useProfileTypes();

  const userRankName = useMemo(() => {
    const ptMap: Record<number, string> = {};
    profileTypes.forEach((pt) => {
      ptMap[pt.id] = pt.typeName;
    });
    if (!profilesData?.items) return null;
    const profile = profilesData.items.find((p) => p.userId === userId);
    if (!profile) return null;
    return ptMap[profile.profileTypeId] ?? profile.profileTypeName ?? null;
  }, [profilesData, profileTypes, userId]);

  // User's profiles (files)
  const userProfiles = useMemo(() => {
    if (!profilesData?.items) return [];
    return profilesData.items.filter((p) => p.userId === userId);
  }, [profilesData, userId]);

  const [activeSection, setActiveSection] = useState<SideSection>("info");
  const [activeTab, setActiveTab] = useState<InfoTab>("registration");

  const labels = {
    backLink: (commonT.goBack as string) ?? "العودة للسابق",
    pageTitle: sidebarT.users ?? "إدارة العملاء",
    sections: {
      info: "بيانات العميل",
      files: "ملفات العميل",
      subscriptions: "تاريخ الإشتراكات",
    },
    tabs: {
      registration: "بيانات التسجيل",
      personal: "بيانات شخصية",
      academic: "بيانات علمية",
      career: "بيانات وظيفية",
    },
    fields: {
      profilePicture: "الصورة الشخصية",
      name: "الإسم",
      email: "البريد الإلكتروني",
      phone: "رقم الجوال",
      gender: "النوع",
      rank: "الرتبة الوظيفية",
      nationalId: "الهوية الوطنية",
      birthDate: "تاريخ الميلاد",
      address: "العنوان",
      degreeType: "نوع الشهادة",
      qualTitle: "المسمى",
      graduationDate: "تاريخ التخرج",
      school: "المدرسة",
      educationalStage: "المرحلة التعليمية",
      startYear: "سنة البدء",
      endYear: "سنة الانتهاء",
    },
    male: "ذكر",
    female: "أنثى",
    subscribed: "مشترك",
    notSubscribed: "غير مشترك",
    noData: "لا يوجد",
    noFiles: "لا توجد ملفات",
    noSubscriptions: "لا توجد اشتراكات",
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-4">
        <p className="text-grey-500">حدث خطأ في تحميل بيانات العميل</p>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="text-primary-500 hover:underline"
        >
          {labels.backLink}
        </button>
      </div>
    );
  }

  const isSubscribed = !!userSubscription;

  return (
    <div dir="rtl">
      {/* Page Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center text-text-dark">
          <Users className="me-2 inline-block h-6 w-6" />
          <h1 className="text-xl font-normal">{labels.pageTitle}</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="flex items-center text-primary-500"
        >
          <h1 className="text-lg font-light">{labels.backLink}</h1>
          <ChevronLeft className="ms-2 inline-block h-6 w-6" />
        </button>
      </div>

      {/* Main Layout — sidebar on right (first in DOM for RTL) */}
      <div className="mt-8 flex gap-6">
        {/* Side Navigation (right in RTL) */}
        <aside className="w-52 shrink-0 min-h-[calc(100vh-10rem)] rounded-2xl bg-white p-4">
          <nav className="flex flex-col gap-1">
            {(
              [
                { key: "info", label: labels.sections.info },
                { key: "files", label: labels.sections.files },
                {
                  key: "subscriptions",
                  label: labels.sections.subscriptions,
                },
              ] as { key: SideSection; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveSection(key);
                  if (key === "info") setActiveTab("registration");
                }}
                className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                  activeSection === key
                    ? "bg-primary-50 font-medium text-primary-500"
                    : "text-grey-500 hover:bg-grey-50 hover:text-grey-700"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeSection === "info" && (
            <>
              {/* Tab Bar */}
              <div className="mb-6 flex gap-2 rounded-xl bg-white p-3">
                {(
                  [
                    "registration",
                    "personal",
                    "academic",
                    "career",
                  ] as InfoTab[]
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-2.5 transition-colors ${
                      activeTab === tab
                        ? "border-r-4 border-primary-500 bg-[#E3EFEF] text-primary-500"
                        : "bg-[#F2F2F2] text-grey-500 hover:bg-grey-200"
                    }`}
                  >
                    <span className="text-base">{labels.tabs[tab]}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "registration" && (
                <RegistrationTab
                  user={user}
                  labels={labels}
                  isSubscribed={isSubscribed}
                  subscription={userSubscription}
                />
              )}
              {activeTab === "personal" && (
                <PersonalTab
                  user={user}
                  labels={labels}
                  rankName={userRankName}
                />
              )}
              {activeTab === "academic" && (
                <AcademicTab user={user} labels={labels} />
              )}
              {activeTab === "career" && (
                <CareerTab user={user} labels={labels} />
              )}
            </>
          )}

          {activeSection === "files" && (
            <UserFilesSection
              profiles={userProfiles}
              user={user}
              labels={labels}
            />
          )}

          {activeSection === "subscriptions" && (
            <SubscriptionHistorySection
              subscriptions={userSubscriptions}
              labels={labels}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Registration Data ─── */
function RegistrationTab({
  user,
  labels,
  isSubscribed,
  subscription,
}: {
  user: UserDto;
  labels: Record<string, unknown>;
  isSubscribed: boolean;
  subscription: SubDto | null;
}) {
  const f = labels.fields as Record<string, string>;
  const imageUrl = normalizeImageUrl(user.imageUrl);

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [newName, setNewName] = useState(user.fullName);
  const [newEmail, setNewEmail] = useState(user.personalInfo?.email || "");
  const updateUser = useUpdateUser();

  const handleSaveName = () => {
    updateUser.mutate(
      {
        id: user.id,
        data: {
          fullName: newName,
          gender: user.gender,
          imageUrl: user.imageUrl,
          personalInfo: user.personalInfo,
          qualifications: user.qualifications,
          careerJobs: user.careerJobs,
        },
      },
      { onSuccess: () => setEditNameOpen(false) },
    );
  };

  const handleSaveEmail = () => {
    updateUser.mutate(
      {
        id: user.id,
        data: {
          fullName: user.fullName,
          gender: user.gender,
          imageUrl: user.imageUrl,
          personalInfo: user.personalInfo
            ? { ...user.personalInfo, email: newEmail }
            : { rankId: 0, rankTitleMale: "", rankTitleFemale: "", rankTitle: "", nationalId: "", birthDate: "", address: "", phoneNumber: "", email: newEmail },
          qualifications: user.qualifications,
          careerJobs: user.careerJobs,
        },
      },
      { onSuccess: () => setEditEmailOpen(false) },
    );
  };

  return (
    <div className="space-y-4">
      {/* Profile Picture Row */}
      <div className="flex items-center rounded-xl border border-grey-200 bg-white p-5">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl || "/logos/logo-cyan.svg"}
            alt={user.fullName}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-normal text-text-dark">
              {f.profilePicture}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${isSubscribed ? "bg-success-500" : "bg-grey-400"}`}
              />
              <span
                className={`text-lg font-light ${isSubscribed ? "text-success-600" : "text-text-muted"}`}
              >
                {isSubscribed
                  ? (labels.subscribed as string)
                  : (labels.notSubscribed as string)}
              </span>
              {isSubscribed && subscription?.expiresAt && (
                <span className="text-base font-light text-text-muted">
                  · ينتهي الإشتراك في: {formatDateDual(subscription.expiresAt.split("T")[0])}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <FieldCard label={f.name} value={user.fullName} onEdit={() => { setNewName(user.fullName); setEditNameOpen(true); }} />

      {/* Email */}
      <FieldCard
        label={f.email}
        value={user.personalInfo?.email || (labels.noData as string)}
        onEdit={() => { setNewEmail(user.personalInfo?.email || ""); setEditEmailOpen(true); }}
      />

      {/* Phone */}
      <FieldCard label={f.phone} value={user.phone} dir="ltr" />

      {/* Gender */}
      <FieldCard
        label={f.gender}
        value={
          user.gender === Gender.Male
            ? (labels.male as string)
            : (labels.female as string)
        }
      />

      {/* Edit Name Modal */}
      <EditFieldModal
        isOpen={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        title="تعديل الاسم"
        currentLabel="الاسم الحالي"
        currentValue={user.fullName}
        newLabel="الاسم الجديد"
        newValue={newName}
        onNewValueChange={setNewName}
        onSave={handleSaveName}
        isSaving={updateUser.isPending}
      />

      {/* Edit Email Modal */}
      <EditFieldModal
        isOpen={editEmailOpen}
        onClose={() => setEditEmailOpen(false)}
        title="تعديل البريد الإلكتروني"
        currentLabel="البريد الحالي"
        currentValue={user.personalInfo?.email || "—"}
        newLabel="البريد الجديد"
        newValue={newEmail}
        onNewValueChange={setNewEmail}
        onSave={handleSaveEmail}
        isSaving={updateUser.isPending}
        inputType="email"
        inputDir="ltr"
      />
    </div>
  );
}

/* ─── Tab: Personal Data ─── */
function PersonalTab({
  user,
  labels,
  rankName,
}: {
  user: UserDto;
  labels: Record<string, unknown>;
  rankName: string | null;
}) {
  const f = labels.fields as Record<string, string>;
  const noData = labels.noData as string;
  const info = user.personalInfo;

  return (
    <div className="space-y-4">
      <FieldCard label={f.rank} value={rankName ?? info?.rankTitle ?? noData} />
      <FieldCard
        label={f.nationalId}
        value={info?.nationalId || noData}
        dir="ltr"
      />
      <FieldCard
        label={f.birthDate}
        value={
          info?.birthDate
            ? formatDateDual(info.birthDate.split("T")[0])
            : noData
        }
      />
      <FieldCard label={f.address} value={info?.address || noData} />
    </div>
  );
}

/* ─── Tab: Academic Data ─── */
function AcademicTab({
  user,
  labels,
}: {
  user: UserDto;
  labels: Record<string, unknown>;
}) {
  const f = labels.fields as Record<string, string>;
  const noData = labels.noData as string;

  if (!user.qualifications || user.qualifications.length === 0) {
    return (
      <div className="rounded-xl border border-grey-200 bg-white p-8 text-center text-grey-400">
        {noData}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user.qualifications.map((qual, index) => {
        const majorOrTitle = qual.major || qual.title;
        const line1 = [qual.degreeType, majorOrTitle].filter(Boolean).join(" ");
        return (
          <div
            key={qual.id || index}
            className="flex items-center rounded-2xl border border-grey-200 bg-white p-5"
          >
            <div className="border-s-2 border-primary-500 ps-4">
              {line1 && (
                <p className="text-lg font-normal text-text-dark">{line1}</p>
              )}
              {qual.institution && (
                <p className="text-lg font-light text-text-muted">{qual.institution}</p>
              )}
              {qual.graduationDate && (
                <p className="text-lg font-light text-text-muted">
                  {formatDateDual(qual.graduationDate.split("T")[0])}
                </p>
              )}
              {!line1 && !qual.institution && !qual.graduationDate && (
                <p className="text-lg text-grey-400">{noData}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Tab: Career Data ─── */
function CareerTab({
  user,
  labels,
}: {
  user: UserDto;
  labels: Record<string, unknown>;
}) {
  const noData = labels.noData as string;

  if (!user.careerJobs || user.careerJobs.length === 0) {
    return (
      <div className="rounded-xl border border-grey-200 bg-white p-8 text-center text-grey-400">
        {noData}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user.careerJobs.map((job, index) => (
        <div
          key={job.id || index}
          className="flex items-center rounded-2xl border border-grey-200 bg-white p-5"
        >
          <div className="border-s-2 border-primary-500 ps-4">
            {job.school && (
              <p className="text-lg font-normal text-text-dark">{job.school}</p>
            )}
            {job.educationalStage && (
              <p className="text-lg font-light text-text-muted">{job.educationalStage}</p>
            )}
            {(job.startYear || job.endYear) && (
              <p className="text-lg font-light text-text-muted">
                {formatYearRangeDual(job.startYear, job.endYear)}
              </p>
            )}
            {!job.school && !job.educationalStage && !job.startYear && !job.endYear && (
              <p className="text-lg text-grey-400">{noData}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Section: User Files ─── */
function UserFilesSection({
  profiles,
  user,
  labels,
}: {
  profiles: AdminProfileDto[];
  user: UserDto;
  labels: Record<string, unknown>;
}) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery
    ? profiles.filter((p) => p.academicYearName?.includes(searchQuery))
    : profiles;

  const statusLabel = (s: ProfileStatus) => {
    switch (s) {
      case ProfileStatus.Published: return "ملف منشور";
      case ProfileStatus.Unpublished: return "ملف غير منشور";
      case ProfileStatus.Draft: return "مسودة";
      case ProfileStatus.PendingSubscription: return "بانتظار الإشتراك";
      default: return "—";
    }
  };

  const statusColor = (s: ProfileStatus) => {
    switch (s) {
      case ProfileStatus.Published: return "text-success-600";
      case ProfileStatus.Unpublished: return "text-warning-500";
      case ProfileStatus.Draft: return "text-grey-500";
      case ProfileStatus.PendingSubscription: return "text-primary-500";
      default: return "text-grey-500";
    }
  };

  const statusDot = (s: ProfileStatus) => {
    switch (s) {
      case ProfileStatus.Published: return "bg-success-500";
      case ProfileStatus.Unpublished: return "bg-warning-500";
      case ProfileStatus.Draft: return "bg-grey-400";
      case ProfileStatus.PendingSubscription: return "bg-primary-500";
      default: return "bg-grey-400";
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="rounded-xl border border-grey-200 bg-white p-8 text-center text-grey-400">
        {labels.noFiles as string}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count and search */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4">
        <h3 className="text-base font-medium text-text-dark">
          ملفات إنجاز العميل ({profiles.length})
        </h3>
        <div className="relative w-72">
          <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-grey-400" />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث هنا بالسنة الدراسية للملف"
            className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2 ps-10 pe-4 text-sm text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((profile) => (
          <div
            key={profile.id}
            className="rounded-xl bg-[#E3EFEF] p-6"
          >
            {/* Title */}
            <h4 className="mb-5 text-center text-base font-normal text-text-dark">
              ملف انجاز {profile.academicYearName}
            </h4>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-light text-text-dark">{user.fullName}</span>
                <span className="text-base font-light text-text-muted">{profile.profileTypeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-light text-text-muted">تاريخ الإنشاء:</span>
                <span className="text-base font-light text-text-muted">
                  {new Date(profile.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-light text-text-muted">حالة الملف:</span>
                <span className={`flex items-center gap-1.5 text-base font-light ${statusColor(profile.status)}`}>
                  <span className={`h-2 w-2 rounded-full ${statusDot(profile.status)}`} />
                  {statusLabel(profile.status)}
                </span>
              </div>
            </div>

            {/* View button */}
            <a
              href={profile.shareUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-3xl bg-primary-500 py-3 text-base font-light text-white transition-colors hover:bg-primary-800"
            >
              <ExternalLink className="h-4 w-4" />
              عرض الملف
            </a>

            {/* Action links */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  if (profile.shareUrl) {
                    navigator.clipboard.writeText(profile.shareUrl);
                    toast({ type: "success", message: "تم نسخ رابط الملف" });
                  }
                }}
                className="flex items-center gap-1.5 text-base font-light text-primary-500 hover:underline"
              >
                <Share2 className="h-4 w-4" />
                مشاركة الملف
              </button>
              <a
                href={profile.shareUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-base font-light text-primary-500 hover:underline"
              >
                <Download className="h-4 w-4" />
                تحميل الملف
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section: Subscription History ─── */
function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.Completed: return "ناجحة";
    case PaymentStatus.Failed: return "مرفوضة";
    case PaymentStatus.Cancelled: return "ملغاة";
    case PaymentStatus.Pending: return "معلقة";
    case PaymentStatus.Processing: return "قيد المعالجة";
    case PaymentStatus.Initiated: return "بدأت";
    default: return "غير معروف";
  }
}

function paymentStatusStyle(status: PaymentStatus): { color: string; backgroundColor: string } {
  switch (status) {
    case PaymentStatus.Completed:
      return { color: "#03960D", backgroundColor: "#E6FFE8" };
    case PaymentStatus.Failed:
    case PaymentStatus.Cancelled:
      return { color: "#B1363E", backgroundColor: "#F3D8DA" };
    default:
      return { color: "#6B7280", backgroundColor: "#F3F4F6" };
  }
}

function paymentMethodLabel(method: string): string {
  const m = method?.toLowerCase() ?? "";
  if (m.includes("visa")) return "VISA";
  if (m.includes("mada")) return "mada";
  if (m.includes("apple")) return "Apple Pay";
  if (m.includes("master")) return "Mastercard";
  if (m.includes("amex")) return "AMEX";
  return method || "—";
}

function SubscriptionHistorySection({
  subscriptions,
  labels,
}: {
  subscriptions: SubDto[];
  labels: Record<string, unknown>;
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-xl border border-grey-200 bg-white p-8 text-center text-grey-400">
        {labels.noSubscriptions as string}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-grey-200 bg-white overflow-hidden">
      {/* Table header */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-grey-200 text-sm text-grey-500">
            <th className="px-5 py-4 text-right font-medium">مبلغ الإشتراك</th>
            <th className="px-5 py-4 text-right font-medium">وسيلة الدفع</th>
            <th className="px-5 py-4 text-right font-medium">التاريخ</th>
            <th className="px-5 py-4 text-right font-medium">رقم الفاتورة</th>
            <th className="px-5 py-4 text-right font-medium">العملية</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => {
            const last4 = sub.paymentTransactionId
              ? sub.paymentTransactionId.slice(-4)
              : "—";
            return (
              <tr key={sub.id} className="border-b border-grey-100 last:border-b-0">

                {/* Amount */}
                <td className="px-5 py-4 text-sm text-text-dark">
                  {sub.finalAmount} ريال سعودي
                </td>
                {/* Payment method */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-text-dark" dir="ltr">
                    <span className="rounded bg-grey-100 px-1.5 py-0.5 text-xs font-medium">
                      {paymentMethodLabel(sub.paymentMethod)}
                    </span>
                    <span>**** {last4}</span>
                  </div>
                </td>
                {/* Date */}
                <td className="px-5 py-4 text-sm text-text-dark" dir="ltr">
                  {new Date(sub.subscribedAt).toLocaleDateString("en-GB")}
                </td>
                {/* Transaction ID + download */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-primary-500">
                    <Download className="h-4 w-4" />
                    <span className="underline">
                      تحميل {sub.paymentGatewayId || sub.paymentTransactionId || `#${sub.id}`}
                    </span>
                  </div>
                </td>
                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-base font-light"
                    style={paymentStatusStyle(sub.paymentStatus)}
                  >
                    {paymentStatusLabel(sub.paymentStatus)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Shared: Edit Field Modal ─── */
function EditFieldModal({
  isOpen,
  onClose,
  title,
  currentLabel,
  currentValue,
  newLabel,
  newValue,
  onNewValueChange,
  onSave,
  isSaving,
  inputType = "text",
  inputDir,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentLabel: string;
  currentValue: string;
  newLabel: string;
  newValue: string;
  onNewValueChange: (v: string) => void;
  onSave: () => void;
  isSaving: boolean;
  inputType?: string;
  inputDir?: string;
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="space-y-6 py-2" dir="rtl">
        {/* Fields side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current value (right in RTL) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-grey-600">
              {currentLabel}
            </label>
            <div
              className="rounded-lg border border-grey-200 bg-grey-50 px-4 py-3 text-sm text-grey-500"
              dir={inputDir}
            >
              {currentValue}
            </div>
          </div>

          {/* New value input (left in RTL) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-grey-600">
              {newLabel}
            </label>
            <input
              type={inputType}
              value={newValue}
              onChange={(e) => onNewValueChange(e.target.value)}
              className="w-full rounded-lg border border-grey-300 px-4 py-3 text-sm text-text-dark outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              dir={inputDir}
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-50"
        >
          <CheckCircle className="h-5 w-5" />
          <span>{isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
        </button>
      </div>
    </Modal>
  );
}

/* ─── Shared: Field Card ─── */
function FieldCard({
  label,
  value,
  onEdit,
  dir,
  nested = false,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  dir?: string;
  nested?: boolean;
}) {
  const wrapperClass = nested
    ? "rounded-lg border border-grey-100 bg-grey-50 p-4"
    : "rounded-xl border border-grey-200 bg-white p-5";

  return (
    <div className={`flex items-center justify-between ${wrapperClass}`}>
      <div className="border-s-2 border-primary-500 ps-4">
        <p className="text-lg font-normal text-text-dark">{label}</p>
        <p className="text-lg font-light text-text-muted" dir={dir}>
          {value}
        </p>
      </div>
      {onEdit && (
        <button onClick={onEdit} className="text-grey-400 hover:text-grey-600">
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
