import { apiClient } from '@/lib/api-client';
import { AuthResponse, AuthUser, LoginDto, RegisterDto } from '../types/auth.type';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authApi = {
  login: (dto: LoginDto): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', dto),

  register: (dto: RegisterDto): Promise<AuthUser> =>
    apiClient.post<AuthUser>('/auth/register', dto),

  /**
   * Called from Server Components / Server Actions using the stored access token.
   * Uses native fetch to avoid passing token through the generic client.
   */
  getMe: async (accessToken: string): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json() as Promise<AuthUser>;
  },

  logout: (accessToken: string): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>('/auth/logout', undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
