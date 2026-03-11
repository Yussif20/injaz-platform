import DOMPurify from "isomorphic-dompurify";
import { dashboardContent } from "@/content";
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

export default async function TermsPage() {
  const { breadcrumb } = dashboardContent;
  const html = await fetchTermsContent();

  return (
    <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[400px] text-right">
      <h1 className="text-xl sm:text-2xl font-semibold text-secondary-800 mb-8">
        {breadcrumb.terms}
      </h1>

      {html ? (
        <div
          className="prose prose-sm sm:prose max-w-none text-right leading-relaxed text-grey-600"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
        />
      ) : (
        <p className="text-sm text-grey-500">لا توجد شروط وأحكام متاحة حالياً.</p>
      )}
    </div>
  );
}
