import type { AxiosResponse } from "axios";
import { type ApiResponse, ApiError } from "@/shared/types";
import { isAxiosError } from "axios";

/**
 * Unwraps the backend ApiResponse envelope.
 * Throws ApiError on Failure status.
 */
export function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const envelope = response.data;

  if (envelope.status === "Failure") {
    throw new ApiError(
      envelope.message,
      response.status,
      envelope.errors,
    );
  }

  return envelope.data;
}

/**
 * Extracts a user-facing error message (Arabic) from any error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Backend envelope
    if (data?.message) return data.message;
    // Fallback status text
    if (error.response?.statusText) return error.response.statusText;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "حدث خطأ غير متوقع";
}
