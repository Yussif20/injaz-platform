export interface ShareLink {
  id: number;
  token: string | null;
  shareUrl: string | null;
  expiresAt: string | null;
  accessCount: number;
  createdAt: string;
}
