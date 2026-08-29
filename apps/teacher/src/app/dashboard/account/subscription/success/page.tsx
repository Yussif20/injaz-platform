"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { dashboardContent } from "@/content";
import { ROUTES } from "@/config";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { subscription: content } = dashboardContent;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
      <Image
        src="/images/dashboard/subscription-success.svg"
        alt=""
        role="presentation"
        width={320}
        height={240}
        className="w-full max-w-sm h-auto mb-6"
      />
      <h1 className="text-xl sm:text-2xl font-bold text-text-dark mb-2">
        {content.successTitle}
      </h1>
      <p className="text-grey-500 text-sm sm:text-base mb-8 max-w-md">
        {content.successSubtitle}
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => router.push(ROUTES.DASHBOARD)}
        className="min-w-[200px] font-light!"
      >
        {content.successBackHome}
      </Button>
    </div>
  );
}
