"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateSubsectionDto,
  UpdateSubsectionDto,
  ReorderMap,
} from "../types/profile-types.types";
import {
  getSubsectionsBySection,
  getSubsectionById,
  createSubsection,
  updateSubsection,
  deleteSubsection,
  reorderSubsections,
} from "../services/subsections.service";

/**
 * Get all subsections for a section
 */
export function useSubsectionsBySection(sectionId?: number) {
  return useQuery({
    queryKey: [...queryKeys.subsections.lists(), sectionId],
    queryFn: () => getSubsectionsBySection(sectionId as number),
    enabled: typeof sectionId === "number",
  });
}

/**
 * Get single subsection by ID
 */
export function useSubsection(id?: number) {
  return useQuery({
    queryKey: queryKeys.subsections.detail(id ?? 0),
    queryFn: () => getSubsectionById(id as number),
    enabled: typeof id === "number",
  });
}

/**
 * Create a new subsection
 */
export function useCreateSubsection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubsectionDto) => createSubsection(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.lists(),
      });
      // Invalidate the parent section's detail queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.sectionId),
      });
    },
  });
}

/**
 * Update an existing subsection
 */
export function useUpdateSubsection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      sectionId,
    }: {
      id: number;
      data: UpdateSubsectionDto;
      sectionId: number;
    }) => updateSubsection(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.sectionId),
      });
    },
  });
}

/**
 * Delete a subsection
 */
export function useDeleteSubsection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sectionId }: { id: number; sectionId: number }) =>
      deleteSubsection(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.sectionId),
      });
    },
  });
}

/**
 * Reorder subsections within a section
 */
export function useReorderSubsections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      reorderMap,
    }: {
      sectionId: number;
      reorderMap: ReorderMap;
    }) => reorderSubsections(sectionId, reorderMap),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subsections.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sections.detail(variables.sectionId),
      });
    },
  });
}
