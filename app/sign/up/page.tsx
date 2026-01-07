import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-stretch p-0">
      <div className="w-full h-full max-w-none bg-white rounded-tl-[100px] rounded-bl-[100px] p-8 lg:p-12 shadow-sm flex flex-col justify-center gap-6">
        {/* Logo */}
        <div className="flex justify-end">
          <Link href="/">
            <Image
              src="/logo/logo-cyan.svg"
              alt="شعار إنجاز معلم"
              width={70}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-right">
          <h1 className="text-[28px] font-normal text-text-dark">إنشاء حساب</h1>
          <p className="text-[18px] font-light text-[#D4D4D4] mt-2">
            مرحبا بك، سجل بياناتك لإنشاء حساب جديد
          </p>
        </div>

        {/* Placeholder for form */}
        <div className="text-center text-text-dark">
          <p>نموذج إنشاء الحساب قيد الإنشاء</p>
        </div>

        {/* Sign In Link */}
        <div className="text-right text-primary-500 text-[18px] font-light">
          <Link href="/sign/in">لديك حساب بالفعل؟ تسجيل الدخول</Link>
        </div>

        {/* Customer Service Icon */}
        <div className="flex justify-end mt-2">
          <Link
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="h-20 w-20 rounded-full bg-primary-500 hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center"
          >
            <Image
              src="/pages/sign/customer-service.svg"
              alt="خدمة العملاء"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
