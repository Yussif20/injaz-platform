/**
 * Qualifications service - Client-side API calls for qualifications management
 */

import { clientApi } from "@/shared/lib/api";
import type {
  Qualification,
  CreateQualificationRequest,
  UpdateQualificationRequest,
} from "../types/me.types";

// Response types
interface QualificationsResponse {
  status: boolean;
  message: string;
  data?: Qualification[];
  errors?: string[] | null;
}

interface QualificationResponse {
  status: boolean;
  message: string;
  data?: Qualification;
  errors?: string[] | null;
}

interface SimpleResponse {
  status: boolean;
  message: string;
  errors?: string[] | null;
}

/**
 * Get all qualifications for current user
 */
export async function getQualifications(): Promise<QualificationsResponse> {
  const response = await clientApi.get<QualificationsResponse>("/api/qualifications");
  return response.data;
}

/**
 * Add a new qualification
 */
export async function addQualification(
  data: CreateQualificationRequest
): Promise<QualificationResponse> {
  const response = await clientApi.post<QualificationResponse>("/api/qualifications", data);
  return response.data;
}

/**
 * Update an existing qualification
 */
export async function updateQualification(
  id: number,
  data: UpdateQualificationRequest
): Promise<QualificationResponse> {
  const response = await clientApi.put<QualificationResponse>(`/api/qualifications/${id}`, data);
  return response.data;
}

/**
 * Delete a qualification
 */
export async function deleteQualification(id: number): Promise<SimpleResponse> {
  const response = await clientApi.delete<SimpleResponse>(`/api/qualifications/${id}`);
  return response.data;
}
