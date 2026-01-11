"use client";

import React, { useState } from "react";
import { dashboardContent } from "@/content";
import { Tabs, Tab } from "@/shared/components/ui";
import { ProfileDataTab } from "./ProfileDataTab";
import { EducationDataTab } from "./EducationDataTab";
import { JobDataTab } from "./JobDataTab";
import type { ProfileDataTabId } from "../types";

export const ProfileDataTabs: React.FC = () => {
  const { profileData } = dashboardContent;
  const [activeTab, setActiveTab] = useState<ProfileDataTabId>("myData");
  const [isEditing, setIsEditing] = useState(false);

  const tabs: Tab[] = [
    { id: "myData", label: profileData.tabs.myData },
    { id: "education", label: profileData.tabs.education },
    { id: "job", label: profileData.tabs.job },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ProfileDataTabId);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "myData":
        return <ProfileDataTab isEditing={isEditing} onSave={handleSave} />;
      case "education":
        return <EducationDataTab isEditing={isEditing} onSave={handleSave} />;
      case "job":
        return <JobDataTab isEditing={isEditing} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Tabs Header */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
        rightContent={
          <button
            type="button"
            onClick={toggleEditMode}
            className={`flex items-center gap-2 transition-colors ${
              isEditing
                ? "text-warning-500 hover:text-warning-700"
                : "text-primary-500 hover:text-primary-700"
            }`}
          >
            <img src="/icons/edit.svg" alt="edit" className="w-6 h-6" />
            <span className="text-lg font-light">
              {isEditing ? profileData.cancel : profileData.edit}
            </span>
          </button>
        }
      />

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};
