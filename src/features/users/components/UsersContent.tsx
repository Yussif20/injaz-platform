"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronDown,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import {
  Button,
  Pagination,
  ConfirmDialog,
  StatusBadge,
} from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useFilteredUsers, useUsers, useDeleteUser } from "../hooks";
import type { UserDto, UserFilterParams } from "../types/users.types";
import { AddUserModal } from "./AddUserModal";
import { UserDetailModal } from "./UserDetailModal";
import { Gender } from "@/shared/types";

const PAGE_SIZE = 10;

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Simple donut chart rendered with SVG
function DonutChart({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className="h-16 w-16 rounded-full bg-grey-200" />;
  const r = 26;
  const cx = 32;
  const cy = 32;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 32 32)"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export function UsersContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  const usersT = {
    title: "العملاء",
    addUser: "إضافة عميل",
    searchPlaceholder: "ابحث هنا بالاسم او رقم الجوال",
    noUsers: "لا يوجد عملاء",
    allRoles: "جميع الأدوار",
    allStatuses: "جميع الحالات",
    active: "نشط",
    inactive: "غير نشط",
    admin: "مدير",
    teacher: "معلم",
    filter: "تصنيف",
    table: {
      name: "اسم العميل",
      phone: "رقم الجوال",
      email: "البريد الإلكتروني",
      gender: "النوع",
      rank: "الرتبة الوظيفية",
      subscriptionDate: "تاريخ الإشتراك",
      subscriptionStatus: "حالة الإشتراك",
      action: "إجراء",
    },
    gender: {
      male: "ذكر",
      female: "أنثى",
    },
    subscribed: "مشترك",
    notSubscribed: "غير مشترك",
  };

  // Filter state
  const [filters, setFilters] = useState<UserFilterParams>({
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Data: paginated for table, all for stats
  const {
    data: paginatedData,
    isLoading,
    isError,
    refetch,
  } = useFilteredUsers({
    ...filters,
    SearchTerm: searchQuery || undefined,
    Role: roleFilter,
    IsActive: statusFilter,
  });

  const { data: allUsers = [] } = useUsers();

  const users = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;

  // Mutations
  const deleteUser = useDeleteUser();

  // Local state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserDto | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [filterMenuPos, setFilterMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(e.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Compute stats from all users
  const subscribedCount = allUsers.filter((u) => u.isSubscribed).length;
  const notSubscribedCount = allUsers.filter((u) => !u.isSubscribed).length;
  const maleCount = allUsers.filter((u) => u.gender === Gender.Male).length;
  const femaleCount = allUsers.filter((u) => u.gender === Gender.Female).length;

  // Teacher rank groups (from personalInfo.rankTitle)
  const rankGroups: Record<string, number> = {};
  allUsers.forEach((u) => {
    if (u.personalInfo?.rankTitle) {
      const key = u.personalInfo.rankTitle;
      rankGroups[key] = (rankGroups[key] ?? 0) + 1;
    }
  });
  const rankEntries = Object.entries(rankGroups);
  const rankColors = ["#0DB2AC", "#B2E5E3", "#34D399", "#6EE7B7", "#A7F3D0"];

  // Handlers
  const handleView = (user: UserDto) => {
    setViewingUser(user);
    setOpenMenuId(null);
  };

  const handleDelete = (user: UserDto) => {
    setDeleteTarget(user);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast({ type: "delete", message: toastT.deleted });
        setDeleteTarget(null);
      },
      onError: () => {
        toast({ type: "error", message: toastT.error });
      },
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters((prev) => ({ ...prev, PageNumber: 1 }));
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    toast({ type: "success", message: toastT.saved });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-4">
        <p className="text-grey-500">{toastT.error}</p>
        <Button variant="outline" onClick={() => refetch()}>
          {actionsT.retry ?? "إعادة المحاولة"}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Stats Section */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {/* Teacher Types */}
        <div className="flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4">
          <DonutChart
            segments={rankEntries.map(([, count], i) => ({
              value: count,
              color: rankColors[i % rankColors.length] ?? "#0DB2AC",
            }))}
          />
          <div className="space-y-1">
            {rankEntries.slice(0, 3).map(([name, count], i) => (
              <div key={name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      rankColors[i % rankColors.length] ?? "#0DB2AC",
                  }}
                />
                <span className="text-xs text-grey-600">
                  {count} {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4">
          <DonutChart
            segments={[
              { value: maleCount, color: "#0DB2AC" },
              { value: femaleCount, color: "#B2E5E3" },
            ]}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              <span className="text-xs text-grey-600">
                {maleCount} {usersT.gender.male}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-200" />
              <span className="text-xs text-grey-600">
                {femaleCount} {usersT.gender.female}
              </span>
            </div>
          </div>
        </div>

        {/* Non-subscribed */}
        <div className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-4">
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {notSubscribedCount}
            </p>
            <p className="mt-1 text-sm text-grey-500">عملاء غير مشتركين</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <UserX className="h-6 w-6 text-primary-500" />
          </div>
        </div>

        {/* Subscribed */}
        <div className="flex items-center justify-between rounded-2xl border border-grey-200 bg-white p-4">
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {subscribedCount}
            </p>
            <p className="mt-1 text-sm text-grey-500">عملاء مشتركين</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <UserCheck className="h-6 w-6 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">{usersT.title}</h3>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-72">
              <div className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-grey-400" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={usersT.searchPlaceholder}
                className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            {/* Filter Button */}
            <div ref={filterMenuRef}>
              <button
                onClick={(e) => {
                  if (!showFilterMenu) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const menuWidth = 208;
                    const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
                    setFilterMenuPos({ top: rect.bottom + 4, left });
                  }
                  setShowFilterMenu((v) => !v);
                }}
                className="flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-4 py-2.5 text-sm text-grey-700 hover:bg-grey-50"
              >
                <Users className="h-4 w-4 text-grey-400" />
                {usersT.filter}
                <ChevronDown className="h-4 w-4 text-grey-400" />
              </button>
              {showFilterMenu && filterMenuPos && (
                <div
                  style={{ position: "fixed", top: filterMenuPos.top, left: filterMenuPos.left }}
                  className="z-[9999] w-52 rounded-lg border border-grey-200 bg-white py-2 shadow-lg"
                >
                  <p className="px-4 py-1 text-xs font-medium text-grey-400">
                    الدور
                  </p>
                  {[
                    { label: usersT.allRoles, value: undefined },
                    { label: usersT.admin, value: 0 },
                    { label: usersT.teacher, value: 1 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setRoleFilter(opt.value);
                        setFilters((p) => ({ ...p, PageNumber: 1 }));
                        setShowFilterMenu(false);
                      }}
                      className={`flex w-full items-center px-4 py-2 text-sm hover:bg-grey-50 ${roleFilter === opt.value ? "font-medium text-primary-500" : "text-grey-700"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <hr className="my-1 border-grey-100" />
                  <p className="px-4 py-1 text-xs font-medium text-grey-400">
                    الحالة
                  </p>
                  {[
                    { label: usersT.allStatuses, value: undefined },
                    { label: usersT.active, value: true },
                    { label: usersT.inactive, value: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setFilters((p) => ({ ...p, PageNumber: 1 }));
                        setShowFilterMenu(false);
                      }}
                      className={`flex w-full items-center px-4 py-2 text-sm hover:bg-grey-50 ${statusFilter === opt.value ? "font-medium text-primary-500" : "text-grey-700"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-200 text-sm text-grey-500">
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.name}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.phone}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.email}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.gender}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.rank}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.subscriptionDate}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.subscriptionStatus}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-grey-400"
                  >
                    {usersT.noUsers}
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-grey-100 last:border-b-0"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {isValidImageUrl(user.imageUrl) ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.fullName}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm text-primary-600">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-text-dark">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-text-dark" dir="ltr">
                    {user.phone}
                  </td>
                  {/* Email */}
                  <td className="max-w-36 truncate px-6 py-4 text-sm text-text-dark">
                    {user.personalInfo?.email ?? "لا يوجد"}
                  </td>
                  {/* Gender */}
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {user.gender === Gender.Male
                      ? usersT.gender.male
                      : usersT.gender.female}
                  </td>
                  {/* Rank */}
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {user.personalInfo?.rankTitle ?? "—"}
                  </td>
                  {/* Subscription Date */}
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {user.currentSubscription?.startDate
                      ? new Date(
                          user.currentSubscription.startDate,
                        ).toLocaleDateString("ar-SA")
                      : "—"}
                  </td>
                  {/* Subscription Status */}
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={
                        user.isSubscribed
                          ? usersT.subscribed
                          : usersT.notSubscribed
                      }
                      variant={user.isSubscribed ? "success" : "neutral"}
                    />
                  </td>
                  {/* Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 176;
                        const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));
                        setMenuPos({ top: rect.bottom + 4, left });
                        setOpenMenuId(openMenuId === user.id ? null : user.id);
                      }}
                      className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {openMenuId === user.id && menuPos && (
                      <div
                        ref={menuRef}
                        style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
                        className="z-[9999] w-44 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
                      >
                        <button
                          onClick={() => handleView(user)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <Eye className="h-4 w-4" />
                          {actionsT.view ?? "عرض"}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-warning-500 hover:bg-grey-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {actionsT.delete}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-grey-200 px-6 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={confirmT.title}
        message={confirmT.message}
        isLoading={deleteUser.isPending}
        confirmLabel={actionsT.delete}
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
