export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  fullname: string;
  address: string;
  role?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullname: string;
  role: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type AuthActionState = {
  error: string | null;
};
