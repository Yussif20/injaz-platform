import type {
  ApiResponse,
  PaginatedData,
  PaginatedQueryParams,
} from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type {
  RankDto,
  CreateRankDto,
  UpdateRankDto,
} from "../types/ranks.types";

export async function getRanks() {
  const response = await proxyApi.get<ApiResponse<RankDto[]>>(
    API_ENDPOINTS.RANKS.BASE,
  );
  return unwrapResponse(response);
}

export async function getFilteredRanks(params?: PaginatedQueryParams) {
  const response = await proxyApi.get<ApiResponse<PaginatedData<RankDto>>>(
    `${API_ENDPOINTS.RANKS.BASE}/filtered`,
    { params },
  );
  return unwrapResponse(response);
}

export async function getRankById(id: number) {
  const response = await proxyApi.get<ApiResponse<RankDto>>(
    API_ENDPOINTS.RANKS.BY_ID(id),
  );
  return unwrapResponse(response);
}

export async function createRank(payload: CreateRankDto) {
  const response = await proxyApi.post<ApiResponse<RankDto>>(
    API_ENDPOINTS.RANKS.BASE,
    payload,
  );
  return unwrapResponse(response);
}

export async function updateRank(id: number, payload: UpdateRankDto) {
  const response = await proxyApi.put<ApiResponse<RankDto>>(
    API_ENDPOINTS.RANKS.BY_ID(id),
    payload,
  );
  return unwrapResponse(response);
}

export async function deleteRank(id: number) {
  const response = await proxyApi.delete<ApiResponse<boolean>>(
    API_ENDPOINTS.RANKS.BY_ID(id),
  );
  return unwrapResponse(response);
}
