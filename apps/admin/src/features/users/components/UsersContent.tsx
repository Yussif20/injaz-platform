"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  File,
  UserRoundX,
  ChevronDown,
  ChevronLeft,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/TranslationContext";
import {
  Button,
  Pagination,
  ConfirmDialog,
} from "@/shared/components/ui";
import { useToast } from "@/shared/providers/ToastProvider";
import { useFilteredUsers, useDeleteUser } from "../hooks";
import { useFilteredProfiles } from "@/features/profiles/hooks/useProfiles";
import { useProfileTypes } from "@/features/profile-types/hooks/useProfileTypes";
import { useFilteredSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";
import type { UserDto, UserFilterParams } from "../types/users.types";
import { AddUserModal } from "./AddUserModal";
import { Gender } from "@/shared/types";

const PAGE_SIZE = 10;

// Simple donut chart rendered with SVG
function DonutChart({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0)
    return <div className="h-16 w-16 rounded-full bg-grey-200" />;
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

// Filled pie chart rendered with SVG
function PieChart({
  segments,
  size = 80,
}: {
  segments: { value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0)
    return <div className="rounded-full bg-grey-200" style={{ width: size, height: size }} />;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  let cumulativeAngle = -90; // start from top

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const angle = (seg.value / total) * 360;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle = endAngle;

        const x1 = cx + r * Math.cos(toRad(startAngle));
        const y1 = cy + r * Math.sin(toRad(startAngle));
        const x2 = cx + r * Math.cos(toRad(endAngle));
        const y2 = cy + r * Math.sin(toRad(endAngle));
        const largeArc = angle > 180 ? 1 : 0;

        if (segments.length === 1) {
          return <circle key={i} cx={cx} cy={cy} r={r} fill={seg.color} />;
        }

        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={seg.color}
          />
        );
      })}
    </svg>
  );
}

