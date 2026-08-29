import { Navbar, Footer } from "@/shared/components/layout";
import { MobileAppSection } from "@/features/landing";

export default function DownloadPage() {
  return (
    <main className="min-h-screen">
      {/* Hero gradient: same as landing */}
      <div className="bg-[linear-gradient(to_bottom,#009499_0%,#D6E7E7_15%,#FFFFFF_100%)]">
        <div className="max-w-[90%] mx-auto flex flex-col gap-12">
          <Navbar />
          <section className="flex flex-col gap-4 items-center justify-center py-8 sm:py-12 lg:py-9">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-text-dark text-center">
              تحميل التطبيق
            </h1>
          </section>
        </div>
      </div>

      <MobileAppSection />
      <Footer />
    </main>
  );
}
