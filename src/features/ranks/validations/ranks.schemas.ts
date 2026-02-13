import { z } from "zod";

export const rankSchema = z.object({
  titleMale: z.string().min(1, "مطلوب"),
  titleFemale: z.string().min(1, "مطلوب"),
});

export type RankFormData = z.infer<typeof rankSchema>;
