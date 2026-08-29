import { z } from "zod";

export const socialsSchema = z.object({
  instagram: z.string().optional().default(""),
  snapchat: z.string().optional().default(""),
  tiktok: z.string().optional().default(""),
  x: z.string().optional().default(""),
  facebook: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
});

export type SocialsSchema = z.infer<typeof socialsSchema>;
