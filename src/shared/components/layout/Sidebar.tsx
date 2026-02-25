"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/TranslationContext";
import { ROUTES } from "@/config";
import { useLogout } from "@/features/auth/hooks";

interface SidebarProps {
  open: boolean;
}

const navItems = [
  { href: ROUTES.REPORTS, icon: "/icons/reports.svg", labelKey: "reports" },
  { href: ROUTES.USERS, icon: "/icons/users.svg", labelKey: "users" },
  { href: ROUTES.FILES, icon: "/icons/files.svg", labelKey: "files" },
  {
    href: ROUTES.SUBSCRIPTIONS,
    icon: "/icons/subscriptions.svg",
    labelKey: "subscriptions",
  },
  { href: ROUTES.RANKS, icon: "/icons/ranks.svg", labelKey: "ranks" },
  {
    href: ROUTES.ACADEMIC_YEARS,
    icon: "/icons/academic-years.svg",
    labelKey: "academicYears",
  },
  {
    href: ROUTES.PROFILE_TYPES,
    icon: "/icons/profile-types.svg",
    labelKey: "profileTypes",
  },
  {
    href: ROUTES.ASSESSMENTS,
    icon: "/icons/assessments.svg",
    labelKey: "assessments",
  },
  { href: ROUTES.TERMS, icon: "/icons/terms.svg", labelKey: "terms" },
  { href: ROUTES.SOCIALS, icon: "/icons/socials.svg", labelKey: "socials" },
] as const;

export function Sidebar({ open }: SidebarProps) {
  const { t } = useTranslation();
  const sidebarT = t("dashboard").sidebar;
  const pathname = usePathname();
  const logoutMutation = useLogout();

  return (
    <aside
      className={`z-50 flex h-full flex-col border-[#F1F1F1] bg-white transition-all duration-200 border-e ${
        open ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-5 py-4">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <Image src="/logo.svg" alt="إنجاز المعلم" width={126} height={42} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-5 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-5 py-3 text-xl font-light transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary-50 text-primary-500"
                  : "text-text-dark hover:bg-grey-50 hover:text-grey-900"
              }`}
            >
              <Image src={item.icon} alt="" width={24} height={24} />
              {sidebarT[item.labelKey as keyof typeof sidebarT]}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-light text-warning-500 transition-colors hover:bg-warning-50 whitespace-nowrap"
        >
          <Image src="/icons/logout.svg" alt="" width={24} height={24} />
          {sidebarT.logout}
        </button>
      </div>
    </aside>
  );
}
