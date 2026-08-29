"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type { PaginatedQueryParams } from "@/shared/types";
import type { CreateRankDto, UpdateRankDto } from "../types/ranks.types";
import {
  createRank,
  deleteRank,
  getFilteredRanks,
  getRankById,
  getRanks,
  updateRank,
} from "../services/ranks.service";

export function useRanks() {
  return useQuery({
    queryKey: queryKeys.ranks.lists(),
    queryFn: () => getRanks(),
  });
}

export function useFilteredRanks(params?: PaginatedQueryParams) {
  return useQuery({
    queryKey: queryKeys.ranks.filtered(params),
    queryFn: () => getFilteredRanks(params),
  });
}

export function useRank(id?: number) {
  return useQuery({
    queryKey: queryKeys.ranks.detail(id ?? 0),
    queryFn: () => getRankById(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRankDto) => createRank(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.filtered() });
    },
  });
}

export function useUpdateRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRankDto }) =>
      updateRank(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.filtered() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ranks.detail(variables.id),
      });
    },
  });
}

export function useDeleteRank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRank(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.filtered() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranks.detail(id) });
    },
  });
}
