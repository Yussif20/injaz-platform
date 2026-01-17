/**
 * Image Types
 * Types for profile image management
 */

// Profile Image (SubsectionImageDto from API)
export interface ProfileImage {
  id: number;
  imagePath: string | null;
  publicUrl: string | null;
  description: string | null;
  displayOrder: number;
}

// Request types
export interface UploadImageRequest {
  profileId: number;
  subsectionId: number;
  file: File;
  description?: string;
  displayOrder?: number;
}

export interface UpdateImageRequest {
  description?: string;
  displayOrder?: number;
}

export interface ReorderImagesRequest {
  imageOrders: Record<number, number>; // Map of imageId to new displayOrder
}

// API Response types
export interface ImagesResponse {
  status: string;
  message: string;
  data?: ProfileImage[];
  errors?: string[] | null;
}

export interface ImageResponse {
  status: string;
  message: string;
  data?: ProfileImage;
  errors?: string[] | null;
}

export interface ImageDeleteResponse {
  status: string;
  message: string;
  data?: boolean;
  errors?: string[] | null;
}

export interface ReorderImagesResponse {
  status: string;
  message: string;
  data?: boolean;
  errors?: string[] | null;
}
