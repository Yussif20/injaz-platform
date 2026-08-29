/**
 * Career Jobs service - Client-side API calls for career management
 */

import { clientApi } from "@/shared/lib/api";
import type {
  CareerJob,
  CreateCareerJobRequest,
  UpdateCareerJobRequest,
} from "../types/me.types";

// Response types
interface CareerJobsResponse {
  status: boolean;
  message: string;
  data?: CareerJob[];
  errors?: string[] | null;
}

interface CareerJobResponse {
  status: boolean;
  message: string;
  data?: CareerJob;
  errors?: string[] | null;
}

interface SimpleResponse {
  status: boolean;
  message: string;
  errors?: string[] | null;
}

/**
 * Get all career jobs for current user
 */
export async function getCareerJobs(): Promise<CareerJobsResponse> {
  const response = await clientApi.get<CareerJobsResponse>("/api/career-jobs");
  return response.data;
}

/**
 * Add a new career job
 */
export async function addCareerJob(
  data: CreateCareerJobRequest
): Promise<CareerJobResponse> {
  const response = await clientApi.post<CareerJobResponse>("/api/career-jobs", data);
  return response.data;
}

/**
 * Update an existing career job
 */
export async function updateCareerJob(
  id: number,
  data: UpdateCareerJobRequest
): Promise<CareerJobResponse> {
  const response = await clientApi.put<CareerJobResponse>(`/api/career-jobs/${id}`, data);
  return response.data;
}

/**
 * Delete a career job
 */
export async function deleteCareerJob(id: number): Promise<SimpleResponse> {
  const response = await clientApi.delete<SimpleResponse>(`/api/career-jobs/${id}`);
  return response.data;
}
