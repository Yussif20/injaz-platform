export interface AcademicYearDto {
  id: number;
  yearName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreateAcademicYearDto {
  yearName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export type UpdateAcademicYearDto = CreateAcademicYearDto;
