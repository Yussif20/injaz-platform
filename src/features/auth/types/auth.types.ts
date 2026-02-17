export interface AdminUser {
  userId: number;
  fullName: string;
  userName: string;
  phone: string;
  role: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

// Backend response structure
export interface AuthResponseDto {
  status: string;
  message: string;
  data: {
    userId: number;
    phone: string;
    fullName: string;
    userName: string;
    role: string;
    token: string;
    refreshToken: string;
  };
}
