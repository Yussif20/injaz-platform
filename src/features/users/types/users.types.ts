import { Gender } from "@/shared/types";

export interface PersonalInfoDto {
  rankId: number;
  rankTitleMale: string;
  rankTitleFemale: string;
  rankTitle: string;
  nationalId: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export interface QualificationDto {
  id: number;
  degreeType: string;
  title: string;
  graduationDate: string;
}

export interface CareerJobDto {
  id: number;
  school: string;
  educationalStage: string;
  startYear: string;
  endYear: string;
}

export interface SubscriptionDto {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
}

export interface UserDto {
  id: number;
  phone: string;
  fullName: string;
  gender: Gender;
  role: string;
  imageUrl: string;
  personalInfo: PersonalInfoDto | null;
  qualifications: QualificationDto[];
  careerJobs: CareerJobDto[];
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  isSubscribed: boolean;
  currentSubscription: SubscriptionDto | null;
}

export interface CreateUserDto {
  phone: string;
  password: string;
  fullName: string;
  role: string;
}

export interface UpdateUserDto {
  fullName: string;
  gender: Gender;
  imageUrl: string;
  personalInfo: PersonalInfoDto | null;
  qualifications: QualificationDto[];
  careerJobs: CareerJobDto[];
}

export interface UserFilterParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDescending?: boolean;
  Role?: number; // 0 = Admin, 1 = Teacher
  IsActive?: boolean;
}
