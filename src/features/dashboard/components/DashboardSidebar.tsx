"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  matchPrefix?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { sidebar } = dashboardContent;

  const navItems: NavItem[] = [
    {
      label: sidebar.home,
      href: ROUTES.DASHBOARD,
      icon: (
        <Image src="/icons/ui/home.svg" alt="home" width={20} height={20} />
      ),
    },
    {
      label: sidebar.createProfile,
      href: ROUTES.DASHBOARD_PROFILE_NEW,
      icon: (
        <Image
          src="/icons/ui/plus-sign-circle.svg"
          alt="create profile"
          width={20}
          height={20}
        />
      ),
    },
    {
      label: sidebar.myAccount,
      href: ROUTES.DASHBOARD_ACCOUNT,
      matchPrefix: ROUTES.DASHBOARD_ACCOUNT,
      icon: (
        <Image
          src="/icons/ui/profile.svg"
          alt="my account"
          width={20}
          height={20}
        />
      ),
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    return pathname === item.href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 lg:top-20 right-0 h-screen lg:h-[calc(100vh-5rem)] z-50
          w-full lg:w-64 bg-white border-l border-grey-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:transform-none
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-secondary-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 pt-0 lg:pt-6 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-colors duration-200
                        ${
                          active
                            ? "bg-shade-100 text-primary-500"
                            : "text-grey-600 hover:bg-grey-50 hover:text-secondary-800"
                        }
                      `}
                    >
                      <span
                        className={
                          active ? "text-primary-500" : "text-grey-500"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="font-normal">{item.label}</span>
                      {active && (
                        <svg
                          className="w-4 h-4 mr-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile logout */}
          <div className="lg:hidden px-3 pb-3 pt-0  border-grey-200 flex justify-end">
            <button
              type="button"
              aria-label={dashboardContent.navbar.logout}
              disabled={isLoggingOut}
              className="w-8 h-8 py-1.5 px-2 flex items-center justify-center rounded-full bg-warning-500 hover:bg-warning-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={async () => {
                try {
                  await logout();
                  router.push(ROUTES.SIGN_IN);
                  onClose?.();
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
            >
              <Image
                src="/icons/ui/logout.svg"
                alt="logout"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