export function UsersContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterSubmenu, setFilterSubmenu] = useState<"gender" | "rank" | "subscription" | null>(null);
  const [genderFilter, setGenderFilter] = useState<number | undefined>(undefined);
  const [rankFilterName, setRankFilterName] = useState<string | undefined>(undefined);
  const [subscriptionFilter, setSubscriptionFilter] = useState<"active" | "expired" | undefined>(undefined);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Data: paginated for table, all for stats
  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useFilteredUsers({
    ...filters,
    SearchTerm: debouncedSearch || undefined,
  });
  // Only show full-page spinner on very first load (no cached data yet)
  const showFullSpinner = isLoading && !paginatedData;

  const { data: allUsersData } = useFilteredUsers({ PageSize: 10000 });
  const allUsers = allUsersData?.items ?? [];

  const rawUsers = paginatedData?.items ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const currentPage = paginatedData?.pageNumber ?? 1;

  // Mutations
  const deleteUser = useDeleteUser();

  // Local state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserDto | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [filterMenuPos, setFilterMenuPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setFilters((p) => ({ ...p, PageNumber: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        setFilterSubmenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch all active subscriptions for both stats and per-row lookup
  const { data: activeSubsData } = useFilteredSubscriptions({
    IsActive: true,
    PageSize: 10000,
    PageNumber: 1,
  });
  const activeSubscribersCount = activeSubsData?.totalCount ?? 0;
  const totalUsersCount = allUsersData?.totalCount ?? allUsers.length;
  const subscribedCount = activeSubscribersCount;
  const notSubscribedCount = Math.max(0, totalUsersCount - activeSubscribersCount);

  // Build userId → subscription lookup for table rows
  const userSubMap = useMemo(() => {
    const map = new Map<number, import("@/features/subscriptions/types/subscriptions.types").SubscriptionDto>();
    if (activeSubsData?.items) {
      for (const sub of activeSubsData.items) {
        map.set(sub.userId, sub);
      }
    }
    return map;
  }, [activeSubsData]);

  // Gender stats from users data
  const maleCount = allUsers.filter((u) => u.gender === Gender.Male).length;
  const femaleCount = allUsers.filter((u) => u.gender === Gender.Female).length;

  // Profile type (rank) groups — count profiles per type from files data
  const { data: profilesData } = useFilteredProfiles({ PageSize: 1000 });
  const { data: profileTypes = [] } = useProfileTypes();

  const profileTypeNameMap: Record<number, string> = {};
  profileTypes.forEach((pt) => {
    profileTypeNameMap[pt.id] = pt.typeName;
  });

  // Build userId → rank name lookup for table rows
  const userRankMap = useMemo(() => {
    const map = new Map<number, string>();
    if (profilesData?.items) {
      for (const profile of profilesData.items) {
        const name = profileTypeNameMap[profile.profileTypeId] ?? profile.profileTypeName;
        if (name && !map.has(profile.userId)) {
          map.set(profile.userId, name);
        }
      }
    }
    return map;
  }, [profilesData, profileTypeNameMap]);

  const rankGroups: Record<string, number> = {};
  if (profilesData?.items) {
    for (const profile of profilesData.items) {
      const name =
        profileTypeNameMap[profile.profileTypeId] ?? profile.profileTypeName;
      if (name) {
        rankGroups[name] = (rankGroups[name] ?? 0) + 1;
      }
    }
  }
  const rankEntries = Object.entries(rankGroups);
  const rankColors = ["#008387", "#6FB3B5", "#E3EFEF", "#4A9D9F", "#B1D4D5"];

  // Apply client-side filters (gender, rank, subscription)
  const users = useMemo(() => {
    let filtered = rawUsers;
    if (genderFilter !== undefined) {
      filtered = filtered.filter((u) => u.gender === genderFilter);
    }
    if (rankFilterName !== undefined) {
      filtered = filtered.filter((u) => userRankMap.get(u.id) === rankFilterName);
    }
    if (subscriptionFilter === "active") {
      filtered = filtered.filter((u) => userSubMap.has(u.id));
    } else if (subscriptionFilter === "expired") {
      filtered = filtered.filter((u) => !userSubMap.has(u.id));
    }
    return filtered;
  }, [rawUsers, genderFilter, rankFilterName, subscriptionFilter, userRankMap, userSubMap]);

  // Handlers
  const handleView = (user: UserDto) => {
    router.push(`/dashboard/users/${user.id}`);
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
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    toast({ type: "success", message: toastT.saved });
  };

  if (showFullSpinner) {
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
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subscribed */}
        <div className="flex items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <UserCheck className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {subscribedCount}
            </p>
            <p className="mt-1 text-lg font-light text-grey-500">عملاء مشتركين</p>
          </div>
        </div>

        {/* Non-subscribed */}
        <div className="flex items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <UserX className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary-500">
              {notSubscribedCount}
            </p>
            <p className="mt-1 text-lg font-light text-grey-500">عملاء غير مشتركين</p>
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4">
          <DonutChart
            segments={[
              { value: maleCount, color: "#008387" },
              { value: femaleCount, color: "#6FB3B5" },
            ]}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#008387" }} />
              <span className="text-xs text-grey-600">
                {maleCount} {usersT.gender.male}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#6FB3B5" }} />
              <span className="text-xs text-grey-600">
                {femaleCount} {usersT.gender.female}
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Ranks Pie Chart */}
        <div className="flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4">
          <PieChart
            segments={rankEntries.map(([, count], i) => ({
              value: count,
              color: rankColors[i % rankColors.length] ?? "#0DB2AC",
            }))}
            size={80}
          />
          <div className="space-y-1.5 flex-1">
            {rankEntries.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      rankColors[i % rankColors.length] ?? "#0DB2AC",
                  }}
                />
                <span className="text-sm font-medium text-text-dark">
                  {count} {name}
                </span>
              </div>
            ))}
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
                className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] py-2.5 ps-10 pe-4 text-sm font-light text-text-dark placeholder:text-text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
              />
            </div>
            {/* Filter Button */}
            <div ref={filterMenuRef}>
              <button
                onClick={(e) => {
                  if (!showFilterMenu) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const menuWidth = 240;
                    const left = Math.max(
                      8,
                      Math.min(rect.left, window.innerWidth - menuWidth - 8),
                    );
                    setFilterMenuPos({ top: rect.bottom + 4, left });
                  }
                  setShowFilterMenu((v) => !v);
                  setFilterSubmenu(null);
                }}
                className="flex items-center gap-2 rounded-lg border border-grey-200 bg-white px-4 py-2.5 text-sm text-grey-700 hover:bg-grey-50"
              >
                <Users className="h-4 w-4 text-grey-400" />
                {usersT.filter}
                <ChevronDown className="h-4 w-4 text-grey-400" />
              </button>
              {showFilterMenu && filterMenuPos && (
                <div
                  style={{
                    position: "fixed",
                    top: filterMenuPos.top,
                    left: filterMenuPos.left,
                  }}
                  className="z-[9999] w-60 rounded-xl bg-white py-2 shadow-lg"
                >
                  {/* Main categories */}
                  {filterSubmenu === null && (
                    <>
                      {(
                        [
                          { key: "gender", label: "النوع" },
                          { key: "rank", label: "الرتبة" },
                          { key: "subscription", label: "حالة الإشتراك" },
                        ] as { key: "gender" | "rank" | "subscription"; label: string }[]
                      ).map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setFilterSubmenu(key)}
                          className="flex w-full items-center justify-between px-5 py-3 text-sm text-text-dark hover:bg-grey-50"
                        >
                          <span>{label}</span>
                          <ChevronLeft className="h-4 w-4 text-grey-400" />
                        </button>
                      ))}
                      <hr className="my-1 border-grey-100" />
                      <button
                        onClick={() => {
                          setGenderFilter(undefined);
                          setRankFilterName(undefined);
                          setSubscriptionFilter(undefined);
                          setFilters((p) => ({ ...p, PageNumber: 1 }));
                          setShowFilterMenu(false);
                        }}
                        className="flex w-full items-center px-5 py-3 text-sm text-warning-500 hover:bg-grey-50"
                      >
                        إعادة ضبط التصنيف
                      </button>
                    </>
                  )}

                  {/* Gender submenu */}
                  {filterSubmenu === "gender" && (
                    <>
                      {[
                        { label: "ذكر", value: Gender.Male },
                        { label: "أنثى", value: Gender.Female },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            setGenderFilter(genderFilter === opt.value ? undefined : opt.value);
                            setFilters((p) => ({ ...p, PageNumber: 1 }));
                            setFilterSubmenu(null);
                            setShowFilterMenu(false);
                          }}
                          className="flex w-full items-center justify-between px-5 py-3 text-sm text-text-dark hover:bg-grey-50"
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              genderFilter === opt.value
                                ? "border-primary-500"
                                : "border-grey-300"
                            }`}
                          >
                            {genderFilter === opt.value && (
                              <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                            )}
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Rank submenu */}
                  {filterSubmenu === "rank" && (
                    <>
                      {rankEntries.map(([name]) => (
                        <button
                          key={name}
                          onClick={() => {
                            setRankFilterName(rankFilterName === name ? undefined : name);
                            setFilters((p) => ({ ...p, PageNumber: 1 }));
                            setFilterSubmenu(null);
                            setShowFilterMenu(false);
                          }}
                          className="flex w-full items-center justify-between px-5 py-3 text-sm text-text-dark hover:bg-grey-50"
                        >
                          <span>{name}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              rankFilterName === name
                                ? "border-primary-500"
                                : "border-grey-300"
                            }`}
                          >
                            {rankFilterName === name && (
                              <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                            )}
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Subscription submenu */}
                  {filterSubmenu === "subscription" && (
                    <>
                      {[
                        { label: "مفعل", value: "active" as const },
                        { label: "منتهي", value: "expired" as const },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSubscriptionFilter(subscriptionFilter === opt.value ? undefined : opt.value);
                            setFilters((p) => ({ ...p, PageNumber: 1 }));
                            setFilterSubmenu(null);
                            setShowFilterMenu(false);
                          }}
                          className="flex w-full items-center justify-between px-5 py-3 text-sm text-text-dark hover:bg-grey-50"
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              subscriptionFilter === opt.value
                                ? "border-primary-500"
                                : "border-grey-300"
                            }`}
                          >
                            {subscriptionFilter === opt.value && (
                              <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                            )}
                          </span>
                        </button>
                      ))}
                    </>
                  )}
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
                  onClick={() => router.push(`/dashboard/users/${user.id}`)}
                  className="cursor-pointer border-b border-grey-100 last:border-b-0 hover:bg-grey-50 transition-colors"
                >
                  {/* Name */}
                  <td className="max-w-40 truncate px-6 py-4 text-sm text-text-dark">
                    {user.fullName}
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
                    {userRankMap.get(user.id) ?? user.personalInfo?.rankTitle ?? "—"}
                  </td>
                  {/* Subscription Date */}
                  <td className="px-6 py-4 text-sm text-text-dark">
                    {userSubMap.get(user.id)?.subscribedAt
                      ? new Date(
                          userSubMap.get(user.id)!.subscribedAt,
                        ).toLocaleDateString("ar-SA")
                      : "—"}
                  </td>
                  {/* Subscription Status */}
                  <td className="px-6 py-4">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-base font-light"
                      style={
                        userSubMap.has(user.id)
                          ? { color: "#03960D", backgroundColor: "#E6FFE8" }
                          : { color: "#B1363E", backgroundColor: "#F3D8DA" }
                      }
                    >
                      {userSubMap.has(user.id) ? usersT.subscribed : usersT.notSubscribed}
                    </span>
                  </td>
                  {/* Action */}
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 224;
                        const left = Math.max(
                          8,
                          Math.min(
                            rect.left,
                            window.innerWidth - menuWidth - 8,
                          ),
                        );
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
                        style={{
                          position: "fixed",
                          top: menuPos.top,
                          left: menuPos.left,
                        }}
                        className="z-[9999] w-max min-w-56 rounded-xl border border-grey-200 bg-white py-2 shadow-lg"
                      >
                        <button
                          onClick={() => handleView(user)}
                          className="flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          <File className="h-5 w-5 shrink-0 text-grey-700" />
                          <span>عرض تفاصيل ملف العميل</span>
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            toast({ type: "error", message: "تفعيل الإشتراك يتم من خلال العميل عبر بوابة الدفع" });
                          }}
                          className="flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-grey-700 hover:bg-grey-50"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/icons/subscriptions.svg" alt="" className="h-5 w-5 shrink-0" />
                          <span>تفعيل إشتراك العميل</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="flex w-full items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-warning-500 hover:bg-grey-50"
                        >
                          <UserRoundX className="h-5 w-5 shrink-0 text-warning-500" />
                          <span>حظر العميل</span>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Ban Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="حظر العميل"
        message={`هل أنت متأكد من حظر العميل "${deleteTarget?.fullName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        isLoading={deleteUser.isPending}
        confirmLabel="حظر"
        cancelLabel={actionsT.cancel}
      />
    </>
  );
}
