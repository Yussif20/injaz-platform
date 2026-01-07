import Image from "next/image";

export default function SignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-500 flex">
      {/* Left Half - Form Container (changes per route) */}
      {children}

      {/* Right Half - Image (constant) */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/pages/sign/sign-bg.svg"
          alt="Sign In Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
