"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Filter,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import {
  Button,
  Pagination,
  ConfirmDialog,
  StatusBadge,
} from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useFilteredUsers, useDeleteUser } from "../hooks";
import type { UserDto, UserFilterParams } from "../types/users.types";
import { AddUserModal } from "./AddUserModal";
import { UserDetailModal } from "./UserDetailModal";
import { Gender } from "@/shared/types";

const PAGE_SIZE = 10;

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

export function UsersContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const commonT = t("common") as Record<string, unknown>;
  const actionsT = commonT.actions as Record<string, string>;
  const toastT = commonT.toast as Record<string, string>;
  const confirmT = commonT.confirm as Record<string, string>;

  // Users-specific translations (fallback inline)
  const usersT = {
    title: "العملاء",
    addUser: "إضافة عميل",
    searchPlaceholder: "البحث في العملاء...",
    noUsers: "لا يوجد عملاء",
    filterByRole: "فلترة حسب الدور",
    filterByStatus: "فلترة حسب الحالة",
    allRoles: "جميع الأدوار",
    allStatuses: "جميع الحالات",
    active: "نشط",
    inactive: "غير نشط",
    admin: "مدير",
    teacher: "معلم",
    table: {
      name: "الاسم",
      phone: "الهاتف",
      role: "الدور",
      gender: "الجنس",
      status: "الحالة",
      subscribed: "الاشتراك",
      lastLogin: "آخر دخول",
      action: "الإجراء",
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

  // Data fetching
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Error state
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-grey-400" />
            <select
              value={roleFilter ?? ""}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-grey-700"
            >
              <option value="">{usersT.allRoles}</option>
              <option value="0">{usersT.admin}</option>
              <option value="1">{usersT.teacher}</option>
            </select>
          </div>
          <select
            value={statusFilter === undefined ? "" : statusFilter.toString()}
            onChange={(e) =>
              setStatusFilter(
                e.target.value === "" ? undefined : e.target.value === "true",
              )
            }
            className="rounded-lg border border-grey-200 bg-white px-3 py-2 text-sm text-grey-700"
          >
            <option value="">{usersT.allStatuses}</option>
            <option value="true">{usersT.active}</option>
            <option value="false">{usersT.inactive}</option>
          </select>
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-full!"
        >
          <Plus className="h-5 w-5" />
          {usersT.addUser}
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-grey-200 bg-white">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-grey-200 p-6">
          <h3 className="text-lg font-medium text-text-dark">{usersT.title}</h3>
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
                  {usersT.table.role}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.gender}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.status}
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  {usersT.table.subscribed}
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
                    colSpan={7}
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {isValidImageUrl(user.imageUrl) ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.fullName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-text-dark">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark" dir="ltr">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {user.role === "Admin" ? usersT.admin : usersT.teacher}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {user.gender === Gender.Male
                      ? usersT.gender.male
                      : usersT.gender.female}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={user.isActive ? usersT.active : usersT.inactive}
                      variant={user.isActive ? "success" : "neutral"}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={
                        user.isSubscribed
                          ? usersT.subscribed
                          : usersT.notSubscribed
                      }
                      variant={user.isSubscribed ? "info" : "neutral"}
                    />
                  </td>
                  <td className="relative px-6 py-4">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === user.id ? null : user.id)
                      }
                      className="rounded-lg p-1.5 text-grey-400 hover:bg-grey-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {openMenuId === user.id && (
                      <div
                        ref={menuRef}
                        className="absolute end-6 top-full z-20 w-44 rounded-lg border border-grey-200 bg-white py-1 shadow-lg"
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
