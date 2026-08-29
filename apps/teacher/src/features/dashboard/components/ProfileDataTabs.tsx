"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { dashboardContent } from "@/content";
import { Tabs, Tab } from "@/shared/components/ui";
import { ProfileDataTab } from "./ProfileDataTab";
import { EducationDataTab } from "./EducationDataTab";
import { JobDataTab } from "./JobDataTab";
import type { ProfileDataTabId } from "../types";
import Image from "next/image";
import { ROUTES } from "@/config";

// Map tab IDs to routes
const tabRoutes: Record<ProfileDataTabId, string> = {
  myData: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL,
  education: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_EDUCATION,
  job: ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_CAREER,
};

// Map routes to tab IDs
const routeToTab: Record<string, ProfileDataTabId> = {
  [ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_PERSONAL]: "myData",
  [ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_EDUCATION]: "education",
  [ROUTES.DASHBOARD_ACCOUNT_PROFILE_DATA_CAREER]: "job",
};

interface ProfileDataTabsProps {
  initialTab?: ProfileDataTabId;
}

// Edit button component to avoid duplication
const EditButton: React.FC<{
  isEditing: boolean;
  onClick: () => void;
  cancelText: string;
  editText: string;
  className?: string;
}> = ({ isEditing, onClick, cancelText, editText, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 transition-colors ${
      isEditing
        ? "text-warning-500 hover:text-warning-700"
        : "text-primary-500 hover:text-primary-700"
    } ${className}`}
  >
    <Image src="/icons/ui/edit.svg" alt="edit" width={24} height={24} />
    <span className="text-lg font-light">{isEditing ? cancelText : editText}</span>
  </button>
);

export const ProfileDataTabs: React.FC<ProfileDataTabsProps> = ({
  initialTab = "myData",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { profileData } = dashboardContent;
  const [isEditing, setIsEditing] = useState(false);

  // Determine active tab from URL or fallback to initialTab
  const activeTab: ProfileDataTabId = routeToTab[pathname] || initialTab;

  const tabs: Tab[] = [
    { id: "myData", label: profileData.tabs.myData },
    { id: "education", label: profileData.tabs.education },
    { id: "job", label: profileData.tabs.job },
  ];

  const handleTabChange = (tabId: string) => {
    const route = tabRoutes[tabId as ProfileDataTabId];
    if (route) {
      router.push(route);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  // Mobile edit button to pass to ProfileDataTab
  const mobileEditButton = (
    <EditButton
      isEditing={isEditing}
      onClick={toggleEditMode}
      cancelText={profileData.cancel}
      editText={profileData.edit}
      className="md:hidden"
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "myData":
        return (
          <ProfileDataTab
            isEditing={isEditing}
            onSave={handleSave}
            mobileEditButton={mobileEditButton}
          />
        );
      case "education":
        return <EducationDataTab isEditing={isEditing} onSave={handleSave} />;
      case "job":
        return <JobDataTab isEditing={isEditing} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        {/* Tabs Header */}
        <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
        rightContent={
          activeTab === "myData" ? (
            <EditButton
              isEditing={isEditing}
              onClick={toggleEditMode}
              cancelText={profileData.cancel}
              editText={profileData.edit}
              className="hidden md:flex"
            />
          ) : null
        }
      />

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};
