"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

interface AccountNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const AccountSidebar: React.FC = () => {
  const pathname = usePathname();
  const { accountSidebar } = dashboardContent;

  const navItems: AccountNavItem[] = [
    {
      label: accountSidebar.accountInfo,
      href: ROUTES.DASHBOARD_ACCOUNT_INFO,
      icon: (
        <img src="/icons/profile.svg" alt="account info" className="w-5 h-5" />
      ),
    },
    {
      label: accountSidebar.profileData,
      href: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA,
      icon: (
        <img
          src="/icons/file-edit.svg"
          alt="profile data"
          className="w-5 h-5"
        />
      ),
    },
    {
      label: accountSidebar.subscription,
      href: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION,
      icon: (
        <img
          src="/icons/subscription.svg"
          alt="subscription"
          className="w-5 h-5"
        />
      ),
    },
    {
      label: accountSidebar.support,
      href: ROUTES.DASHBOARD_ACCOUNT_SUPPORT,
      icon: <img src="/icons/support.svg" alt="support" className="w-5 h-5" />,
    },
    {
      label: accountSidebar.terms,
      href: ROUTES.DASHBOARD_ACCOUNT_TERMS,
      icon: <img src="/icons/policy.svg" alt="terms" className="w-5 h-5" />,
    },
    {
      label: accountSidebar.howToUse,
      href: ROUTES.DASHBOARD_ACCOUNT_HOW_TO_USE,
      icon: (
        <img src="/icons/youtube.svg" alt="how to use" className="w-5 h-5" />
      ),
    },
    {
      label: accountSidebar.filePassword,
      href: ROUTES.DASHBOARD_ACCOUNT_FILE_PASSWORD,
      icon: (
        <img src="/icons/lock.svg" alt="file password" className="w-5 h-5" />
      ),
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-full lg:w-64 bg-white rounded-xl lg:rounded-2xl p-4">
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
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
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
