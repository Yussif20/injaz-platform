/**
 * Templates service - Client-side API calls for template management
 */

import { clientApi } from "@/shared/lib/api";
import type {
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
 */
export async function getTemplates(): Promise<TemplatesResponse> {
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
 */
export async function getTemplateSummaryList(): Promise<{ status: boolean; message: string; data?: TemplateSummary[] }> {
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
 */
export async function getTemplateById(templateId: number): Promise<TemplateResponse> {
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
  const requestBody: UpdateProfileTemplateRequest = {
    templateId,
  };

  const response = await clientApi.put<ProfileResponse>(
    `/api/profiles/${profileId}/template`,
    requestBody
  );
  return response.data;
}
