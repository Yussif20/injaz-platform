import Link from "next/link";
import { Button } from "@/components/ui";
import { content } from "@/lib/content";

export const ComingSoon = () => {
  const { comingSoon } = content;

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #009499 0%, #D6E7E7 15%, #FFFFFF 100%)",
      }}
    >
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-normal text-primary-500 mb-4">
            {comingSoon.title}
          </h1>
          <p className="text-2xl font-light text-text-dark">
            {comingSoon.subtitle}
          </p>
        </div>

        {/* Decorative Icon */}
        <div className="mb-12">
          <svg
            className="w-32 h-32 mx-auto text-primary-500 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
        </div>

        {/* Back Button */}
        <Link className="inline-block" href="/">
          <Button variant="primary" size="lg">
            {comingSoon.backToHome}
          </Button>
        </Link>
      </div>
    </main>
  );
};
