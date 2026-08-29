"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateProfileTypeDto,
  UpdateProfileTypeDto,
  ProfileTypeFilterParams,
} from "../types/profile-types.types";
import {
  getAllProfileTypes,
  getFilteredProfileTypes,
  getProfileTypeById,
  getProfileTypeWithSections,
  createProfileType,
  updateProfileType,
  deleteProfileType,
  activateProfileType,
  deactivateProfileType,
  duplicateProfileType,
} from "../services/profile-types.service";

/**
 * Get all profile types (no pagination)
 */
export function useProfileTypes() {
  return useQuery({
    queryKey: queryKeys.profileTypes.all(),
    queryFn: () => getAllProfileTypes(),
  });
}

/**
 * Get filtered profile types with pagination
 */
export function useFilteredProfileTypes(params?: ProfileTypeFilterParams) {
  return useQuery({
    queryKey: queryKeys.profileTypes.filtered(params),
    queryFn: () => getFilteredProfileTypes(params ?? {}),
  });
}

/**
 * Get single profile type by ID
 */
export function useProfileType(id?: number) {
  return useQuery({
    queryKey: queryKeys.profileTypes.detail(id ?? 0),
    queryFn: () => getProfileTypeById(id as number),
    enabled: typeof id === "number",
  });
}

/**
 * Get profile type with full section/subsection hierarchy
 */
export function useProfileTypeWithSections(id?: number) {
  return useQuery({
    queryKey: [...queryKeys.profileTypes.detail(id ?? 0), "withSections"],
    queryFn: () => getProfileTypeWithSections(id as number),
    enabled: typeof id === "number",
  });
}

/**
 * Create a new profile type
 */
export function useCreateProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProfileTypeDto) => createProfileType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
    },
  });
}

/**
 * Update an existing profile type
 */
export function useUpdateProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfileTypeDto }) =>
      updateProfileType(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(variables.id),
      });
    },
  });
}

/**
 * Delete a profile type
 */
export function useDeleteProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProfileType(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(id),
      });
    },
  });
}

/**
 * Activate a profile type
 */
export function useActivateProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activateProfileType(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(id),
      });
    },
  });
}

/**
 * Deactivate a profile type
 */
export function useDeactivateProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateProfileType(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(id),
      });
    },
  });
}

/**
 * Duplicate a profile type
 */
export function useDuplicateProfileType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => duplicateProfileType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileTypes.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.lists(),
      });
    },
  });
}
