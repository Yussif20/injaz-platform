import Image from "next/image";
import Link from "next/link";
import { commonContent } from "@/content";

export const Footer = () => {
  const { footer } = commonContent;

  return (
    <footer className="bg-primary-800 text-white text-sm md:text-base py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-12">
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
            <p className="text-sm md:text-base font-normal text-right leading-relaxed">
              {footer.description}
            </p>
          </div>

          {/* Left Half - Links & Socials */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-8">
            {/* Navigation Links */}
            <nav className="flex flex-col md:flex-row items-center gap-8 justify-between text-right">
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
              <Link
                href="/sign/support"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.technicalSupport}
              </Link>
              <Link
                href="/sign/terms-conditions"
                className="text-base font-normal hover:text-primary-300 transition-colors"
              >
                {footer.links.termsConditions}
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
                  src="icons/social/instagram.svg"
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
                  src="icons/social/tiktok.svg"
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
                  src="icons/social/whatsapp.svg"
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
                <Image
                  src="icons/social/x.svg"
                  alt="X"
                  width={35}
                  height={35}
                />
              </a>
            </div>

            {/* Download App Section */}
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-normal">{footer.downloadApp}</h3>
              <div className="flex gap-4 items-center">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80 bg-white rounded-lg"
                >
                  <Image
                    src="/images/landing/mobile-app/app-store-button.svg"
                    alt="Download on App Store"
                    width={140}
                    height={42}
                  />
                </a>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80 rounded-lg"
                >
                  <Image
                    src="/images/landing/mobile-app/play-store-button.svg"
                    alt="Get it on Google Play"
                    width={140}
                    height={28}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
