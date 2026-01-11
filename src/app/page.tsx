import { Navbar, Footer } from "@/shared/components/layout";
import {
  HeroSection,
  WhySection,
  BannerSection,
  HowToSection,
  DesignChoiceSection,
  MobileAppSection,
  TestimonialsSection,
  FAQSection,
  SubscriptionSection,
  ShareExperienceSection,
} from "@/features/landing";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Gradient Background for Hero */}
      <div className="bg-[linear-gradient(to_bottom,#009499_0%,#D6E7E7_15%,#FFFFFF_100%)]">
        <div className="max-w-[90%] mx-auto flex flex-col gap-20">
          <Navbar />
          <HeroSection />
        </div>
      </div>

      {/* White Background Sections */}
      <WhySection />
      <HowToSection />
      <BannerSection />
      <DesignChoiceSection />
      <MobileAppSection />
      <SubscriptionSection />
      <FAQSection />
      <TestimonialsSection />
      <ShareExperienceSection />
      <Footer />
    </main>
  );
}
