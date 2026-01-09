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
          className="pointer-events-none absolute inset-y-0 left-0 w-full z-0 bg-no-repeat bg-left bg-contain"
          style={{ backgroundImage: "url('/pages/sign/sign-bg.svg')" }}
        />

        {/* Foreground: form overlay, takes 1/2 width */}
        <div className="relative z-10 min-h-screen w-full flex items-stretch">
          <div className="w-7/12">{children}</div>
        </div>
      </div>

      {/* Small and medium screens: stacked layout with image at top, form below */}
      <div className="lg:hidden flex flex-col bg-primary-500">
        {/* Background image at top, full width */}
        <div
          className="w-full bg-no-repeat bg-top"
          style={{
            backgroundImage: "url('/pages/sign/sign-bg.svg')",
            height: "30vh",
          }}
        />

        {/* Form below image */}
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
