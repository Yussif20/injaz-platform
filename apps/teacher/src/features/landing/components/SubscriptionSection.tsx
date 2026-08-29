import Image from "next/image";
import Link from "next/link";
import { landingContent } from "@/content";
import { ROUTES } from "@/config";

export function SubscriptionSection() {
  const { subscriptionSection } = landingContent;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Image
          src="/images/landing/subscription/subscription-mobile.svg"
          alt={subscriptionSection.imageAlt}
          width={1920}
          height={600}
          className="block w-full h-auto md:hidden"
          priority
          sizes="100vw"
        />
        <Image
          src="/images/landing/subscription/subscription-desktop.svg"
          alt={subscriptionSection.imageAlt}
          width={1920}
          height={600}
          className="hidden md:block w-full h-auto"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}
