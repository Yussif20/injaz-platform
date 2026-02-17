"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateSectionDto,
  UpdateSectionDto,
  ReorderMap,
} from "../types/profile-types.types";
import {
  getSectionsByProfileType,
  getSectionById,
  getSectionWithSubsections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "../services/sections.service";

/**
 * Get all sections for a profile type
 */
export function useSectionsByProfileType(profileTypeId?: number) {
  return useQuery({
    queryKey: [...queryKeys.sections.lists(), profileTypeId],
    queryFn: () => getSectionsByProfileType(profileTypeId as number),
    enabled: typeof profileTypeId === "number",
  });
}

/**
 * Get single section by ID
 */
export function useSection(id?: number) {
  return useQuery({
    queryKey: queryKeys.sections.detail(id ?? 0),
    queryFn: () => getSectionById(id as number),
    enabled: typeof id === "number",
  });
}

/**
 * Get section with all subsections
 */
export function useSectionWithSubsections(id?: number) {
  return useQuery({
    queryKey: [...queryKeys.sections.detail(id ?? 0), "withSubsections"],
    queryFn: () => getSectionWithSubsections(id as number),
    enabled: typeof id === "number",
  });
}

/**
 * Create a new section
 */
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSectionDto) => createSection(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.lists() });
      // Invalidate the parent profile type's detail queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(variables.profileTypeId),
      });
    },
  });
}

/**
 * Update an existing section
 */
export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      profileTypeId,
    }: {
      id: number;
      data: UpdateSectionDto;
      profileTypeId: number;
    }) => updateSection(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(variables.profileTypeId),
      });
    },
  });
}

/**
 * Delete a section
 */
export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      profileTypeId,
    }: {
      id: number;
      profileTypeId: number;
    }) => deleteSection(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(variables.profileTypeId),
      });
    },
  });
}

/**
 * Reorder sections within a profile type
 */
export function useReorderSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileTypeId,
      reorderMap,
    }: {
      profileTypeId: number;
      reorderMap: ReorderMap;
    }) => reorderSections(profileTypeId, reorderMap),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileTypes.detail(variables.profileTypeId),
      });
    },
  });
}
