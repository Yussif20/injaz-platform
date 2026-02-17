export interface AcademicYearDto {
  id: number;
  yearName: string;
  startDate: string; // ISO date-time format
  endDate: string; // ISO date-time format
  status: "Active" | "Inactive" | "Closed";
}

// Backend CreateAcademicYearDto - status is managed via activate/deactivate/close endpoints
export interface CreateAcademicYearDto {
  yearName: string;
  startDate: string; // ISO date-time format: "2024-01-01T00:00:00.000Z"
  endDate: string; // ISO date-time format: "2024-12-31T00:00:00.000Z"
}

export type UpdateAcademicYearDto = CreateAcademicYearDto;
