/**
 * Templates service - Client-side API calls for template management
 * TODO: BYPASS - Remove bypass logic before production
 */

import { clientApi } from "@/shared/lib/api";
import { isBypassUser } from "@/shared/lib/bypass-storage";
import { MOCK_TEMPLATES, getMockTemplateById } from "@/shared/lib/mock-data";
import type {
  Template,
  TemplateSummary,
  TemplatesResponse,
  TemplateResponse,
  UpdateProfileTemplateRequest,
} from "../types/template.types";
import { getAllTemplates, getTemplateSummaries, getTemplateConfig } from "../types/template.types";
import type { ProfileResponse } from "../types/profile.types";

// ==================== Get Templates ====================

/**
 * Get all available templates
 * TODO: BYPASS - Uses mock data for bypass user
 */
export async function getTemplates(): Promise<TemplatesResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Templates fetched",
      data: MOCK_TEMPLATES,
    };
  }

  // When backend endpoint is ready, use this:
  // const response = await clientApi.get<TemplatesResponse>("/api/templates");
  // return response.data;

  // For now, return the frontend-defined templates
  // This will work even without backend support
  return {
    status: true,
    message: "Templates fetched from config",
    data: getAllTemplates(),
  };
}

/**
 * Get template summaries (lightweight list for selectors)
 * TODO: BYPASS - Uses mock data for bypass user
 */
export async function getTemplateSummaryList(): Promise<{ status: boolean; message: string; data?: TemplateSummary[] }> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    return {
      status: true,
      message: "Test bypass - Template summaries fetched",
      data: getTemplateSummaries(),
    };
  }

  // When backend endpoint is ready, use this:
  // const response = await clientApi.get<{ status: boolean; message: string; data?: TemplateSummary[] }>("/api/templates/summaries");
  // return response.data;

  // For now, return frontend-defined summaries
  return {
    status: true,
    message: "Template summaries fetched from config",
    data: getTemplateSummaries(),
  };
}

/**
 * Get a single template by ID
 * TODO: BYPASS - Uses mock data for bypass user
 */
export async function getTemplateById(templateId: number): Promise<TemplateResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    const template = getMockTemplateById(templateId);
    if (template) {
      return {
        status: true,
        message: "Test bypass - Template fetched",
        data: template,
      };
    }
    return {
      status: false,
      message: "Template not found",
      errors: ["Template not found"],
    };
  }

  // When backend endpoint is ready, use this:
  // const response = await clientApi.get<TemplateResponse>(`/api/templates/${templateId}`);
  // return response.data;

  // For now, return from config
  const template = getTemplateConfig(templateId);
  return {
    status: true,
    message: "Template fetched from config",
    data: template,
  };
}

// ==================== Update Profile Template ====================

/**
 * Update a profile's template
 * Uses the existing backend endpoint: PUT /api/my-profiles/{profileId}/template
 */
export async function updateProfileTemplate(
  profileId: number,
  templateId: number
): Promise<ProfileResponse> {
  // TODO: BYPASS - Remove before production
  if (isBypassUser()) {
    // For bypass mode, we just return success
    // The actual profile update is handled by bypass-storage
    return {
      status: true,
      message: "Test bypass - Template updated",
      data: undefined, // Profile will be refetched
    };
  }

  const requestBody: UpdateProfileTemplateRequest = {
    templateId,
  };

  const response = await clientApi.put<ProfileResponse>(
    `/api/profiles/${profileId}/template`,
    requestBody
  );
  return response.data;
}
