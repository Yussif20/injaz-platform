"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui";
import { commonContent } from "@/content";

export const Navbar = () => {
  const { nav } = commonContent;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: nav.home },
    { href: "/download", label: nav.downloadApp },
    { href: "/profiles/new", label: nav.createProfile },
    { href: "/how-to-use", label: nav.howToUse },
  ];

  return (
    <nav className="relative flex flex-row-reverse lg:flex-row items-center justify-between py-10">
      {/* Logo - visible on small and large screens */}
      <div className="shrink-0 md:hidden lg:block">
        <Image
          src="/logo/logo-white.svg"
          alt="Logo"
          width={40}
          height={48}
          className="h-12 w-10"
        />
      </div>

      {/* Auth Buttons - Left side on medium screens only */}
      <div className="hidden md:flex lg:hidden gap-4">
        <Link href="/sign/in">
          <Button variant="primary" size="sm">
            {nav.login}
          </Button>
        </Link>
        <Link href="/sign/up">
          <Button variant="outline" size="sm">
            {nav.signup}
          </Button>
        </Link>
      </div>

      {/* Navigation Links - visible on lg and up */}
      <div className="hidden lg:flex gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-normal hover:text-primary-500 transition-colors ${
              pathname === link.href ? "text-primary-500" : "text-text-dark"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Burger Button - small and medium screens */}
      <button
        type="button"
        className="lg:hidden flex items-center justify-center p-2"
        onClick={toggleMenu}
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
      >
        {isOpen ? (
          <Image
            src="/icons/ui/cancel.svg"
            alt="أغلق القائمة"
            width={28}
            height={28}
          />
        ) : (
          <Image
            src="/icons/ui/menu.svg"
            alt="افتح القائمة"
            width={28}
            height={28}
          />
        )}
      </button>

      {/* Menu - small and medium screens */}
      <div
        className={`py-7 px-6 absolute top-full right-0 bg-white shadow-lg rounded-2xl border border-shade-200 lg:hidden z-50 transition-all duration-200 ease-out origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4 text-right whitespace-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm md:text-lg font-light hover:text-primary-500 transition-colors ${
                pathname === link.href ? "text-primary-500" : "text-text-dark"
              }`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {/* Auth buttons - only on small screens */}
          <div className="flex flex-col gap-3 md:hidden">
            <Link href="/sign/in" onClick={closeMenu}>
              <Button
                variant="primary"
                size="sm"
                className="w-full font-light! p-4!"
              >
                {nav.login}
              </Button>
            </Link>
            <Link href="/sign/up" onClick={closeMenu}>
              <Button
                variant="outline"
                size="sm"
                className="w-full font-light! p-4!"
              >
                {nav.signup}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Buttons - Right side on large screens */}
      <div className="hidden lg:flex gap-4">
        <Link href="/sign/in">
          <Button variant="primary" size="sm">
            {nav.login}
          </Button>
        </Link>
        <Link href="/sign/up">
          <Button variant="outline" size="sm">
            {nav.signup}
          </Button>
        </Link>
      </div>
    </nav>
  );
};
