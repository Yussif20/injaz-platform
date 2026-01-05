"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { content } from "@/lib/content";

export const Navbar = () => {
  const { nav } = content;
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="shrink-0">
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

      {/* Auth Buttons */}
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
