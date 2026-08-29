import axios from "axios";
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
  } catch (error: unknown) {
    // No terms saved yet is a normal state, not a failure. Anything else is a real error
    // and is rethrown. axios.isAxiosError narrows this without an `any` cast.
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
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
