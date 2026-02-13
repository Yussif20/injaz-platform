import { z } from "zod";

export const academicYearSchema = z.object({
  yearName: z.string().min(1, "Year name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.string().min(1, "Status is required"),
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
