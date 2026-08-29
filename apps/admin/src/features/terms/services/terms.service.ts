import type { ApiResponse } from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { TermsContentDto } from "../types/terms.types";

export async function getTermsContent(): Promise<TermsContentDto | null> {
  try {
    const response = await proxyApi.get<ApiResponse<TermsContentDto>>(
      API_ENDPOINTS.SYSTEM_PARAMETERS.TERMS_AND_CONDITIONS,
    );
    return unwrapResponse(response);
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export async function saveTermsContent(html: string): Promise<TermsContentDto> {
  const response = await proxyApi.put<ApiResponse<TermsContentDto>>(
    API_ENDPOINTS.SYSTEM_PARAMETERS.TERMS_AND_CONDITIONS,
    { content: html },
  );
  return unwrapResponse(response);
}
