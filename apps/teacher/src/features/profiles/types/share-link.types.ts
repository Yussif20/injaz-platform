/**
 * Share Link Types
 * Types for profile share link management
 */

// Share Link (ShareLinkDto from API)
export interface ShareLink {
  id: number;
  token: string | null;
  shareUrl: string | null;
  expiresAt: string | null;
  accessCount: number;
  createdAt: string;
}

// Request types
export interface CreateShareLinkRequest {
  profileId: number;
  expiresAt?: string; // ISO date string
}

// API Response types
export interface ShareLinksResponse {
  status: string;
  message: string;
  data?: ShareLink[];
  errors?: string[] | null;
}

export interface ShareLinkResponse {
  status: string;
  message: string;
  data?: ShareLink;
  errors?: string[] | null;
}

export interface ShareLinkDeleteResponse {
  status: string;
  message: string;
  data?: boolean;
  errors?: string[] | null;
}
