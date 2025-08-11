
import { apiClient } from './client';
import { User, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  async register(data: RegisterData): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/register', data);
  },

  async verifyOtp(otp: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/verify-otp',
      { otp }
    );
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
