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

  return (
    <nav className="relative flex items-center justify-between py-2">
      {/* Logo (always visible) */}
      <div className="shrink-0">
        <Image
          src="logo/logo-white.svg"
          alt="Logo"
          width={40}
          height={48}
          className="h-12 w-10"
        />
      </div>

      {/* Tabs (md and up) */}
      <div className="hidden lg:flex gap-6">
        <Link
          href="/"
          className={`text-lg font-normal hover:text-primary-500 transition-colors ${
            pathname === "/" ? "text-primary-500" : "text-text-dark"
          }`}
        >
          {nav.home}
        </Link>
        <Link
          href="/download"
          className={`text-lg font-normal hover:text-primary-500 transition-colors ${
            pathname === "/download" ? "text-primary-500" : "text-text-dark"
          }`}
        >
          {nav.downloadApp}
        </Link>
        <Link
          href="/profiles/new"
          className={`text-lg font-normal hover:text-primary-500 transition-colors ${
            pathname === "/profiles/new" ? "text-primary-500" : "text-text-dark"
          }`}
        >
          {nav.createProfile}
        </Link>
        <Link
          href="/how-to-use"
          className={`text-lg font-normal hover:text-primary-500 transition-colors ${
            pathname === "/how-to-use" ? "text-primary-500" : "text-text-dark"
          }`}
        >
          {nav.howToUse}
        </Link>
      </div>
      {/* Burger Button (mobile only) */}
      <button
        type="button"
        className="md:hidden flex items-center justify-center p-2"
        onClick={toggleMenu}
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
      >
        {isOpen ? (
          <Image
            src="/icons/cancel.svg"
            alt="أغلق القائمة"
            width={28}
            height={28}
          />
        ) : (
          <Image
            src="/icons/menu.svg"
            alt="افتح القائمة"
            width={28}
            height={28}
          />
        )}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-full max-w-[90vw] bg-white shadow-lg rounded-2xl border border-shade-200 p-6 lg:hidden">
          <div className="flex flex-col gap-4 text-right">
            <Link
              href="/"
              className={`text-lg font-normal hover:text-primary-500 transition-colors ${
                pathname === "/" ? "text-primary-500" : "text-text-dark"
              }`}
              onClick={closeMenu}
            >
              {nav.home}
            </Link>
            <Link
              href="/download"
              className={`text-lg font-normal hover:text-primary-500 transition-colors ${
                pathname === "/download" ? "text-primary-500" : "text-text-dark"
              }`}
              onClick={closeMenu}
            >
              {nav.downloadApp}
            </Link>
            <Link
              href="/profiles/new"
              className={`text-lg font-normal hover:text-primary-500 transition-colors ${
                pathname === "/profiles/new"
                  ? "text-primary-500"
                  : "text-text-dark"
              }`}
              onClick={closeMenu}
            >
              {nav.createProfile}
            </Link>
            <Link
              href="/how-to-use"
              className={`text-lg font-normal hover:text-primary-500 transition-colors ${
                pathname === "/how-to-use"
                  ? "text-primary-500"
                  : "text-text-dark"
              }`}
              onClick={closeMenu}
            >
              {nav.howToUse}
            </Link>
            <Link
              href="/sign/in"
              className="text-lg font-normal hover:text-primary-500 transition-colors text-text-dark"
              onClick={closeMenu}
            >
              {nav.login}
            </Link>
            <Link
              href="/sign/up"
              className="text-lg font-normal hover:text-primary-500 transition-colors text-text-dark"
              onClick={closeMenu}
            >
              {nav.signup}
            </Link>
          </div>
        </div>
      )}
      {/* Auth Buttons (md and up) */}
      <div className="hidden md:flex gap-4">
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
