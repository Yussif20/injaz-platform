export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthData {
  user: AdminUser;
  token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}
