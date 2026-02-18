import type { PaginatedQueryParams } from "@/shared/types";

export enum ProfileStatus {
  Draft = 0,
  Unpublished = 1,
  Published = 2,
  PendingSubscription = 3,
}

export interface AdminProfileDto {
  id: number;
  userId: number;
  userName: string;
  userPhone?: string | null;
  profileTypeName: string;
  academicYearId: number;
  academicYearName: string;
  status: ProfileStatus;
  createdAt: string;
  shareUrl?: string | null;
}

export interface ProfileFilterParams extends PaginatedQueryParams {
  Status?: ProfileStatus;
  AcademicYearId?: number;
  FromDate?: string;
  ToDate?: string;
}
