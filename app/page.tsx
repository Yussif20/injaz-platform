import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhySection } from "@/components/sections/WhySection";
import { BannerSection } from "@/components/sections/BannerSection";
import { HowToSection } from "@/components/sections/HowToSection";
import { DesignChoiceSection } from "@/components/sections/DesignChoiceSection";
import { MobileAppSection } from "@/components/sections/MobileAppSection";
import { Footer } from "@/components/sections/Footer";

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
      <div className="flex flex-col gap-20">
        <WhySection />
        <HowToSection />
        <BannerSection />
        <DesignChoiceSection />
        <MobileAppSection />
        <Footer />
      </div>
    </main>
  );
}
