import { z } from "zod";

export const createUserSchema = z.object({
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  role: z.string().min(1, "الدور مطلوب"),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
