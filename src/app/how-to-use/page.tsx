import { Navbar, Footer } from "@/shared/components/layout";
import { HowToSection } from "@/features/landing";

export default function HowToUsePage() {
  return (
    <main className="min-h-screen">
      {/* Hero gradient: same as landing */}
      <div className="bg-[linear-gradient(to_bottom,#009499_0%,#D6E7E7_15%,#FFFFFF_100%)]">
        <div className="max-w-[90%] mx-auto flex flex-col gap-12">
          <Navbar />
          <section className="flex flex-col gap-4 items-center justify-center py-8 sm:py-12 lg:py-9">
          </section>
        </div>
      </div>

      <HowToSection />
      <Footer />
    </main>
  );
}
