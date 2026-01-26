"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

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

export const AccountSidebar: React.FC = () => {
  const pathname = usePathname();
  const { accountSidebar } = dashboardContent;
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Auto-expand menus if on their pages
  useEffect(() => {
    const menusToExpand: string[] = [];
    if (pathname.startsWith(ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION)) {
      menusToExpand.push(ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION);
    }
    if (pathname.startsWith(ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA)) {
      menusToExpand.push(ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA);
    }
    setExpandedMenus(menusToExpand);
  }, [pathname]);

  const navItems: AccountNavItem[] = [
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

  const isActive = (item: AccountNavItem) => {
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

  const isSubActive = (href: string) => {
    return pathname === href;
  };

  const isMenuExpanded = (href: string) => {
    return expandedMenus.includes(href);
  };

  const toggleMenu = (href: string) => {
    if (isMenuExpanded(href)) {
      setExpandedMenus(expandedMenus.filter((m) => m !== href));
    } else {
      setExpandedMenus([...expandedMenus, href]);
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-xl lg:rounded-2xl p-4">
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            const isExpanded = isMenuExpanded(item.href);

            return (
              <li key={item.href}>
                {item.submenu ? (
                  // Item with submenu - use Link for navigation, click expands/collapses
                  <>
                    <Link
                      href={item.submenu[0].href}
                      onClick={() => {
                        if (!isExpanded) {
                          toggleMenu(item.href);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-colors duration-200
                        ${
                          active
                            ? "text-primary-500"
                            : "text-grey-600 hover:text-secondary-800 hover:bg-grey-50"
                        }
                      `}
                    >
                      <span
                        className={active ? "text-primary-500" : "text-grey-400"}
                      >
                        {item.icon}
                      </span>
                      <span className="font-normal text-sm">{item.label}</span>
                    </Link>

                    {/* Submenu */}
                    {isExpanded && (
                      <ul className="mt-1 mr-7 space-y-1">
                        {item.submenu.map((subitem) => {
                          const subActive = isSubActive(subitem.href);
                          return (
                            <li key={subitem.href}>
                              <Link
                                href={subitem.href}
                                className={`
                                  flex items-center gap-2 px-4 py-2 rounded-lg
                                  transition-colors duration-200 text-sm
                                  ${
                                    subActive
                                      ? "text-primary-500 bg-shade-50"
                                      : "text-grey-500 hover:text-secondary-800 hover:bg-grey-50"
                                  }
                                `}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    subActive ? "bg-primary-500" : "bg-grey-300"
                                  }`}
                                />
                                <span>{subitem.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  // Regular item without submenu
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-colors duration-200
                      ${
                        active
                          ? "text-primary-500"
                          : "text-grey-600 hover:text-secondary-800 hover:bg-grey-50"
                      }
                    `}
                  >
                    <span
                      className={active ? "text-primary-500" : "text-grey-400"}
                    >
                      {item.icon}
                    </span>
                    <span className="font-normal text-sm">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
