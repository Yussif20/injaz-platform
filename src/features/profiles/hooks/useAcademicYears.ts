/**
 * useAcademicYears hook - Fetch active academic years
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveAcademicYears } from "../services/reference.service";

export const ACADEMIC_YEARS_QUERY_KEY = ["academicYears"];

export function useAcademicYears() {
  const query = useQuery({
    queryKey: ACADEMIC_YEARS_QUERY_KEY,
    queryFn: async () => {
      const response = await getActiveAcademicYears();
      if (!response.status) {
        console.warn("Academic years fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (reference data changes infrequently)
    retry: 1,
  });

  return {
    academicYears: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
