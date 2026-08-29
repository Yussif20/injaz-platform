import type { ApiResponse } from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type {
  AcademicYearDto,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from "../types/academic-years.types";

export async function getAcademicYears() {
  const response = await proxyApi.get<ApiResponse<AcademicYearDto[]>>(
    API_ENDPOINTS.ACADEMIC_YEARS.BASE,
  );
  return unwrapResponse(response);
}

export async function getActiveAcademicYears() {
  const response = await proxyApi.get<ApiResponse<AcademicYearDto[]>>(
    `${API_ENDPOINTS.ACADEMIC_YEARS.BASE}/active`,
  );
  return unwrapResponse(response);
}

export async function getAcademicYearById(id: number) {
  const response = await proxyApi.get<ApiResponse<AcademicYearDto>>(
    API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id),
  );
  return unwrapResponse(response);
}

export async function createAcademicYear(payload: CreateAcademicYearDto) {
  const response = await proxyApi.post<ApiResponse<AcademicYearDto>>(
    API_ENDPOINTS.ACADEMIC_YEARS.BASE,
    payload,
  );
  return unwrapResponse(response);
}

export async function updateAcademicYear(
  id: number,
  payload: UpdateAcademicYearDto,
) {
  const response = await proxyApi.put<ApiResponse<AcademicYearDto>>(
    API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id),
    payload,
  );
  return unwrapResponse(response);
}

export async function deleteAcademicYear(id: number) {
  const response = await proxyApi.delete<ApiResponse<boolean>>(
    API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id),
  );
  return unwrapResponse(response);
}

export async function activateAcademicYear(id: number) {
  const response = await proxyApi.put<ApiResponse<boolean>>(
    `${API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id)}/activate`,
  );
  return unwrapResponse(response);
}

export async function deactivateAcademicYear(id: number) {
  const response = await proxyApi.put<ApiResponse<boolean>>(
    `${API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id)}/deactivate`,
  );
  return unwrapResponse(response);
}

export async function closeAcademicYear(id: number) {
  const response = await proxyApi.put<ApiResponse<boolean>>(
    `${API_ENDPOINTS.ACADEMIC_YEARS.BY_ID(id)}/close`,
  );
  return unwrapResponse(response);
}
