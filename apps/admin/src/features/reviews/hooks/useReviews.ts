"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type { CreateReviewDto, UpdateReviewDto } from "../types/reviews.types";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
  uploadReviewerPhoto,
} from "../services/reviews.service";

export function useReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.lists(),
    queryFn: () => getReviews(),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewDto) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReviewDto }) =>
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
  });
}

export function useUploadReviewerPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadReviewerPhoto(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
  });
}
