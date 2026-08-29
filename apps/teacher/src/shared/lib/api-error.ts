/**
 * Reading an error returned by the backend.
 *
 * The route handlers each used to narrow this by hand — `catch (error: any)` followed by
 * `error?.response?.status`, or a structural `"response" in error` check with an inline
 * cast. Axios ships a type guard for exactly this, and `unknown` in the catch clause means
 * the compiler enforces that something narrows it before it is read.
 */

import axios from "axios";

/** HTTP status the backend replied with, or 500 when the request never got an answer. */
export function backendStatus(error: unknown): number {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? 500;
  }
  return 500;
}

/** The backend's own error message, falling back to `fallback` when it did not send one. */
export function backendMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}
