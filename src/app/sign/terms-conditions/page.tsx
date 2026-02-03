import Link from "next/link";
import { ROUTES } from "@/config";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Coming Soon Text */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-secondary-700 mb-4">
          قيد الإنشاء
        </h1>
        <p className="text-lg sm:text-xl text-grey-600 mb-8">
          نعمل على تطوير صفحة الشروط والأحكام
        </p>

        {/* Back Link */}
        <Link
          href={ROUTES.HOME}
          className="inline-block px-8 py-3 bg-primary-500 text-white font-normal rounded-xl hover:bg-primary-600 transition-colors"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
