"use client";

import { useState } from "react";
import { SubscriptionsTab } from "./SubscriptionsTab";
import { DiscountsTab } from "./DiscountsTab";
import { SettingsTab } from "./SettingsTab";

type Tab = "subscriptions" | "discounts" | "settings";

export function SubscriptionsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("subscriptions");

  // Translations (fallback inline for subscriptions feature)
  const tabsT = {
    subscriptions: "الاشتراكات",
    discounts: "الخصومات",
    settings: "الإعدادات",
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "subscriptions", label: tabsT.subscriptions },
    { key: "discounts", label: tabsT.discounts },
    { key: "settings", label: tabsT.settings },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-xl border border-grey-200 bg-white p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary-500 text-white"
                : "text-grey-600 hover:bg-grey-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "subscriptions" && <SubscriptionsTab />}
        {activeTab === "discounts" && <DiscountsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
