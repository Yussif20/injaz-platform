/**
 * Authentication validation schemas using Zod
 */

import { z } from "zod";
import { Gender, VerificationPurpose } from "../types/auth.types";

// Phone validation (Saudi format)
const phoneSchema = z
  .string()
  .min(1, "رقم الجوال مطلوب")
  .regex(/^[0-9+]+$/, "رقم الجوال يجب أن يحتوي على أرقام فقط")
  .min(9, "رقم الجوال يجب أن يكون 9 أرقام على الأقل")
  .max(15, "رقم الجوال طويل جداً");

// Password validation
const passwordSchema = z
  .string()
  .min(1, "كلمة المرور مطلوبة")
  .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل");

// Email validation (optional)
const emailSchema = z
  .string()
  .email("البريد الإلكتروني غير صالح")
  .optional()
  .or(z.literal(""));

// OTP validation
const otpSchema = z
  .string()
  .min(1, "رمز التحقق مطلوب")
  .length(5, "رمز التحقق يجب أن يكون 5 أرقام")
  .regex(/^[0-9]+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط");

// Login schema
export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Send OTP schema (step 1 of registration)
export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;

// Verify OTP schema (step 2 of registration)
export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  purpose: z.nativeEnum(VerificationPurpose).optional(),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// Registration details schema (step 3)
export const registerDetailsSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "الاسم الثلاثي مطلوب")
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم طويل جداً"),
    phone: phoneSchema,
    gender: z.nativeEnum(Gender, {
      message: "النوع مطلوب",
    }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterDetailsFormValues = z.infer<typeof registerDetailsSchema>;

// Full registration schema (for API)
export const registerSchema = z.object({
  fullName: z.string().min(1),
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  gender: z.nativeEnum(Gender),
  email: z.string().optional(),
  verificationCode: otpSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Forgot password schema (step 1)
export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Reset password schema (step 2)
export const resetPasswordSchema = z
  .object({
    phone: phoneSchema,
    code: otpSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Change password schema (authenticated user)
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
