import Link from "next/link";
import { ROUTES } from "@/config";
import { BACKEND_API_URL } from "@/shared/lib/api";
import { getAccessToken } from "@/shared/lib/cookies";

async function fetchTermsContent(): Promise<string | null> {
  try {
    const token = await getAccessToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(
      `${BACKEND_API_URL}/api/SystemParameters/terms-and-conditions`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "Success" || !json.data?.content) return null;
    return json.data.content as string;
  } catch {
    return null;
  }
}

export default async function TermsConditionsPage() {
  const html = await fetchTermsContent();

  if (!html) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center bg-white px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-secondary-700 mb-4">
            قيد الإنشاء
          </h1>
          <p className="text-lg sm:text-xl text-grey-600 mb-8">
            نعمل على تطوير صفحة الشروط والأحكام
          </p>
          <Link
            href={ROUTES.HOME}
            className="inline-block px-8 py-3 bg-primary-500 text-white font-normal rounded-xl hover:bg-primary-800 transition-colors"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-secondary-800 mb-8 text-right">
          الشروط والأحكام
        </h1>
        <div
          className="prose prose-sm sm:prose max-w-none text-right leading-relaxed text-grey-700"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="mt-10 text-center">
          <Link
            href={ROUTES.HOME}
            className="inline-block px-8 py-3 bg-primary-500 text-white font-normal rounded-xl hover:bg-primary-800 transition-colors"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
