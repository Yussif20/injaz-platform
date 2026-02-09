"use client";

import Image from "next/image";
import { useAuthContext } from "@/features/auth/context";
import { CircleUserRound, ChevronDown } from "lucide-react";

interface NavbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function Navbar({ isMenuOpen, onMenuToggle }: NavbarProps) {
  const { user } = useAuthContext();

  return (
    <header className="flex h-16 items-center justify-between border-b border-grey-200 bg-white px-6">
      {/* Start: sidebar toggle */}
      <button
        onClick={onMenuToggle}
        className={`cursor-pointer rounded-lg p-2 text-grey-500 transition-transform hover:bg-grey-100 ${
          isMenuOpen ? "rotate-0" : "rotate-180"
        }`}
      >
        <Image src="/icons/sidebar-menu.svg" alt="" width={25} height={25} />
      </button>

      {/* End: user info */}
      <div className="flex items-center gap-2">
        <CircleUserRound className="h-6 w-6 text-grey-400" />
        {user && (
          <span className="text-sm font-medium text-grey-700">{user.name}</span>
        )}
        <ChevronDown className="h-4 w-4 text-grey-400" />
      </div>
    </header>
  );
}
