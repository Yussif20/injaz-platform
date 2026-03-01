import { authContent } from "@/content";

type AxiosErrorLike = {
  response?: { data?: { message?: string; errors?: string[] | null } };
  message?: string;
};

/**
 * Map backend register error (e.g. 400 phone/email already used) to a clear Arabic message.
 */
export function getRegisterErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosErrorLike;
  const backendMessage =
    axiosErr?.response?.data?.message?.trim() || "";
  const errors = axiosErr?.response?.data?.errors;

  const msg = (backendMessage || axiosErr?.message || "").toLowerCase();

  // Map common backend messages to Arabic (backend may send English or Arabic)
  if (
    msg.includes("phone") &&
    (msg.includes("used") || msg.includes("already") || msg.includes("exists") || msg.includes("registered"))
  ) {
    return authContent.errors.phoneAlreadyUsed;
  }
  if (
    msg.includes("email") &&
    (msg.includes("used") || msg.includes("already") || msg.includes("exists") || msg.includes("registered"))
  ) {
    return authContent.errors.emailAlreadyUsed;
  }
  if (
    msg.includes("رقم الجوال") &&
    (msg.includes("مستخدم") || msg.includes("مسجل"))
  ) {
    return authContent.errors.phoneAlreadyUsed;
  }
  if (
    msg.includes("البريد") &&
    (msg.includes("مستخدم") || msg.includes("مسجل"))
  ) {
    return authContent.errors.emailAlreadyUsed;
  }

  // Use first error from array if present
  if (errors?.length) {
    const first = String(errors[0]).toLowerCase();
    if (
      first.includes("phone") &&
      (first.includes("used") || first.includes("already") || first.includes("exists"))
    ) {
      return authContent.errors.phoneAlreadyUsed;
    }
    if (
      first.includes("email") &&
      (first.includes("used") || first.includes("already") || first.includes("exists"))
    ) {
      return authContent.errors.emailAlreadyUsed;
    }
    return errors[0];
  }

  // Fallback: use backend message if it looks like Arabic or a short message, else generic
  if (backendMessage && (backendMessage.length < 120 || /[\u0600-\u06FF]/.test(backendMessage))) {
    return backendMessage;
  }
  return authContent.errors.registerFailed;
}
