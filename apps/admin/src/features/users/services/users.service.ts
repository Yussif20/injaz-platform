import type { ApiResponse, PaginatedData } from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  UserFilterParams,
} from "../types/users.types";

export async function getUsers() {
  const response = await proxyApi.get<ApiResponse<UserDto[]>>(
    API_ENDPOINTS.USERS.BASE,
  );
  return unwrapResponse(response);
}

export async function getFilteredUsers(params?: UserFilterParams) {
  const response = await proxyApi.get<ApiResponse<PaginatedData<UserDto>>>(
    `${API_ENDPOINTS.USERS.BASE}/filtered`,
    { params },
  );
  return unwrapResponse(response);
}

export async function getUserById(id: number) {
  const response = await proxyApi.get<ApiResponse<UserDto>>(
    API_ENDPOINTS.USERS.BY_ID(id),
  );
  return unwrapResponse(response);
}

export async function getUserByPhone(phone: string) {
  const response = await proxyApi.get<ApiResponse<UserDto>>(
    `${API_ENDPOINTS.USERS.BASE}/by-phone`,
    { params: { phone } },
  );
  return unwrapResponse(response);
}

export async function getUsersByRole(role: string) {
  const response = await proxyApi.get<ApiResponse<UserDto[]>>(
    `${API_ENDPOINTS.USERS.BASE}/by-role/${role}`,
  );
  return unwrapResponse(response);
}

export async function createUser(payload: CreateUserDto) {
  const response = await proxyApi.post<ApiResponse<UserDto>>(
    API_ENDPOINTS.USERS.BASE,
    payload,
  );
  return unwrapResponse(response);
}

export async function updateUser(id: number, payload: UpdateUserDto) {
  const response = await proxyApi.put<ApiResponse<UserDto>>(
    API_ENDPOINTS.USERS.BY_ID(id),
    payload,
  );
  return unwrapResponse(response);
}

export async function deleteUser(id: number) {
  const response = await proxyApi.delete<ApiResponse<boolean>>(
    API_ENDPOINTS.USERS.BY_ID(id),
  );
  return unwrapResponse(response);
}
