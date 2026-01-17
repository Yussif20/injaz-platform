/**
 * Images service - Client-side API calls for image management
 */

import { clientApi } from "@/shared/lib/api";
import type {
  ProfileImage,
  ImagesResponse,
  ImageResponse,
  ImageDeleteResponse,
  ReorderImagesResponse,
} from "../types/image.types";

// ==================== Image Upload ====================

/**
 * Upload image to subsection
 */
export async function uploadImage(
  profileId: number,
  subsectionId: number,
  file: File,
  description?: string,
  displayOrder?: number
): Promise<ImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams();
  params.append("profileId", profileId.toString());
  params.append("subsectionId", subsectionId.toString());
  if (description) params.append("description", description);
  if (displayOrder !== undefined) params.append("displayOrder", displayOrder.toString());

  const response = await clientApi.post<ImageResponse>(
    `/api/images/upload?${params.toString()}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// ==================== Image Retrieval ====================

/**
 * Get all images for a profile
 */
export async function getProfileImages(profileId: number): Promise<ImagesResponse> {
  const response = await clientApi.get<ImagesResponse>(`/api/images/profile/${profileId}`);
  return response.data;
}

/**
 * Get images by subsection
 */
export async function getSubsectionImages(subsectionId: number): Promise<ImagesResponse> {
  const response = await clientApi.get<ImagesResponse>(`/api/images/subsection/${subsectionId}`);
  return response.data;
}

// ==================== Image Update ====================

/**
 * Update image (description, displayOrder, or replace file)
 */
export async function updateImage(
  imageId: number,
  data?: { description?: string; displayOrder?: number },
  file?: File
): Promise<ImageResponse> {
  const params = new URLSearchParams();
  if (data?.description !== undefined) params.append("description", data.description);
  if (data?.displayOrder !== undefined) params.append("displayOrder", data.displayOrder.toString());

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await clientApi.put<ImageResponse>(
      `/api/images/${imageId}?${params.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  const response = await clientApi.put<ImageResponse>(
    `/api/images/${imageId}?${params.toString()}`
  );
  return response.data;
}

// ==================== Image Reorder ====================

/**
 * Reorder images within a subsection
 */
export async function reorderImages(
  subsectionId: number,
  imageOrders: Record<number, number>
): Promise<ReorderImagesResponse> {
  const response = await clientApi.put<ReorderImagesResponse>(
    `/api/images/reorder/${subsectionId}`,
    imageOrders
  );
  return response.data;
}

// ==================== Image Delete ====================

/**
 * Delete image
 */
export async function deleteImage(imageId: number): Promise<ImageDeleteResponse> {
  const response = await clientApi.delete<ImageDeleteResponse>(`/api/images/${imageId}`);
  return response.data;
}
