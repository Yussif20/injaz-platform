import { z } from "zod";

// Schema for creating/updating academic years
// Status is managed via separate activate/deactivate/close API endpoints
export const academicYearSchema = z.object({
  yearName: z.string().min(1, "اسم السنة مطلوب"),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  endDate: z.string().min(1, "تاريخ النهاية مطلوب"),
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
