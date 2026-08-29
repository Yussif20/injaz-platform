import DOMPurify from "isomorphic-dompurify";
import { Navbar, Footer } from "@/shared/components/layout";
import { serverApi } from "@/shared/lib/api";
import { getAccessToken } from "@/shared/lib/cookies";

async function fetchTermsContent(): Promise<string | null> {
  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await serverApi.get(
      "/api/SystemParameters/terms-and-conditions",
      { headers },
    );
    const data = response.data;
    if (data?.status !== "Success" || !data.data?.content) return null;
    return data.data.content as string;
  } catch {
    return null;
  }
}

export default async function TermsPage() {
  const html = await fetchTermsContent();

  return (
    <main className="min-h-screen">
      {/* Gradient from nav through end of terms content */}
      <div className="bg-[linear-gradient(to_bottom,#009499_0%,#D6E7E7_15%,#FFFFFF_100%)]">
        <div className="max-w-[90%] mx-auto flex flex-col gap-12">
          <Navbar />
          {/* Hero: title only */}
          <section className="flex flex-col gap-4 items-center justify-center py-8 sm:py-12 lg:py-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-text-dark text-center">
              الشروط والأحكام
            </h1>
          </section>
        </div>

        {/* Terms content inside gradient so gradient runs to end of content */}
        {!html ? (
          <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium text-secondary-700 mb-4">
              قيد الإنشاء
            </h2>
            <p className="text-lg text-grey-600">
              نعمل على تطوير صفحة الشروط والأحكام
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 pb-16">
            <div
              className="prose prose-sm sm:prose max-w-none text-right leading-relaxed text-grey-700"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
