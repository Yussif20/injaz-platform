"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
      icon: (
        <Image
          src="/icons/ui/file-edit.svg"
          alt="profile data"
          width={20}
          height={20}
        />
      ),
    },
    {
      label: accountSidebar.subscription,
      href: ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION,
      icon: (
        <Image
          src="/icons/ui/subscription.svg"
          alt="subscription"
          width={20}
          height={20}
        />
      ),
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

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD_ACCOUNT_INFO) {
      // Highlight Account Info when on change password page as well
      return (
        pathname === href ||
        pathname === ROUTES.DASHBOARD_ACCOUNT_CHANGE_PASSWORD
      );
    }
    return pathname === href;
  };

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
