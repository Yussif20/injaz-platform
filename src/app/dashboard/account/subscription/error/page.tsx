"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

const validReasons = [
  "invalid_request",
  "payment_not_found",
  "payment_failed",
  "processing_error",
] as const;

type ErrorReason = (typeof validReasons)[number];

function SubscriptionErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription: content } = dashboardContent;

  const reasonParam = searchParams.get("reason");
  const reason =
    reasonParam && validReasons.includes(reasonParam as ErrorReason)
      ? (reasonParam as ErrorReason)
      : null;

  const message = reason
    ? content.errorReasons[reason]
    : content.errorDefaultReason;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
      {/* Error icon — red circle with X */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        role="presentation"
      >
        <circle cx="60" cy="60" r="56" stroke="#EF4444" strokeWidth="4" />
        <path
          d="M42 42L78 78M78 42L42 78"
          stroke="#EF4444"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">
        {content.errorTitle}
      </h1>
      <p className="text-grey-500 text-sm sm:text-base mb-8 max-w-md">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() =>
            router.push(ROUTES.DASHBOARD_ACCOUNT_SUBSCRIPTION_MANAGE)
          }
          className="min-w-[200px] font-light!"
        >
          {content.errorRetry}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="min-w-[200px] font-light!"
        >
          {content.errorBackHome}
        </Button>
      </div>
    </div>
  );
}

export default function SubscriptionErrorPage() {
  return (
    <Suspense>
      <SubscriptionErrorContent />
    </Suspense>
  );
}
