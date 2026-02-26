import type { ApiResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { ReviewDto, CreateReviewDto, UpdateReviewDto } from "../types/reviews.types";

export async function getReviews() {
  const response = await proxyApi.get<ApiResponse<ReviewDto[]>>(
    API_ENDPOINTS.REVIEWS.BASE,
  );
  return unwrapResponse(response);
}

export async function createReview(payload: CreateReviewDto) {
  const response = await proxyApi.post<ApiResponse<ReviewDto>>(
    API_ENDPOINTS.REVIEWS.BASE,
    payload,
  );
  return unwrapResponse(response);
}

export async function updateReview(id: number, payload: UpdateReviewDto) {
  const response = await proxyApi.put<ApiResponse<ReviewDto>>(
    API_ENDPOINTS.REVIEWS.BY_ID(id),
    payload,
  );
  return unwrapResponse(response);
}

export async function deleteReview(id: number) {
  const response = await proxyApi.delete<ApiResponse<boolean>>(
    API_ENDPOINTS.REVIEWS.PERMANENT_DELETE(id),
  );
  return unwrapResponse(response);
}

export async function uploadReviewerPhoto(id: number, file: File) {
  // Use native fetch instead of Axios so the browser sets Content-Type with the
  // correct multipart boundary — Axios default headers (application/json) can
  // interfere and produce a 415 Unsupported Media Type on the backend.
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/proxy/${API_ENDPOINTS.REVIEWS.PHOTO(id)}`, {
    method: "POST",
    body: formData,
    // No Content-Type — browser sets multipart/form-data; boundary=... automatically
  });

  const json: ApiResponse<ReviewDto> = await res.json();

  if (json.status === "Failure") {
    throw new ApiError(json.message, res.status, json.errors);
  }

  return json.data;
}
