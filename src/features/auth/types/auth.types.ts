export interface AdminUser {
  id: number;
  fullName: string;
  phone: string;
  role: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}
