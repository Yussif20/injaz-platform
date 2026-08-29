/**
 * useTemplates hook - Fetch available templates
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplates, getTemplateSummaryList } from "../services/templates.service";
import type { Template, TemplateSummary } from "../types/template.types";

export const TEMPLATES_QUERY_KEY = ["templates"];
export const TEMPLATE_SUMMARIES_QUERY_KEY = ["templateSummaries"];

/**
 * Hook to fetch all templates with full configuration
 */
export function useTemplates() {
  const query = useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: async () => {
      const response = await getTemplates();
      if (!response.status) {
        console.warn("Templates fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (templates change very infrequently)
    retry: 1,
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to fetch template summaries (lightweight, for selectors)
 */
export function useTemplateSummaries() {
  const query = useQuery({
    queryKey: TEMPLATE_SUMMARIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getTemplateSummaryList();
      if (!response.status) {
        console.warn("Template summaries fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });

  return {
    templateSummaries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Helper hook to get a specific template from the list
 */
export function useTemplate(templateId: number) {
  const { templates, isLoading, isError } = useTemplates();

  const template = templates.find(t => t.id === templateId);

  return {
    template,
    isLoading,
    isError,
    isNotFound: !isLoading && !template,
  };
}
