/**
 * useProfileCapabilities — determines what actions a user can perform
 * based on subscription status and profile completeness.
 *
 * Rules:
 * - Unsubscribed: watermark on preview, can't publish/share/download
 * - Subscribed but profile incomplete: can't publish/share/download, no watermark
 * - Subscribed + complete: can publish/share/download/password, no watermark
 */

"use client";

import { useMemo } from "react";
import { useMySubscription } from "@/features/dashboard/hooks/useMySubscription";
import { useMyProfile } from "@/features/dashboard/hooks/useMyProfile";

export interface ProfileCapabilities {
  /** User has an active subscription */
  isSubscribed: boolean;
  /** User profile data is complete (personal info, qualifications, career) */
  isProfileComplete: boolean;
  /** Can publish files */
  canPublish: boolean;
  /** Can create share links */
  canShare: boolean;
  /** Can download as PDF/image */
  canDownload: boolean;
  /** Can set file passwords */
  canSetPassword: boolean;
  /** Should show watermark on template preview */
  showWatermark: boolean;
  /** Reason user can't perform actions (for UI messages) */
  blockedReason: "none" | "not_subscribed" | "profile_incomplete";
  /** Loading state */
  isLoading: boolean;
}

export function useProfileCapabilities(): ProfileCapabilities {
  const { isSubscribed, isLoading: subLoading } = useMySubscription();
  const { profile, isLoading: profileLoading } = useMyProfile();

  const isLoading = subLoading || profileLoading;

  const isProfileComplete = useMemo(() => {
    if (!profile) return false;

    // Check personal info
    const pi = profile.personalInfo;
    const hasPersonalInfo = !!(pi && pi.nationalId && pi.birthDate && pi.address);

    // Check qualifications
    const hasQualifications =
      Array.isArray(profile.qualifications) && profile.qualifications.length > 0;

    // Check career jobs
    const hasCareerJobs =
      Array.isArray(profile.careerJobs) && profile.careerJobs.length > 0;

    return hasPersonalInfo && hasQualifications && hasCareerJobs;
  }, [profile]);

  const capabilities = useMemo((): ProfileCapabilities => {
    if (isLoading) {
      return {
        isSubscribed: false,
        isProfileComplete: false,
        canPublish: false,
        canShare: false,
        canDownload: false,
        canSetPassword: false,
        showWatermark: false,
        blockedReason: "none",
        isLoading: true,
      };
    }

    if (!isSubscribed) {
      return {
        isSubscribed: false,
        isProfileComplete,
        canPublish: false,
        canShare: false,
        canDownload: false,
        canSetPassword: false,
        showWatermark: true,
        blockedReason: "not_subscribed",
        isLoading: false,
      };
    }

    if (!isProfileComplete) {
      return {
        isSubscribed: true,
        isProfileComplete: false,
        canPublish: false,
        canShare: false,
        canDownload: false,
        canSetPassword: false,
        showWatermark: false,
        blockedReason: "profile_incomplete",
        isLoading: false,
      };
    }

    return {
      isSubscribed: true,
      isProfileComplete: true,
      canPublish: true,
      canShare: true,
      canDownload: true,
      canSetPassword: true,
      showWatermark: false,
      blockedReason: "none",
      isLoading: false,
    };
  }, [isSubscribed, isProfileComplete, isLoading]);

  return capabilities;
}
