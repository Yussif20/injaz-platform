"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { content } from "@/lib/content";

export const Navbar = () => {
  const { nav } = content;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="shrink-0 hidden md:block">
        <Image
          src="logo/logo-white.svg"
          alt="Logo"
          width={40}
          height={40}
          className="h-14 w-14"
        />
      </div>

      {/* Tabs */}
      <div className="hidden md:flex gap-8">
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
          href="/teacher/profiles/new"
          className={`text-lg font-normal hover:text-primary-500 transition-colors ${
            pathname === "/teacher/profiles/new"
              ? "text-primary-500"
              : "text-text-dark"
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
      {/* Burger Button (md and below) */}
      <button
        type="button"
        className="lg:hidden flex items-center justify-center p-2"
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
              href="/teacher/profiles/new"
              className={`text-lg font-normal hover:text-primary-500 transition-colors ${
                pathname === "/teacher/profiles/new"
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
          </div>
        </div>
      )}
      {/* Auth Buttons (always visible) */}
      <div className="flex gap-4">
        <Link href="/teacher/login">
          <Button variant="primary" size="sm">
            {nav.login}
          </Button>
        </Link>
        <Link href="/teacher/register">
          <Button variant="outline" size="sm">
            {nav.signup}
          </Button>
        </Link>
      </div>
    </nav>
  );
};
