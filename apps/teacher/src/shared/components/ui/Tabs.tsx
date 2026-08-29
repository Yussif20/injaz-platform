"use client";

import React from "react";

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  rightContent,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Tab buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-base font-normal transition-colors duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-shade-100 text-primary-500"
                : "text-[#666] hover:text-grey-800 hover:bg-grey-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right content (Edit button) */}
      {rightContent && <div className="shrink-0">{rightContent}</div>}
    </div>
  );
};
