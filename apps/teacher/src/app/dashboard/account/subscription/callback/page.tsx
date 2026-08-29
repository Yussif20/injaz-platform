"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardContent } from "@/content";
import { Button } from "@/shared/components/ui";
import { useMySubscription } from "@/features/dashboard/hooks/useMySubscription";

export default function SubscriptionCallbackPage() {
  const { subscription: content } = dashboardContent;
  const router = useRouter();
  const { isSubscribed, isLoading, refetch } = useMySubscription();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Refetch subscription status on mount to check if 3DS completed
    refetch().finally(() => setChecked(true));
  }, [refetch]);

  useEffect(() => {
    // Auto-redirect to manage page after 3s if active
    if (checked && isSubscribed) {
      const timer = setTimeout(() => {
        router.push("/dashboard/account/subscription/manage");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checked, isSubscribed, router]);

  if (isLoading || !checked) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-6" />
        <h2 className="text-lg font-bold text-secondary-800 mb-2">
          {content.callbackVerifying}
        </h2>
        <p className="text-sm text-grey-500 max-w-sm">
          {content.callbackVerifyingMessage}
        </p>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-success-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-secondary-800 mb-2">
          {content.callbackSuccess}
        </h2>
        <p className="text-sm text-grey-500 mb-6 max-w-sm">
          {content.callbackSuccessMessage}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/dashboard/account/subscription/manage")}
        >
          {content.callbackGoToSubscription}
        </Button>
      </div>
    );
  }

  // Subscription not active yet — show pending state with refresh button
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-grey-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-grey-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-secondary-800 mb-2">
        {content.callbackPending}
      </h2>
      <p className="text-sm text-grey-500 mb-6 max-w-sm">
        {content.callbackPendingMessage}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setChecked(false);
            refetch().finally(() => setChecked(true));
          }}
        >
          {content.callbackRefresh}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/dashboard/account/subscription/manage")}
        >
          {content.callbackGoToSubscription}
        </Button>
      </div>
    </div>
  );
}
