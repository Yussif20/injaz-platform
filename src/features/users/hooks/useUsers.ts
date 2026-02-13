"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserFilterParams,
} from "../types/users.types";
import {
  createUser,
  deleteUser,
  getFilteredUsers,
  getUserById,
  getUsers,
  updateUser,
} from "../services/users.service";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => getUsers(),
  });
}

export function useFilteredUsers(params?: UserFilterParams) {
  return useQuery({
    queryKey: queryKeys.users.filtered(params),
    queryFn: () => getFilteredUsers(params),
  });
}

export function useUser(id?: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? 0),
    queryFn: () => getUserById(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.filtered() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      updateUser(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.filtered() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.filtered() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}
