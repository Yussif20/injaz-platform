export default function SignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Large screens: layered background with form overlay */}
      <div className="hidden lg:block relative min-h-screen w-full bg-primary-500 overflow-hidden">
        {/* Background image anchored to the left, full height */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full z-0 bg-no-repeat bg-left bg-cover lg:bg-contain"
          style={{ backgroundImage: "url('/images/auth/sign-bg.svg')" }}
        />

        {/* Foreground: form overlay */}
        <div className="relative z-10 min-h-screen w-full flex items-stretch">
          <div className="w-full lg:w-1/2">{children}</div>
        </div>
      </div>

      {/* Small and medium screens: stacked layout with image at top, form below */}
      <div className="lg:hidden flex flex-col min-h-screen bg-primary-500">
        {/* Background image at top */}
        <div
          className="w-full bg-no-repeat bg-center bg-contain shrink-0"
          style={{
            backgroundImage: "url('/images/auth/sign-bg.svg')",
            height: "40vh",
            minHeight: "150px",
          }}
        />

        {/* Form below image */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </>
  );
}
