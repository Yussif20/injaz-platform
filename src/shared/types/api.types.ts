// ── Backend envelope ──────────────────────────────────────────────

export interface ApiResponse<T> {
  status: "Success" | "Failure";
  message: string;
  data: T;
  errors: string[] | null;
}

export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

// ── Query params ─────────────────────────────────────────────────

export interface PaginatedQueryParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDescending?: boolean;
}

// ── Enums ────────────────────────────────────────────────────────

export enum Gender {
  Male = 1,
  Female = 2,
}

export enum GenderAvailability {
  Male = 1,
  Female = 2,
  Both = 3,
}

export enum UserRole {
  Admin = "Admin",
  User = "User",
}

export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Failed = 3,
  Refunded = 4,
}

export enum ProfileStatus {
  Draft = 1,
  Published = 2,
  Archived = 3,
}

// ── Error class ──────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  errors: string[] | null;

  constructor(message: string, status: number, errors: string[] | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
