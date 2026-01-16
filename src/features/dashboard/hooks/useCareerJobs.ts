/**
 * useCareerJobs hook - Fetch career jobs data
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getCareerJobs } from "../services/career.service";

export const CAREER_JOBS_QUERY_KEY = ["careerJobs"];

export function useCareerJobs() {
  const query = useQuery({
    queryKey: CAREER_JOBS_QUERY_KEY,
    queryFn: async () => {
      const response = await getCareerJobs();
      if (!response.status) {
        console.warn("Career jobs fetch returned error:", response.message);
        return [];
      }
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    careerJobs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
