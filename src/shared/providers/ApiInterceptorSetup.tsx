"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { proxyApi, clientApi } from "@/shared/lib/api";

let interceptorAttached = false;

/**
 * On 401: try refresh, then retry. If refresh fails, clear all cached data
 * and redirect to login so the user never sees the dashboard with stale/false data.
 */
export function ApiInterceptorSetup() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (interceptorAttached) return;
    interceptorAttached = true;

    let isRefreshing = false;
    let pendingQueue: Array<{
      resolve: (value?: unknown) => void;
      reject: (reason?: unknown) => void;
    }> = [];

    const processQueue = (error: unknown = null) => {
      pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
      });
      pendingQueue = [];
    };

    proxyApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then(() => proxyApi(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await clientApi.post("/auth/refresh");
          processQueue();
          return proxyApi(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // Clear all cached data so dashboard never shows stale data after 401
          queryClient.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );
  }, [queryClient]);

  return null;
}
