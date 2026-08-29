import { z } from "zod";

/**
 * Schema for creating a subscription discount
 */
export const createDiscountSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  discountPercentage: z
    .number({ error: "نسبة الخصم مطلوبة" })
    .min(0, "نسبة الخصم يجب أن تكون 0 أو أكثر")
    .max(100, "نسبة الخصم يجب أن تكون 100 أو أقل"),
  endDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
});

export type CreateDiscountFormData = z.infer<typeof createDiscountSchema>;

/**
 * Schema for updating subscription settings
 */
export const updateSettingsSchema = z.object({
  isSubscriptionEnabled: z.boolean().optional(),
  subscriptionFee: z
    .number({ error: "رسوم الاشتراك مطلوبة" })
    .min(0, "رسوم الاشتراك يجب أن تكون 0 أو أكثر")
    .optional(),
  subscriptionEndDate: z.string().optional(),
  activeDiscountId: z.number().nullable().optional(),
});

export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
