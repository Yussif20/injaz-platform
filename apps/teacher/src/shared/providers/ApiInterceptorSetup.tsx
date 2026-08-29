"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/shared/lib/api";
import { ROUTES } from "@/config";

let interceptorAttached = false;

/**
 * Attaches a response interceptor to clientApi:
 * - On 401: try to refresh token via /api/auth/refresh, then retry the request.
 * - If refresh fails: clear all query cache and redirect to sign-in so the user
 *   never sees the dashboard with stale/false data.
 */
export function ApiInterceptorSetup() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (interceptorAttached) return;
    interceptorAttached = true;

    let isRefreshing = false;
    const pendingQueue: Array<{
      resolve: (value?: unknown) => void;
      reject: (reason?: unknown) => void;
    }> = [];

    const processQueue = (error: unknown = null) => {
      pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
      });
      pendingQueue.length = 0;
    };

    clientApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Let auth endpoint 401s (wrong credentials) pass through to the caller
        const url = originalRequest?.url || "";
        const isAuthEndpoint = url.startsWith("/api/auth/");

        if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then(() => clientApi(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await clientApi.post("/api/auth/refresh");
          processQueue();
          return clientApi(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // Skip redirect on the print page (rendered by Puppeteer without cookies)
          if (window.location.pathname.endsWith("/print")) {
            return Promise.reject(refreshError);
          }
          // Clear all cached data so dashboard never shows stale data after redirect
          queryClient.clear();
          // Redirect to sign-in (or landing) so user must log in again
          window.location.href = ROUTES.SIGN_IN;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );
  }, [queryClient]);

  return null;
}
