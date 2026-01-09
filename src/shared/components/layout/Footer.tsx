import Image from "next/image";
import Link from "next/link";
import { commonContent } from "@/content";

export const Footer = () => {
  const { footer } = commonContent;

  return (
    <footer className="bg-primary-800 text-white text-sm md:text-base py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Right Half - Logo & Description */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Logo */}
            <Image
              src="/logo/logo-white.svg"
              alt="Logo"
              width={66}
              height={75}
              className="h-auto"
            />

            {/* Description */}
            <p className="text-base font-normal text-right leading-relaxed">
              {footer.description}
            </p>
          </div>

          {/* Left Half - Links & Socials */}
          <div className="flex-1 flex flex-col items-start justify-center gap-8">
            {/* Navigation Links */}
            <nav className="flex gap-8 justify-between text-right">
              <Link
                href="/sign/up"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.subscribe}
              </Link>
              <Link
                href="/profiles/new"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.createProfile}
              </Link>
              <Link
                href="/download"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.downloadApp}
              </Link>
              <Link
                href="/how-to-use"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.howToUse}
              </Link>
            </nav>

            {/* Social Links */}
            <div className="flex gap-6 justify-start">
              <a
                href={footer.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/socials/instagram.svg"
                  alt="Instagram"
                  width={35}
                  height={35}
                />
              </a>
              <a
                href={footer.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/socials/tiktok.svg"
                  alt="TikTok"
                  width={35}
                  height={35}
                />
              </a>
              <a
                href={footer.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/socials/whatsapp.svg"
                  alt="WhatsApp"
                  width={35}
                  height={35}
                />
              </a>
              <a
                href={footer.socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image src="/socials/x.svg" alt="X" width={35} height={35} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
