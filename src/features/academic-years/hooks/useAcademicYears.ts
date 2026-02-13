"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from "../types/academic-years.types";
import {
  activateAcademicYear,
  closeAcademicYear,
  createAcademicYear,
  deactivateAcademicYear,
  deleteAcademicYear,
  getAcademicYearById,
  getAcademicYears,
  getActiveAcademicYears,
  updateAcademicYear,
} from "../services/academic-years.service";

const activeAcademicYearsKey = ["academicYears", "active"] as const;

export function useAcademicYears() {
  return useQuery({
    queryKey: queryKeys.academicYears.lists(),
    queryFn: () => getAcademicYears(),
  });
}

export function useActiveAcademicYears() {
  return useQuery({
    queryKey: activeAcademicYearsKey,
    queryFn: () => getActiveAcademicYears(),
  });
}

export function useAcademicYear(id?: number) {
  return useQuery({
    queryKey: queryKeys.academicYears.detail(id ?? 0),
    queryFn: () => getAcademicYearById(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAcademicYearDto) => createAcademicYear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAcademicYearDto }) =>
      updateAcademicYear(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAcademicYear(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}

export function useActivateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activateAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}

export function useDeactivateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}

export function useCloseAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => closeAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.academicYears.lists(),
      });
      queryClient.invalidateQueries({ queryKey: activeAcademicYearsKey });
    },
  });
}
