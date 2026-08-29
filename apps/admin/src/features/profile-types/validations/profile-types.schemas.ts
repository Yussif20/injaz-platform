import { z } from "zod";
import { GenderAvailability } from "@/shared/types";

/**
 * Profile Type form validation schema
 */
export const profileTypeSchema = z.object({
  typeNameMale: z.string().min(1, "اسم النوع للذكور مطلوب"),
  typeNameFemale: z.string().min(1, "اسم النوع للإناث مطلوب"),
  description: z.string().optional(),
  availableFor: z.nativeEnum(GenderAvailability, {
    error: "حدد التوفر مطلوب",
  }),
});

export type ProfileTypeFormData = z.infer<typeof profileTypeSchema>;

/**
 * Section form validation schema
 */
export const sectionSchema = z.object({
  profileTypeId: z.number().min(1, "نوع الملف مطلوب"),
  title: z.string().min(1, "عنوان القسم مطلوب"),
  weightPercent: z
    .number()
    .min(0, "النسبة المئوية يجب أن تكون 0 أو أكثر")
    .max(100, "النسبة المئوية لا يمكن أن تتجاوز 100"),
  displayOrder: z.number().min(0, "ترتيب العرض مطلوب"),
});

export type SectionFormData = z.infer<typeof sectionSchema>;

/**
 * Subsection form validation schema
 */
export const subsectionSchema = z.object({
  sectionId: z.number().min(1, "القسم مطلوب"),
  title: z.string().min(1, "عنوان القسم الفرعي مطلوب"),
  displayOrder: z.number().min(0, "ترتيب العرض مطلوب"),
  maxImageCount: z.number().nullable().optional(),
  maxImageSize: z.number().nullable().optional(), // bytes
});

export type SubsectionFormData = z.infer<typeof subsectionSchema>;
