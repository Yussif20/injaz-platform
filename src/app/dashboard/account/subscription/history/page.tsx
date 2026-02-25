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
        return "bg-success-100 text-success-600";
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
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-shade-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {content.historyTableHeaders.plan}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {content.historyTableHeaders.startDate}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {content.historyTableHeaders.endDate}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {content.historyTableHeaders.status}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {content.historyTableHeaders.amount}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-100">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-secondary-800">
                      {content.planTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-600">
                      {new Date(item.subscribedAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-600">
                      {new Date(item.expiresAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(item.isActive, item.paymentStatus)}`}
                      >
                        {getStatusLabel(item.isActive, item.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-800">
                      {item.finalAmount} {content.sar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
