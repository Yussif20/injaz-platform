"use client";

import React from "react";
import Image from "next/image";
import { dashboardContent } from "@/content";

export default function SubscriptionHistoryPage() {
  const { subscription } = dashboardContent;

  // TODO: Replace with real subscription history from API
  const subscriptionHistory: Array<{
    id: number;
    plan: string;
    startDate: string;
    endDate: string;
    status: "active" | "expired" | "cancelled";
    amount: string;
  }> = [];

  const getStatusLabel = (status: "active" | "expired" | "cancelled") => {
    switch (status) {
      case "active":
        return subscription.statusActive;
      case "expired":
        return subscription.statusExpired;
      case "cancelled":
        return subscription.statusCancelled;
    }
  };

  const getStatusColor = (status: "active" | "expired" | "cancelled") => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-600";
      case "expired":
        return "bg-grey-100 text-grey-600";
      case "cancelled":
        return "bg-warning-100 text-warning-600";
    }
  };

  return (
    <div className="space-y-6">
      {subscriptionHistory.length > 0 ? (
        /* Subscription history table */
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-shade-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {subscription.historyTableHeaders.plan}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {subscription.historyTableHeaders.startDate}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {subscription.historyTableHeaders.endDate}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {subscription.historyTableHeaders.status}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-secondary-800">
                    {subscription.historyTableHeaders.amount}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-100">
                {subscriptionHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-secondary-800">
                      {item.plan}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-600">
                      {item.startDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-grey-600">
                      {item.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-800">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-64 h-48 mb-6">
            <Image
              src="/images/dashboard/subscription.svg"
              alt="No subscription history"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-lg text-grey-500">{subscription.noHistory}</p>
        </div>
      )}
    </div>
  );
}
