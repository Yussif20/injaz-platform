export interface AcademicYearDto {
  id: number;
  yearName: string;
  startDate: string; // ISO date-time format
  endDate: string; // ISO date-time format
  status: "Active" | "Inactive" | "Closed";
  subscriptionFee?: number | null;
  activeDeal?: string | null;
}

export interface CreateAcademicYearDto {
  yearName: string;
  startDate: string; // ISO date-time format: "2024-01-01T00:00:00.000Z"
  endDate: string; // ISO date-time format: "2024-12-31T00:00:00.000Z"
  status: string; // "Active" | "Inactive" | "Closed"
}

export type UpdateAcademicYearDto = CreateAcademicYearDto;
