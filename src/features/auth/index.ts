/**
 * Auth feature barrel export
 */

// Components
export {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ForgotPasswordFlow,
  OnboardingFlow,
  OtpInput,
  StepIndicator,
} from "./components";

// Hooks
export {
  useAuth,
  useLogin,
  useRegister,
  useForgotPassword,
  useLogout,
  AUTH_QUERY_KEY,
} from "./hooks";

// Context
export { AuthProvider, useAuthContext } from "./context";

// Types
export type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthState,
  RegistrationStep,
  RegistrationFormData,
} from "./types/auth.types";

export { Gender, VerificationPurpose, isApiSuccess } from "./types/auth.types";

// Validation schemas
export {
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  registerDetailsSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./validations/auth.schemas";

export type {
  LoginFormValues,
  SendOtpFormValues,
  VerifyOtpFormValues,
  RegisterDetailsFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  ChangePasswordFormValues,
} from "./validations/auth.schemas";
