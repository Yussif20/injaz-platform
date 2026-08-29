import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import {
  getSubscriptionInfo,
  getAllSubscriptions,
  getFilteredSubscriptions,
} from "../services/subscriptions.service";
import {
  getAllDiscounts,
  getActiveDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscount,
} from "../services/discounts.service";
import {
  getSubscriptionSettings,
  updateSubscriptionSettings,
  toggleSubscriptions,
  setActiveDiscount,
} from "../services/settings.service";
import type {
  SubscriptionFilterParams,
  CreateSubscriptionDiscountDto,
  UpdateSubscriptionDiscountDto,
  UpdateSubscriptionSettingsDto,
} from "../types/subscriptions.types";

// ========================================
// Subscriptions Hooks
// ========================================

/**
 * Fetch subscription info (fees, discount, days remaining)
 */
export function useSubscriptionInfo() {
  return useQuery({
    queryKey: ["subscriptions", "info"],
    queryFn: getSubscriptionInfo,
  });
}

/**
 * Fetch all subscriptions (Admin)
 */
export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions.all(),
    queryFn: getAllSubscriptions,
  });
}

/**
 * Fetch filtered subscriptions with pagination (Admin)
 */
export function useFilteredSubscriptions(params: SubscriptionFilterParams) {
  return useQuery({
    queryKey: queryKeys.subscriptions.filtered(params),
    queryFn: () => getFilteredSubscriptions(params),
  });
}

// ========================================
// Discounts Hooks
// ========================================

/**
 * Fetch all discounts
 */
export function useDiscounts() {
  return useQuery({
    queryKey: queryKeys.subscriptionDiscounts.all(),
    queryFn: getAllDiscounts,
  });
}

/**
 * Fetch active discounts
 */
export function useActiveDiscounts() {
  return useQuery({
    queryKey: ["subscriptionDiscounts", "active"],
    queryFn: getActiveDiscounts,
  });
}

/**
 * Fetch discount by ID
 */
export function useDiscount(id: number) {
  return useQuery({
    queryKey: queryKeys.subscriptionDiscounts.detail(id),
    queryFn: () => getDiscountById(id),
    enabled: !!id,
  });
}

/**
 * Create a new discount
 */
export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionDiscountDto) => createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionDiscounts.all(),
      });
    },
  });
}

/**
 * Update a discount
 */
export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateSubscriptionDiscountDto;
    }) => updateDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionDiscounts.all(),
      });
    },
  });
}

/**
 * Delete a discount
 */
export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionDiscounts.all(),
      });
    },
  });
}

/**
 * Toggle discount active status
 */
export function useToggleDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionDiscounts.all(),
      });
    },
  });
}

// ========================================
// Settings Hooks
// ========================================

/**
 * Fetch global subscription settings
 */
export function useSubscriptionSettings() {
  return useQuery({
    queryKey: queryKeys.subscriptionSettings.all(),
    queryFn: getSubscriptionSettings,
  });
}

/**
 * Update global subscription settings
 */
export function useUpdateSubscriptionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubscriptionSettingsDto) =>
      updateSubscriptionSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionSettings.all(),
      });
    },
  });
}

/**
 * Toggle subscriptions enabled globally
 */
export function useToggleSubscriptions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSubscriptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionSettings.all(),
      });
    },
  });
}

/**
 * Set active discount for new subscriptions
 */
export function useSetActiveDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discountId: number) => setActiveDiscount(discountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionSettings.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptionDiscounts.all(),
      });
    },
  });
}
