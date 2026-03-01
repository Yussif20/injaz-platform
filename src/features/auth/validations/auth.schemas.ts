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

// Password requirement checks (for UI guide + schema)
const PASSWORD_MIN_LENGTH = 8;
const hasMinLength = (s: string) => s.length >= PASSWORD_MIN_LENGTH;
const hasUpperCase = (s: string) => /[A-Z]/.test(s);
const hasLowerCase = (s: string) => /[a-z]/.test(s);
const hasNumber = (s: string) => /[0-9]/.test(s);
const hasSpecialChar = (s: string) => /[^A-Za-z0-9]/.test(s);

/** Use in UI to show per-rule checkmarks; same rules as passwordSchema */
export function getPasswordChecks(password: string) {
  return {
    minLength: hasMinLength(password),
    upperCase: hasUpperCase(password),
    lowerCase: hasLowerCase(password),
    number: hasNumber(password),
    specialChar: hasSpecialChar(password),
    allPass:
      hasMinLength(password) &&
      hasUpperCase(password) &&
      hasLowerCase(password) &&
      hasNumber(password) &&
      hasSpecialChar(password),
  };
}

// Progressive password messages: show first failing requirement in order
function getPasswordErrorMessage(val: string): string {
  if (!val || val.length === 0) return "كلمة المرور مطلوبة";
  if (!hasMinLength(val))
    return "كلمة المرور يجب أن تحتوي على: ٨ أحرف على الأقل";
  if (!hasUpperCase(val))
    return "كلمة المرور يجب أن تحتوي على: حرف إنجليزي كبير واحد على الأقل (A-Z)";
  if (!hasLowerCase(val))
    return "كلمة المرور يجب أن تحتوي على: حرف إنجليزي صغير واحد على الأقل (a-z)";
  if (!hasNumber(val))
    return "كلمة المرور يجب أن تحتوي على: رقم واحد على الأقل (0-9)";
  if (!hasSpecialChar(val))
    return "كلمة المرور يجب أن تحتوي على: رمز خاص واحد على الأقل (!@#$...)";
  return "";
}

// Password validation (align with backend: min 8, upper, lower, number)
const passwordSchema = z
  .string()
  .min(1, "كلمة المرور مطلوبة")
  .superRefine((val, ctx) => {
    if (hasMinLength(val) && hasUpperCase(val) && hasLowerCase(val) && hasNumber(val) && hasSpecialChar(val))
      return;
    const message = getPasswordErrorMessage(val);
    if (message)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  });

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
