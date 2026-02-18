import { z } from "zod";

export const academicYearSchema = z.object({
  hijriYear: z.string().min(1, "العام الهجري مطلوب"),
  gregorianYear: z.string().min(1, "العام الميلادي مطلوب"),
  status: z.enum(["Active", "Inactive", "Closed"]),
  hijriStartDate: z.string().optional(),
  hijriEndDate: z.string().optional(),
  startDate: z.string().min(1, "تاريخ البداية الميلادي مطلوب"),
  endDate: z.string().min(1, "تاريخ النهاية الميلادي مطلوب"),
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
