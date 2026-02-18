"use client";

import { useState } from "react";
import { CurrentYearTab } from "./CurrentYearTab";
import { DiscountsTab } from "./DiscountsTab";
import { SubscriptionsTab } from "./SubscriptionsTab";

type Section = "currentYear" | "discounts" | "invoices";

const NAV_ITEMS: { key: Section; label: string }[] = [
  { key: "currentYear", label: "إشتراك السنة الحالية" },
  { key: "discounts", label: "تاريخ عروض السنة" },
  { key: "invoices", label: "فواتير الإشتراكات" },
];

export function SubscriptionsContent() {
  const [activeSection, setActiveSection] = useState<Section>("currentYear");

  return (
    <div className="flex gap-6">
      {/* Secondary Sidebar — first in RTL = renders on the right, next to main sidebar */}
      <div className="w-52 shrink-0">
        <nav className="space-y-1 rounded-2xl border border-grey-200 bg-white p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full rounded-lg px-4 py-3 text-right text-sm transition-colors ${
                activeSection === item.key
                  ? "bg-primary-50 font-medium text-primary-600"
                  : "text-grey-600 hover:bg-grey-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeSection === "currentYear" && <CurrentYearTab />}
        {activeSection === "discounts" && <DiscountsTab />}
        {activeSection === "invoices" && <SubscriptionsTab />}
      </div>
    </div>
  );
}
