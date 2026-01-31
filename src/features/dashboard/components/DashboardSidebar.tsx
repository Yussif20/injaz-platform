"use client";

import React, { useState, useEffect, useRef } from "react";
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
  submenu?: AccountNavItem[];
}

interface SubNavItem {
  label: string;
  href: string;
}

interface AccountNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  submenu?: SubNavItem[];
  matchPrefix?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { sidebar, accountSidebar } = dashboardContent;
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountDropdown]);

  const accountNavItems: AccountNavItem[] = [
    {
      label: accountSidebar.accountInfo,
      href: ROUTES.DASHBOARD_ACCOUNT_INFO,
      icon: (
        <Image
          src="/icons/ui/profile.svg"
          alt="account info"
          width={20}
          height={20}
        />
      ),
    },
    {
      label: accountSidebar.profileData,
      href: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA,
      matchPrefix: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA,
      icon: (
        <Image
          src="/icons/ui/file-edit.svg"
          alt="profile data"
          width={20}
          height={20}
        />
      ),
      submenu: [
        {
          label: accountSidebar.profileDataPersonal,
          href: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL,
        },
        {
          label: accountSidebar.profileDataEducation,
          href: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_EDUCATION,
        },
        {
          label: accountSidebar.profileDataCareer,
          href: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_CAREER,
        },
      ],
    },
    {
      label: accountSidebar.subscription,
      href: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION,
      matchPrefix: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION,
      icon: (
        <Image
          src="/icons/ui/subscription.svg"
          alt="subscription"
          width={20}
          height={20}
        />
      ),
      submenu: [
        {
          label: accountSidebar.subscriptionManage,
          href: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION_MANAGE,
        },
        {
          label: accountSidebar.subscriptionHistory,
          href: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION_HISTORY,
        },
      ],
    },
    {
      label: accountSidebar.support,
      href: ROUTES.DASHBOARD_ACCOUNT_SUPPORT,
      icon: (
        <Image
          src="/icons/ui/support.svg"
          alt="support"
          width={20}
          height={20}
        />
      ),
    },
    {
      label: accountSidebar.terms,
      href: ROUTES.DASHBOARD_ACCOUNT_TERMS,
      icon: (
        <Image src="/icons/ui/policy.svg" alt="terms" width={20} height={20} />
      ),
    },
    {
      label: accountSidebar.howToUse,
      href: ROUTES.DASHBOARD_ACCOUNT_HOW_TO_USE,
      icon: (
        <Image
          src="/icons/ui/youtube.svg"
          alt="how to use"
          width={20}
          height={20}
        />
      ),
    },
    {
      label: accountSidebar.filePassword,
      href: ROUTES.DASHBOARD_ACCOUNT_FILE_PASSWORD,
      icon: (
        <Image
          src="/icons/ui/lock.svg"
          alt="file password"
          width={20}
          height={20}
        />
      ),
    },
  ];

  const navItems: NavItem[] = [
    {
      label: sidebar.home,
      href: ROUTES.DASHBOARD,
      icon: (
        <Image
          src="/icons/ui/home.svg"
          alt="home"
          width={32}
          height={32}
          className="w-5 h-5 md:w-8 md:h-8 lg:w-5 lg:h-5"
        />
      ),
    },
    {
      label: sidebar.createProfile,
      href: ROUTES.DASHBOARD_PROFILE_NEW,
      icon: (
        <Image
          src="/icons/ui/plus-sign-circle.svg"
          alt="create profile"
          width={32}
          height={32}
          className="w-5 h-5 md:w-8 md:h-8 lg:w-5 lg:h-5"
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
          width={32}
          height={32}
          className="w-5 h-5 md:w-8 md:h-8 lg:w-5 lg:h-5"
        />
      ),
      submenu: accountNavItems,
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    return pathname === item.href;
  };

  const isAccountLinkActive = (item: AccountNavItem) => {
    if (item.matchPrefix) {
      return pathname.startsWith(item.matchPrefix);
    }
    if (item.href === ROUTES.DASHBOARD_ACCOUNT_INFO) {
      return (
        pathname === item.href ||
        pathname === ROUTES.DASHBOARD_ACCOUNT_CHANGE_PASSWORD
      );
    }
    return pathname === item.href;
  };

  const isSubLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 md:top-16 lg:top-20 right-0 h-screen md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] z-50
          w-full md:w-24 lg:w-64 bg-white border-l border-grey-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-4">
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
          <nav className="p-4 pt-0 md:pt-6 lg:pt-6 flex-1 overflow-y-auto">
            <ul className="md:space-y-10 lg:space-y-2 space-y-2">
              {navItems.map((item) => {
                const active = isActive(item);
                const isExpanded = expandedMenu === item.href;
                const isAccountItem = item.href === ROUTES.DASHBOARD_ACCOUNT;

                return (
                  <li
                    key={item.href}
                    className="relative"
                    ref={isAccountItem ? dropdownRef : null}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (item.submenu) {
                          // On large screens, navigate to the account page
                          if (window.innerWidth >= 1024) {
                            router.push(item.href);
                            onClose?.();
                          } else if (window.innerWidth >= 768) {
                            // On tablet, toggle dropdown for account
                            if (isAccountItem) {
                              setShowAccountDropdown((prev) => !prev);
                            }
                          } else {
                            // On mobile, toggle submenu
                            setExpandedMenu(isExpanded ? null : item.href);
                          }
                        } else {
                          router.push(item.href);
                          onClose?.();
                          setShowAccountDropdown(false);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        md:flex-col md:gap-0 md:px-2 md:py-4
                        lg:flex-row lg:gap-3 lg:px-4 lg:py-3
                        transition-colors duration-200 relative
                        text-grey-600 hover:text-secondary-800
                        ${active ? "bg-shade-100" : "hover:bg-grey-50"}
                      `}
                    >
                      <span className="text-grey-500">{item.icon}</span>
                      <span className="font-normal md:hidden lg:inline">
                        {item.label}
                      </span>
                      {/* Dropdown arrow for submenu on mobile only */}
                      {item.submenu && (
                        <svg
                          className={`w-4 h-4 ml-auto md:hidden transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Account dropdown for tablet */}
                    {isAccountItem && showAccountDropdown && (
                      <div className="hidden md:block lg:hidden absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-lg border border-grey-200 z-[60]">
                        <div className="p-4">
                          <ul className="space-y-1">
                            {item.submenu?.map((subitem) => {
                              const subActive = isAccountLinkActive(subitem);
                              const hasNestedSubmenu =
                                subitem.submenu && subitem.submenu.length > 0;

                              return (
                                <li key={subitem.href}>
                                  {hasNestedSubmenu ? (
                                    <div>
                                      <button
                                        onClick={() =>
                                          router.push(subitem.submenu![0].href)
                                        }
                                        className={`
                                          w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                          transition-colors duration-200
                                          ${
                                            subActive
                                              ? "text-primary-500"
                                              : "text-grey-600 hover:text-secondary-800 hover:bg-grey-50"
                                          }
                                        `}
                                      >
                                        <span
                                          className={
                                            subActive
                                              ? "text-primary-500"
                                              : "text-grey-400"
                                          }
                                        >
                                          {subitem.icon}
                                        </span>
                                        <span className="font-normal text-sm">
                                          {subitem.label}
                                        </span>
                                      </button>
                                      <ul className="mt-1 mr-7 space-y-1">
                                        {subitem.submenu?.map((nestedItem) => {
                                          const nestedActive =
                                            pathname === nestedItem.href;
                                          return (
                                            <li key={nestedItem.href}>
                                              <button
                                                onClick={() => {
                                                  router.push(nestedItem.href);
                                                  setShowAccountDropdown(false);
                                                }}
                                                className={`
                                                  w-full flex items-center gap-2 px-4 py-2 rounded-lg
                                                  transition-colors duration-200 text-sm text-right
                                                  ${
                                                    nestedActive
                                                      ? "text-primary-500 bg-shade-50"
                                                      : "text-grey-500 hover:text-secondary-800 hover:bg-grey-50"
                                                  }
                                                `}
                                              >
                                                <span
                                                  className={`w-1.5 h-1.5 rounded-full ${
                                                    nestedActive
                                                      ? "bg-primary-500"
                                                      : "bg-grey-300"
                                                  }`}
                                                />
                                                <span>{nestedItem.label}</span>
                                              </button>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        router.push(subitem.href);
                                        setShowAccountDropdown(false);
                                      }}
                                      className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                        transition-colors duration-200
                                        ${
                                          subActive
                                            ? "text-primary-500"
                                            : "text-grey-600 hover:text-secondary-800 hover:bg-grey-50"
                                        }
                                      `}
                                    >
                                      <span
                                        className={
                                          subActive
                                            ? "text-primary-500"
                                            : "text-grey-400"
                                        }
                                      >
                                        {subitem.icon}
                                      </span>
                                      <span className="font-normal text-sm">
                                        {subitem.label}
                                      </span>
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Submenu - shown on mobile when expanded */}
                    {item.submenu && isExpanded && (
                      <ul className="md:hidden mt-1 space-y-1 bg-grey-50 rounded-lg p-2 ml-4">
                        {item.submenu.map((subitem) => {
                          const subActive = isAccountLinkActive(subitem);
                          const hasNestedSubmenu =
                            subitem.submenu && subitem.submenu.length > 0;

                          // For items with nested submenu (like subscription), navigate to first nested item
                          const targetHref = hasNestedSubmenu
                            ? subitem.submenu![0].href
                            : subitem.href;

                          return (
                            <li key={subitem.href}>
                              <Link
                                href={targetHref}
                                onClick={onClose}
                                className={`
                                  flex items-center gap-3 px-4 py-2 rounded-lg
                                  transition-colors duration-200 text-sm
                                  ${
                                    subActive
                                      ? "text-primary-500 bg-shade-50"
                                      : "text-grey-600 hover:text-secondary-800"
                                  }
                                `}
                              >
                                <span
                                  className={
                                    subActive
                                      ? "text-primary-500"
                                      : "text-grey-400"
                                  }
                                >
                                  {subitem.icon}
                                </span>
                                <span className="font-normal">
                                  {subitem.label}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile logout */}
          <div className="md:hidden px-3 pb-3 pt-0  border-grey-200 flex justify-end">
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
