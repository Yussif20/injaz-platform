/**
 * Share Links service - Client-side API calls for share link management
 */

import { clientApi } from "@/shared/lib/api";
import type {
  ShareLinksResponse,
  ShareLinkResponse,
  ShareLinkDeleteResponse,
  CreateShareLinkRequest,
} from "../types/share-link.types";

// ==================== Create Share Link ====================

/**
 * Create a new share link for a profile
 */
export async function createShareLink(
  data: CreateShareLinkRequest
): Promise<ShareLinkResponse> {
  const response = await clientApi.post<ShareLinkResponse>("/api/share-links", data);
  return response.data;
}

// ==================== Get Share Links ====================

/**
 * Get all share links for a profile
 */
export async function getProfileShareLinks(profileId: number): Promise<ShareLinksResponse> {
  const response = await clientApi.get<ShareLinksResponse>(
    `/api/share-links/profile/${profileId}`
  );
  return response.data;
}

// ==================== Delete Share Link ====================

/**
 * Delete a share link
 */
export async function deleteShareLink(linkId: number): Promise<ShareLinkDeleteResponse> {
  const response = await clientApi.delete<ShareLinkDeleteResponse>(
    `/api/share-links/${linkId}`
  );
  return response.data;
}
