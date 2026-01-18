/**
 * Images service - Client-side API calls for image management
 */

import { clientApi } from "@/shared/lib/api";
// TODO: BYPASS - Remove before production
import {
  isBypassUser,
  getBypassProfileSections,
  addImageToSubsection,
  updateImageInSubsection,
  deleteImageFromProfile,
} from "@/shared/lib/bypass-storage";
import { generateMockId } from "@/shared/lib/mock-data";
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
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // Find the section that contains this subsection
    const sections = getBypassProfileSections(profileId);
    let sectionId: number | null = null;

    for (const section of sections) {
      const subsection = section.subsections?.find((s) => s.id === subsectionId);
      if (subsection) {
        sectionId = section.id;
        break;
      }
    }

    if (sectionId === null) {
      return {
        status: "Error",
        message: "Subsection not found",
        errors: ["Subsection not found"],
      };
    }

    // Create object URL for the file
    const publicUrl = URL.createObjectURL(file);

    // Get existing images count for displayOrder
    const existingSection = sections.find((s) => s.id === sectionId);
    const existingSubsection = existingSection?.subsections?.find((s) => s.id === subsectionId);
    const existingImagesCount = existingSubsection?.images?.length || 0;

    const newImage: ProfileImage = {
      id: generateMockId(),
      imagePath: file.name,
      publicUrl,
      description: description || null,
      displayOrder: displayOrder !== undefined ? displayOrder : existingImagesCount + 1,
    };

    const success = addImageToSubsection(profileId, sectionId, subsectionId, newImage);

    if (success) {
      return {
        status: "Success",
        message: "Test bypass - Image uploaded",
        data: newImage,
      };
    } else {
      return {
        status: "Error",
        message: "Failed to upload image",
        errors: ["Failed to upload image"],
      };
    }
  }

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
  file?: File,
  profileId?: number
): Promise<ImageResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser() && profileId) {
    const updates: { description?: string; displayOrder?: number; publicUrl?: string } = {};
    if (data?.description !== undefined) updates.description = data.description;
    if (data?.displayOrder !== undefined) updates.displayOrder = data.displayOrder;
    if (file) {
      updates.publicUrl = URL.createObjectURL(file);
    }

    const success = updateImageInSubsection(profileId, imageId, updates);

    if (success) {
      return {
        status: "Success",
        message: "Test bypass - Image updated",
        data: {
          id: imageId,
          imagePath: file?.name || null,
          publicUrl: updates.publicUrl || null,
          description: updates.description || null,
          displayOrder: updates.displayOrder || 0,
        },
      };
    } else {
      return {
        status: "Error",
        message: "Image not found",
        errors: ["Image not found"],
      };
    }
  }

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
export async function deleteImage(imageId: number, profileId?: number): Promise<ImageDeleteResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser() && profileId) {
    const success = deleteImageFromProfile(profileId, imageId);

    if (success) {
      return {
        status: "Success",
        message: "Test bypass - Image deleted",
        data: true,
      };
    } else {
      return {
        status: "Error",
        message: "Image not found",
        errors: ["Image not found"],
      };
    }
  }

  const response = await clientApi.delete<ImageDeleteResponse>(`/api/images/${imageId}`);
  return response.data;
}
