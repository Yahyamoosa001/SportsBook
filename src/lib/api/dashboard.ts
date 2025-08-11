
import { apiClient } from './client';
import { DashboardStats, Booking, Facility, User, ApiResponse } from '@/types';

export const dashboardApi = {
  async getUserStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/user/dashboard');
    return response.data.data;
  },

  async getOwnerStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/owner/dashboard');
    return response.data.data;
  },

  async getAdminStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data.data;
  },

  async getPendingFacilities(): Promise<Facility[]> {
    const response = await apiClient.get<ApiResponse<Facility[]>>('/admin/facilities/pending');
    return response.data.data;
  },

  async approveFacility(id: string, approved: boolean, comments?: string): Promise<void> {
    await apiClient.put(`/admin/facilities/${id}/approve`, { approved, comments });
  },

  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return response.data.data;
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    await apiClient.put(`/admin/users/${id}/status`, { isActive });
  },
};
