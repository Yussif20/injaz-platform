import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-primary-500 flex">
      {/* Left Half - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/pages/sign/sign-bg.svg"
          alt="Sign Up Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Half - Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md bg-[#1F1F1F] rounded-tl-[100px] rounded-bl-[100px] p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            إنشاء حساب
          </h1>

          {/* Placeholder for form - user will add form content here */}
          <div className="text-white text-center">
            <p>نموذج إنشاء الحساب قيد الإنشاء</p>
          </div>
        </div>
      </div>
    </div>
  );
}
