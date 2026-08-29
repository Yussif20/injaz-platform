"use client";

import React from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";
import { useSubscriptionHistory } from "@/features/dashboard/hooks/useSubscriptionHistory";

function getStatusFromSubscription(isActive: boolean, paymentStatus: string) {
  if (paymentStatus === "Refunded") return "cancelled";
  if (isActive) return "active";
  return "expired";
}

export default function SubscriptionHistoryPage() {
  const { subscription: content } = dashboardContent;
  const { history, isLoading } = useSubscriptionHistory();

  const getStatusLabel = (isActive: boolean, paymentStatus: string) => {
    const status = getStatusFromSubscription(isActive, paymentStatus);
    switch (status) {
      case "active":
        return content.statusActive;
      case "expired":
        return content.statusExpired;
      case "cancelled":
        return content.statusCancelled;
    }
  };

  const getStatusColor = (isActive: boolean, paymentStatus: string) => {
    const status = getStatusFromSubscription(isActive, paymentStatus);
    switch (status) {
      case "active":
        return "bg-[#E6FFE8] text-[#03960D]";
      case "expired":
        return "bg-grey-100 text-grey-600";
      case "cancelled":
        return "bg-warning-100 text-warning-600";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-grey-100 rounded-xl h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-6 flex items-start justify-between gap-4"
            >
              {/* Right side: dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] sm:text-[18px] lg:text-[20px] font-normal text-[#333333]">
                    {content.historySubscriptionDateLabel}
                  </p>
                  <p className="text-[12px] sm:text-[16px] lg:text-[18px] font-normal text-[#666666]">
                    {new Date(item.subscribedAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] sm:text-[18px] lg:text-[20px] font-normal text-[#333333]">
                    {content.historyRenewalDateLabel}
                  </p>
                  <p className="text-[12px] sm:text-[16px] lg:text-[18px] font-normal text-[#666666]">
                    {new Date(item.expiresAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>

              {/* Left side: status + amount */}
              <div className="space-y-3 text-left flex flex-col items-start">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[12px] sm:text-[14px] lg:text-[18px] font-normal ${getStatusColor(item.isActive, item.paymentStatus)}`}
                >
                  {getStatusLabel(item.isActive, item.paymentStatus)}
                </span>
                <div className="flex items-center gap-1">
                  <p className="text-[14px] sm:text-[18px] lg:text-[20px] font-normal text-[#333333]">
                    {content.historyAmountLabel}
                  </p>
                  <p className="text-[12px] sm:text-[16px] lg:text-[18px] font-normal text-[#666666]">
                    {item.finalAmount}{content.sar}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-64 h-48">
            <Image
              src="/images/dashboard/subscription.svg"
              alt="No subscription history"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
