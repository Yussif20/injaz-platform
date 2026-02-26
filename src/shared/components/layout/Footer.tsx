import Image from "next/image";
import Link from "next/link";
import { commonContent } from "@/content";
import { BACKEND_API_URL } from "@/shared/lib/api";
import { getAccessToken } from "@/shared/lib/cookies";

interface SystemParameterDto {
  id: number;
  key: string;
  value: string;
  dataType: string;
  category: string;
  isActive: boolean;
}

async function fetchSocials(): Promise<Map<string, string>> {
  try {
    const token = await getAccessToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(
      `${BACKEND_API_URL}/api/SystemParameters/category/socials`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return new Map();
    const json = await res.json();
    if (json.status !== "Success" || !Array.isArray(json.data)) return new Map();
    return new Map<string, string>(
      (json.data as SystemParameterDto[]).map((p) => [p.key, p.value]),
    );
  } catch {
    return new Map();
  }
}

const SOCIAL_ICONS = [
  { key: "instagram", src: "icons/social/instagram.svg", alt: "Instagram" },
  { key: "tiktok",    src: "icons/social/tiktok.svg",    alt: "TikTok"    },
  { key: "snapchat",  src: "icons/social/snapchat.svg",  alt: "Snapchat"  },
  { key: "x",         src: "icons/social/x.svg",         alt: "X"         },
  { key: "facebook",  src: "icons/social/facebook.svg",  alt: "Facebook"  },
  { key: "youtube",   src: "icons/social/youtube.svg",   alt: "YouTube"   },
];

export const Footer = async () => {
  const { footer } = commonContent;
  const socials = await fetchSocials();

  const phone = socials.get("phone") || footer.phoneNumber;
  const email = socials.get("email") || footer.emailAddress;

  const activeSocials = SOCIAL_ICONS.filter(({ key }) => socials.get(key));

  return (
    <footer className="bg-primary-800 text-white text-sm md:text-base py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Right Half - Logo, Description & Download App */}
          <div className="flex-1 flex flex-col gap-8">
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

          {/* Left Half - Two Columns: Quick Links (Right) & Contact + Social (Left) */}
          <div className="flex-[1.5] flex flex-col lg:flex-row gap-8">
            {/* Right Column - Quick Links */}
            <div className="lg:flex-1 flex flex-col gap-4">
              <h3 className="text-base font-normal text-right">
                {footer.quickLinks}
              </h3>
              <nav className="flex flex-col gap-3 text-right">
                <Link
                  href="/sign/up"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.subscribe}
                </Link>
                <Link
                  href="/profiles/new"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.createProfile}
                </Link>
                <Link
                  href="/download"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.downloadApp}
                </Link>
                <Link
                  href="/how-to-use"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.howToUse}
                </Link>
                <Link
                  href="/sign/support"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.technicalSupport}
                </Link>
                <Link
                  href="/sign/terms-conditions"
                  className="font-normal hover:text-primary-300 transition-colors"
                >
                  {footer.links.termsConditions}
                </Link>
              </nav>
            </div>

            {/* Left Column - Contact & Social */}
            <div className="lg:flex-1 flex flex-col gap-6">
              {/* Contact Us Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-normal text-right">
                  {footer.contactUs}
                </h3>
                <div className="flex flex-col gap-4 text-sm">
                  {/* Phone */}
                  {phone && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src="icons/social/phone.svg"
                          alt="Phone"
                          width={20}
                          height={20}
                        />
                        <span className="font-normal text-sm">
                          {footer.phone}:
                        </span>
                      </div>
                      <a
                        href={`tel:${phone}`}
                        className="text-sm font-light text-right hover:text-primary-300 transition-colors ltr"
                        dir="ltr"
                      >
                        {phone}
                      </a>
                    </div>
                  )}
                  {/* Email */}
                  {email && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src="icons/social/email.svg"
                          alt="Email"
                          width={20}
                          height={20}
                        />
                        <span className="font-normal text-sm">
                          {footer.email}:
                        </span>
                      </div>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm font-light text-right hover:text-primary-300 transition-colors ltr"
                        dir="ltr"
                      >
                        {email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Follow Us Section — only rendered when at least one social is set */}
              {activeSocials.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-normal text-right">
                    {footer.followUs}
                  </h3>
                  <div className="flex gap-6">
                    {activeSocials.map(({ key, src, alt }) => (
                      <a
                        key={key}
                        href={socials.get(key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <Image src={src} alt={alt} width={35} height={35} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
