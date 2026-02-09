"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";
import { Button, ConfirmModal } from "@/shared/components/ui";
import { useLogout } from "@/features/auth";
import { useAuth } from "@/features/auth";

interface DashboardNavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onMenuToggle,
  isSidebarOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { navbar, breadcrumb, modals } = dashboardContent;

  // Generate breadcrumb based on current path
  const getBreadcrumb = () => {
    // Create file page breadcrumb
    if (pathname === ROUTES.DASHBOARD_PROFILE_NEW) {
      return (
        <>
          <Link
            href={ROUTES.DASHBOARD}
            className="text-[#666666] hover:text-primary-500 transition-colors text-sm md:text-lg font-light md:font-normal"
          >
            {breadcrumb.home}
          </Link>
          <span className="text-grey-400 mx-2">&lt;</span>
          <span className="text-text-dark text-sm md:text-lg font-light md:font-normal">
            {breadcrumb.createFile}
          </span>
        </>
      );
    }

    // Account pages breadcrumb
    if (pathname.startsWith(ROUTES.DASHBOARD_ACCOUNT)) {
      const segments = pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1];

      const breadcrumbMap: Record<string, string> = {
        account: breadcrumb.account,
        info: breadcrumb.accountInfo,
        "profile-data": breadcrumb.profileData,
        subscription: breadcrumb.subscription,
        support: breadcrumb.support,
        terms: breadcrumb.terms,
        "how-to-use": breadcrumb.howToUse,
        "file-password": breadcrumb.filePassword,
        "change-password": breadcrumb.changePassword,
      };

      const currentPage = breadcrumbMap[lastSegment] || breadcrumb.account;

      if (lastSegment !== "account") {
        return (
          <>
            <Link
              href={ROUTES.DASHBOARD_ACCOUNT}
              className="text-[#666666] hover:text-primary-500 transition-colors text-sm md:text-lg font-light md:font-normal"
            >
              {breadcrumb.account}
            </Link>
            <span className="text-grey-400 mx-2">&lt;</span>
            <span className="text-text-dark text-sm md:text-lg font-light md:font-normal">
              {currentPage}
            </span>
          </>
        );
      }

      return (
        <span className="text-text-dark text-sm md:text-lg font-light md:font-normal">
          {breadcrumb.account}
        </span>
      );
    }

    return null;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.SIGN_IN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="bg-white border-b border-grey-200 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8">
        {/* Right side - Logo and breadcrumb (RTL: appears on right) */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="inline-flex shrink-0">
            <Image
              src="/logo/logo-cyan.svg"
              alt={navbar.logoAlt}
              width={100}
              height={50}
              className="h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Breadcrumb / Welcome */}
          {pathname === ROUTES.DASHBOARD ? (
            <div className="hidden md:flex items-center gap-2 md:gap-3 pr-0 md:pr-2">
              <div className="w-6 h-6 md:w-[54px] md:h-[54px] rounded-full bg-grey-100 border border-grey-200 overflow-hidden flex items-center justify-center">
                <Image
                  src={user?.profileImage || "/icons/ui/user.svg"}
                  alt="صورة الملف الشخصي"
                  width={54}
                  height={54}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="leading-snug text-right">
                <p className="text-[16px] md:text-[18px] font-normal text-text-dark">
                  مرحبًا بك، {user?.fullName || ""}
                  <span className="mr-1">👋</span>
                </p>
                <p className="text-[14px] md:text-[16px] font-light text-[#4D4D4D]">
                  ابدء رحلتك معنا بتجميع إنجازاتك لكل سنة
                </p>
              </div>
            </div>
          ) : (
            <nav className="hidden md:flex items-center text-sm">
              <Link href={ROUTES.DASHBOARD} className="ml-2">
                <svg
                  className="w-5 h-5 text-grey-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              {getBreadcrumb()}
            </nav>
          )}
        </div>

        {/* Left side - Logout and menu (RTL: appears on left) */}
        <div className="flex items-center gap-4">
          {/* Logout button - icon only on tablet, with text on desktop */}
          <Button
            variant="warning"
            size="sm"
            onClick={() => setShowLogoutModal(true)}
            className="hidden md:inline-flex w-auto h-10 lg:px-4 md:w-10 md:h-10 md:p-0 lg:w-auto items-center justify-center lg:gap-2"
          >
            <Image
              src="/icons/ui/logout.svg"
              alt="logout"
              width={13}
              height={13}
            />
            <span className="hidden lg:inline">{navbar.logout}</span>
          </Button>

          {/* Mobile menu button (mobile only, hidden on tablet+) */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-grey-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-secondary-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Logout confirmation modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={modals.logout.title}
        message={modals.logout.message}
        confirmText={modals.logout.confirm}
        cancelText={modals.logout.cancel}
        variant="warning"
        isLoading={isLoggingOut}
      />
    </>
  );
};
