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
  {
    href: ROUTES.RANKS,
    icon: "/icons/profile-types.svg",
    labelKey: "ranks",
  },
  {
    href: ROUTES.ACADEMIC_YEARS,
    icon: "/icons/academic-years.svg",
    labelKey: "academicYears",
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
      className={`z-50 flex h-full shrink-0 flex-col overflow-y-auto border-[#F1F1F1] bg-white transition-all duration-300 ease-in-out border-e ${
        open ? "w-64 min-w-64" : "w-[72px] min-w-[72px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-5">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          {open ? (
            <Image src="/logo.svg" alt="إنجاز المعلم" width={126} height={42} />
          ) : (
            <Image src="/logo-icon.svg" alt="إنجاز المعلم" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-3 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={open ? undefined : String(sidebarT[item.labelKey as keyof typeof sidebarT])}
              className={`flex items-center gap-3 rounded-lg transition-colors whitespace-nowrap overflow-hidden ${
                open ? "px-5 py-3" : "justify-center px-0 py-3"
              } ${
                isActive
                  ? "bg-primary-50 text-primary-500"
                  : "text-text-dark hover:bg-grey-50 hover:text-grey-900"
              }`}
            >
              <Image src={item.icon} alt="" width={24} height={24} className="shrink-0" />
              <span
                className={`text-lg font-light transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {sidebarT[item.labelKey as keyof typeof sidebarT]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-5">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          title={open ? undefined : String(sidebarT.logout)}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg text-lg font-light text-warning-500 transition-colors hover:bg-warning-50 whitespace-nowrap overflow-hidden ${
            open ? "px-3 py-2.5" : "justify-center px-0 py-2.5"
          }`}
        >
          <Image src="/icons/logout.svg" alt="" width={24} height={24} className="shrink-0" />
          <span
            className={`transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            {sidebarT.logout}
          </span>
        </button>
      </div>
    </aside>
  );
}
